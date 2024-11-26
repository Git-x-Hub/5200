import React, { useEffect, useState } from 'react';
import axios from 'axios';
import presentIcon from './assets/images/check.png'
import absentIcon from './assets/images/x.png'

const Attendance = ({ setOpen, setMemberId, setMemberName, search }) => {

    const [attendance, setAttendance] = useState([]);

    useEffect(() => {

        const fetchMembersAttendance = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/attendance/today");
                const attendance = response.data.map((record) => ({
                    memberId: record.memberId,
                    memberName: `${record.firstName} ${record.lastName}`,
                    attendanceStatus: record.attendanceStatus || 'Not Marked'
                }));
                setAttendance(attendance);
            } catch (error) {
                console.error("Error fetching Attendance!", error);
            }
        }
        fetchMembersAttendance();

    }, [attendance]);

    const toggleModal = (event) => {
        setOpen(true);
        setMemberId(event.currentTarget.getAttribute('member-id'));
    };

    const present = async (event) => {

        event.stopPropagation();
        const memberId = event.currentTarget.getAttribute('member-id');

        try {
            await axios.post('http://localhost:3001/api/attendance', {
                attendanceStatus: 'present',
                memberId: memberId,
            });
        } catch (error) {
            console.error('Error creating attendance:', error);
        }
    }

    const absent = async (event) => {

        event.stopPropagation();
        const memberId = event.currentTarget.getAttribute('member-id');

        try {
            await axios.post('http://localhost:3001/api/attendance', {
                attendanceStatus: 'absent',
                memberId: memberId,
            });
        } catch (error) {
            console.error('Error creating attendance:', error);
        }
    }

    const filteredMembers = attendance.filter(member =>
        `${member.memberName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <center>
                <div class="container">
                    {filteredMembers.map(members => (
                        <div class={`list ${members.attendanceStatus === 'present' ? ("border-green-400") :
                            members.attendanceStatus === 'absent' ? ("border-red-400") :
                                ("border-gray-300")}`}
                            member-id={members.memberId}
                            onClick={(event) => { toggleModal(event); setMemberName(members.memberName); }}>
                            {members.memberName}
                            <div class="flex flex-row">
                                <img
                                    src={presentIcon}
                                    alt="present icon"
                                    className={`image-button ${members.attendanceStatus === 'present' ? "pointer-events-none cursor-not-allowed opacity-40" : ""}`}
                                    member-id={members.memberId}
                                    onClick={present} />
                                <img
                                    src={absentIcon}
                                    alt="absent icon"
                                    className={`image-button ${members.attendanceStatus === 'absent' ? "pointer-events-none cursor-not-allowed opacity-40" : ""}`}
                                    member-id={members.memberId}
                                    onClick={absent} />
                            </div>
                        </div>
                    ))}
                </div>
            </center>
        </div >
    );
}

export default Attendance;