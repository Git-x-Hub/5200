import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberModal = ({ open, setOpen, isAdd, setIsAdd, isEdit, setIsEdit, memberId, setMemberId }) => {

    const [onDelete, setOnDelete] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {

        const fetchMembers = async (memberId) => {

            if (memberId !== null) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/member/${memberId}`);
                    setFormData({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber
                    });
                } catch (error) {
                    console.error("Error fetching member!", error);
                }
            }
        }
        fetchMembers(memberId);
    }, [memberId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isAdd) {
            try {
                // create new member
                await axios.post('http://localhost:3001/api/member', formData);
                handleReset();
                alert('New member has been added!');
            } catch (error) {
                console.error('Error creating member:', error);
                alert('Error creating member');
            }
        } else {
            // Edit member
            try {
                await axios.put(`http://localhost:3001/api/member/${memberId}`, formData);
                handleReset();
                alert('Entry has been updated!');
            } catch (error) {
                console.error('Error updating member:', error);
                alert('Error updating member');
            }
        }
    };

    const deleteMember = async () => {

        if (onDelete) {
            try {
                await axios.delete(`http://localhost:3001/api/member/${memberId}`);
                handleReset();
                alert('Deleted successfully!');
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }

    const handleReset = () => {
        setOpen(false);
        setIsAdd(false);
        setIsEdit(false);
        setOnDelete(false);
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '' }); // Clear the form after submission
        setMemberId(null);
    };

    const handleEdit = () => {
        setIsAdd(false);
        setIsEdit(false);
    };

    const handleDelete = async () => {
        setOnDelete(true);
    };

    return (
        <>
            {open && (
                <div class='backdrop' onClick={handleReset}>
                    <div class='modal' onClick={(event) => event.stopPropagation()}>
                        <center><h2>{isAdd && `New Member`}</h2></center>
                        <form onSubmit={handleSubmit}>
                            <div class="flex flex-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First name"
                                    required
                                    disabled={isEdit}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last name"
                                    required
                                    disabled={isEdit}
                                />
                            </div>
                            <div class="flex flex-row">
                                <input
                                    type="text"
                                    name="email"
                                    class="w-full"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    disabled={isEdit}
                                />
                            </div>
                            <div class="flex flex-row">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    class="w-full"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                    disabled={isEdit}
                                />
                            </div>
                            <hr />
                            {!isEdit && (
                                <div>
                                    <center>
                                        <button type="reset" onClick={handleReset}>Cancel</button>
                                        <button type="submit">Submit</button>
                                    </center>
                                </div>
                            )}
                            {isEdit && (
                                <div>
                                    <center>
                                        <button type="button" onClick={handleEdit}>Edit</button>
                                        {onDelete ?
                                            <button type="button" class="button-red" onClick={deleteMember}>Confirm</button> :
                                            <button type="button" class="button-red" onClick={handleDelete}>Delete</button>
                                        }
                                    </center>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MemberModal;