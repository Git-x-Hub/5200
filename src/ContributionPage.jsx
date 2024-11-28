import React, { useState } from 'react';
import Contribution from './Contribution';
import SummaryModal from './SummaryModal'
import AddDonationModal from './AddDonationModal';

const ContibutionPage = ({ members, search }) => {

    const [memberId, setMemberId] = useState(null);
    const [memberName, setMemberName] = useState("");
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const add = () => {
        setOpenForm(true);
    };

    return (
        <div>
            <center>
                <button class="button-green" onClick={add}>Add contribution</button>
                <Contribution
                    setOpen={setOpen}
                    setMemberId={setMemberId}
                    setMemberName={setMemberName}
                    search={search} />
                <SummaryModal
                    open={open}
                    setOpen={setOpen}
                    memberId={memberId}
                    setMemberId={setMemberId}
                    memberName={memberName}
                />
                <AddDonationModal
                    openForm={openForm}
                    setOpenForm={setOpenForm}
                    members={members}
                />
            </center>
        </div>
    );
};

export default ContibutionPage;