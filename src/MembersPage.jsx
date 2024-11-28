import React, { useState } from 'react';
import Members from './Members';
import MemberModal from './MemberModal';

const MembersPage = ({search, members, setMembers}) => {
    const [memberId, setMemberId] = useState(null);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);

    const add = () => {
        setOpen(true);
        setIsAdd(true);
        setIsEdit(false);
    };

    return (
        <div>
            <center>
                <button onClick={add}>New member</button>
                <Members 
                    setOpen={setOpen}
                    setIsEdit={setIsEdit}
                    members={members}
                    setMembers={setMembers}
                    memberId={memberId}
                    setMemberId={setMemberId}
                    search={search}/>
            </center>
            <MemberModal
                open={open}
                setOpen={setOpen}
                isAdd={isAdd}
                setIsAdd={setIsAdd}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                memberId={memberId}
                setMemberId={setMemberId}
            />
        </div>
    );
};

export default MembersPage;