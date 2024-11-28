import React from 'react';

const Members = ({ setOpen, setIsEdit, members, setMemberId, search }) => {

    const toggleModal = (event) => {
        setOpen(true);
        setIsEdit(true);
        setMemberId(event.currentTarget.getAttribute('member-id'));
    };

    const filteredMembers = members.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <center>
                <div class="container">
                    {filteredMembers.map(members => (
                        <div class="list">
                            {members.firstName} {members.lastName}
                            <div class="mt-5">
                                <button member-id={members.id} onClick={toggleModal}>View</button>
                            </div>
                        </div>
                    ))}
                </div>
            </center>
        </div>
    );
}

export default Members;