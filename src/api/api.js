const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;;

app.use(express.json());
app.use(cors());

app.post("/api/users", async (req, res) => {
  const { username, password, role } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    // Respond with created user (omit the password)
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await prisma.users.findUnique({
      where: { username },
    });

    // If user is not found, return an error
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    // Respond with the token and user details (excluding password)
    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all members with their attendance
app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.members.findMany({
      include: {
        attendance: true,
      },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get members by id
app.get('/api/member/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const member = await prisma.members.findUnique({
      where: { id },
    });

    if (member) {
      res.status(200).json(member);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
});

// create members
app.post('/api/member', async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;
  try {
    const newMember = await prisma.members.create({
      data: {
        email,
        firstName,
        lastName,
        phoneNumber
      },
    });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ error: 'Error creating member' });
  }
});

// update member
app.put('/api/member/:id', async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName, phoneNumber } = req.body;

  try {
    const updatedUser = await prisma.members.update({
      where: { id },
      data: {
        email,
        firstName,
        lastName,
        phoneNumber
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "User not found or update failed" });
  }
});

// delete member
app.delete('/api/member/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.members.delete({
      where: { id },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "User not found or delete failed" });
  }
});

//create attendance
app.post('/api/attendance', async (req, res) => {
  const { attendanceStatus, memberId } = req.body;
  try {
    const newAttendance = await prisma.attendance.create({
      data: {
        attendanceStatus,
        members: { connect: { id: memberId } }
      },
    });
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ error: 'Error creating member' });
  }
});

// get attendance of all member of current day
app.get('/api/attendance/today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch all members and their attendance records for today
    const membersWithAttendance = await prisma.members.findMany({
      include: {
        attendance: {
          where: {
            attendaceDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        },
      },
    });

    const response = membersWithAttendance.map((member) => {
      // Find the latest attendance record
      const latestAttendance = member.attendance
        .sort((a, b) => new Date(b.attendaceDate) - new Date(a.attendaceDate))[0];

      return {
        memberId: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        attendanceStatus: latestAttendance ? latestAttendance.attendanceStatus : null,
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Error fetching attendance' });
  }
});

// get attendance by member id
app.get('/api/attendance/:memberId', async (req, res) => {
  const { memberId } = req.params;

  try {
    // Fetch all attendance records for the member
    const attendanceRecords = await prisma.attendance.findMany({
      where: { memberId },
      select: {
        attendaceDate: true,
        attendanceStatus: true,
      },
      orderBy: {
        attendaceDate: 'desc',
      },
    });

    // Group by day and pick the most recent record for each day
    const mostRecentPerDay = Object.values(
      attendanceRecords.reduce((acc, record) => {
        const dateKey = new Date(record.attendaceDate).toISOString().split('T')[0]; // Extract the date part
        if (!acc[dateKey]) {
          acc[dateKey] = {
            attendaceDate: dateKey,
            attendanceStatus: record.attendanceStatus,
          };
        }
        return acc;
      }, {})
    );

    res.json(mostRecentPerDay);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Error fetching attendance' });
  }
});

//create payment
app.post('/api/payment', async (req, res) => {
  const { paymentStatus, memberId } = req.body;
  try {
    const newPayment = await prisma.payments.create({
      data: {
        paymentStatus,
        members: { connect: { id: memberId } }
      },
    });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ error: 'Error creating member' });
  }
});

// get payment of all member of current day
app.get('/api/payments/today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch all members and their payment records for today
    const membersWithPayments = await prisma.members.findMany({
      include: {
        payment: {
          where: {
            paymentDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        },
      },
    });

    const response = membersWithPayments.map((member) => {
      // Find the latest payment record
      const latestPayment = member.payment
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];

      return {
        memberId: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        latestPayment: latestPayment
          ? {
            // amountPaid: latestPayment.amountPaid,
            paymentDate: latestPayment.paymentDate,
            paymentStatus: latestPayment.paymentStatus,
          }
          : null,
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// Get payments by memberId
app.get('/api/payments/:memberId', async (req, res) => {
  const { memberId } = req.params;

  try {
    // Fetch all payment records for the member
    const paymentRecords = await prisma.payments.findMany({
      where: { memberId },
      select: {
        paymentDate: true,
        paymentStatus: true,
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    // Group by day and pick the most recent record for each day
    const mostRecentPerDay = Object.values(
      paymentRecords.reduce((acc, record) => {
        const dateKey = new Date(record.paymentDate).toISOString().split('T')[0]; // Extract the date part
        if (!acc[dateKey]) {
          acc[dateKey] = {
            paymentDate: dateKey,
            amountPaid: record.amountPaid,
            paymentStatus: record.paymentStatus,
          };
        }
        return acc;
      }, {})
    );

    res.json(mostRecentPerDay);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});