import React, { useState } from 'react';
import Payment from './Payment';
import PaymentModal from './PaymentModal'

const PaymentPage = ({search}) => {

    const [memberId, setMemberId] = useState(null);
    const [memberName, setMemberName] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <div>
            <center>
                <Payment
                    setOpen={setOpen}
                    setMemberId={setMemberId}
                    setMemberName={setMemberName}
                    search={search}/>
                <PaymentModal
                    open={open}
                    setOpen={setOpen}
                    memberId={memberId}
                    setMemberId={setMemberId}
                    memberName={memberName}
                />
            </center>
        </div>
    );
};

export default PaymentPage;