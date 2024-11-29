import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SummaryModal = ({ open, setOpen, memberId, setMemberId, memberName }) => {

    const [payment, setPayment] = useState([]);

    useEffect(() => {

        const fetchPayment = async () => {

            try {
                const response = await axios.get(`http://localhost:3001/api/payments/${memberId}`);
                setPayment(response.data);
            } catch (error) {
                console.error("Error fetching contributions!", error);
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
                        <hr></hr>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left border border-gray-300">Date</th>
                                        <th className="px-4 py-2 text-left border border-gray-300">Amount</th>
                                        <th className="px-4 py-2 text-left border border-gray-300">Via</th>
                                    </tr>
                                </thead>
                                <tbody className="overflow-y-auto max-h-[400px]">
                                    {payment.map(payment => (
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border border-gray-300">{payment.paymentDate}</td>
                                            <td className="px-4 py-2 border border-gray-300">${payment.amountPaid}</td>
                                            <td className="px-4 py-2 border border-gray-300">{payment.paymentMethod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

export default SummaryModal;