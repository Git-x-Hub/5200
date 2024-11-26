import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Members = ({ setOpen, setIsEdit, setMemberId, search }) => {

    const [members, setMembers] = useState([]);

    useEffect(() => {

        const fetchMembers = async () => {

            try {
                const response = await axios.get("http://localhost:3001/api/members");
                setMembers(response.data);
            } catch (error) {
                console.error("Error fetching member!", error);
            }
        }
        fetchMembers();
    }, [members]);

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
                        <div class="list"
                            member-id={members.id}
                            onClick={(toggleModal)}>
                            {members.firstName} {members.lastName}
                        </div>
                    ))}
                </div>
            </center>
        </div>
    );
}

export default Members;