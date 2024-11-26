import React, { useState } from 'react';
import Attendance from './Attendance';
import AttendanceModal from './AttendanceModal';

const AttendancePage = ({search}) => {
    const [memberId, setMemberId] = useState(null);
    const [memberName, setMemberName] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <div>
            <center>
                <Attendance 
                    setOpen={setOpen}
                    setMemberId={setMemberId}
                    setMemberName={setMemberName}
                    search={search}/>
            </center>
            <AttendanceModal
                open={open}
                setOpen={setOpen}
                memberId={memberId}
                setMemberId={setMemberId}
                memberName={memberName}
            />
        </div>
    );
};

export default AttendancePage;