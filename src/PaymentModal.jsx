import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceModal = ({ open, setOpen, memberId, setMemberId, memberName }) => {

    const [payment, setPayment] = useState([]);

    useEffect(() => {

        const fetchPayment = async () => {

            try {
                const response = await axios.get(`http://localhost:3001/api/payments/${memberId}`);
                setPayment(response.data);
            } catch (error) {
                console.error("Error fetching payments!", error);
            }
        }
        fetchPayment();
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
                            {payment.map(payment => (
                                <div class="table-row">
                                    <div class="table-item">
                                        {payment.paymentDate}
                                    </div>
                                    <div class={`table-item ${payment.paymentStatus === 'present' ? "text-green-600" : "text-red-500"}`}>
                                        {payment.paymentStatus.toUpperCase()}
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