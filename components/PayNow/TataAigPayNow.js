import Button from "@mui/material/Button";
import { useEffect, useState } from "react";


const TataAigPayNow = ({ data }) => {
    const [proposalNumber, setProposalNumber] = useState("")

    useEffect(async () => {
        setProposalNumber(data?.s_proposal_number || "")
    }, [])

    return (
        <div>
            <form action={`https://pipuat.tataaiginsurance.in/tagichubws/cpirequest.jsp?proposal_no=${proposalNumber}&src=TP`} method="post">
                <Button type="submit">Pay Now </Button>
            </form>
        </div>
    );
};

export default TataAigPayNow;
