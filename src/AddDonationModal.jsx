import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDonationModal = ({ members, openForm, setOpenForm, isAdd }) => {

    const [formData, setFormData] = useState({
        amountPaid: '',
        paymentMethod: '',
        memberId: members[0].id
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/payment', formData);
            handleReset();
            alert('Contribution has been added!');
        } catch (error) {
            console.error('Error adding contribution:', error);
            alert('Error adding contribution');
        }
    };

    const handleReset = () => {
        setOpenForm(false);
        setFormData({ amountPaid: '', paymentMethod: '', memberId: members[0].id });
        // setMemberId(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            {openForm && (
                <div>
                    <div class='backdrop' onClick={handleReset}>
                        <div class='modal' onClick={(event) => event.stopPropagation()}>
                            <center><h2>Contribution</h2></center>
                            <form onSubmit={handleSubmit}>
                                <div class="flex flex-row">
                                    <select class="w-full"
                                        value={formData.memberId}
                                        onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                                    >
                                        {members.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.firstName} {member.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div class="flex flex-row">
                                    <input
                                        type="text"
                                        name="amountPaid"
                                        class="w-full"
                                        value={formData.amountPaid}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        required
                                    />
                                </div>
                                <div class="flex flex-row">
                                    <input
                                        type="text"
                                        name="paymentMethod"
                                        class="w-full"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        placeholder="Payment Method"
                                        required
                                    />
                                </div>
                                <hr></hr>
                                <div>
                                    <center>
                                        <button type="reset" onClick={handleReset}>Cancel</button>
                                        <button type="submit">Submit</button>
                                    </center>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddDonationModal;