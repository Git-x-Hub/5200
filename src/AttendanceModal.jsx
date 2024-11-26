import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceModal = ({ open, setOpen, memberId, setMemberId, memberName }) => {

    const [attendance, setAttendance] = useState([]);

    useEffect(() => {

        const fetchAttendance = async () => {

            try {
                const response = await axios.get(`http://localhost:3001/api/attendance/${memberId}`);
                setAttendance(response.data);
            } catch (error) {
                console.error("Error fetching attendace!", error);
            }
        }
        fetchAttendance();
    }, [memberId]);

    const handleReset = () => {
        setOpen(false);
        setMemberId(null);
    };

    return (
        <>
            {open && (
                <div class='backdrop' onClick={handleReset}>
                    <div class='modal' onClick={(event) => event.stopPropagation()}>
                        <center><h3>{memberName}</h3></center>
                        <div className='table'>
                            {attendance.map(attendance => (
                                <div class="table-row">
                                    <div class="table-item">
                                        {attendance.attendaceDate}
                                    </div>
                                    <div class={`table-item ${attendance.attendanceStatus === 'present' ? "text-green-600" : "text-red-500"}`}>
                                        {attendance.attendanceStatus.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AttendanceModal;