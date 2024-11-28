import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contribution = ({ setOpen, setMemberId, setMemberName, search }) => {

    const [payment, setPayment] = useState([]);

    useEffect(() => {

        const fetchMembersPayment = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/payments/today");

                const payment = response.data.map((record) => ({
                    memberId: record.memberId,
                    memberName: `${record.firstName} ${record.lastName}`,
                    paymentStatus: record.latestPayment?.paymentStatus || 'unpaid',
                }));

                setPayment(payment);
            } catch (error) {
                console.error("Error fetching payments!", error);
            }
        };
        fetchMembersPayment();

    }, [payment]);

    const toggleModal = (event) => {
        setOpen(true);
        setMemberId(event.currentTarget.getAttribute('member-id'));
    };

    const paid = async (event, paymentStatus) => {

        event.stopPropagation();
        let memberId = event.currentTarget.getAttribute('member-id');
        let status = '';

        if (paymentStatus === 'paid') {
            status = 'not paid';
        } else {
            status = 'paid'
        }

        try {
            await axios.post('http://localhost:3001/api/payment', {
                paymentStatus: status,
                memberId: memberId,
            });
        } catch (error) {
            console.error('Error creating attendance:', error);
            alert(error);
        }
    }

    const filteredMembers = payment.filter(member =>
        `${member.memberName}`.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div>
            <center>
                <div class="container">
                    {filteredMembers.map(members => (
                        <div class={`list ${members.paymentStatus === 'paid' ? ("border-green-400") : ""}`}>
                            {members.memberName}
                            <div class="mt-5">
                                <div class="mt-5">
                                    <button 
                                        class="button-green" 
                                        member-id={members.memberId}
                                        onClick={(event) => { toggleModal(event); setMemberName(members.memberName); }}>View</button>
                                </div>
                                {/* {members.paymentStatus === 'paid' ?
                                    <button type="button" class="button-red" member-id={members.memberId} onClick={(event) => paid(event, members.paymentStatus)}>Unpaid</button> :
                                    <button type="button" class="button-green" member-id={members.memberId} onClick={(event) => paid(event, members.paymentStatuss)}>Paid</button>
                                } */}
                            </div>
                        </div>
                    ))}
                </div>
            </center >
        </div >
    );
}

export default Contribution;