import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { DeploymentURL, GenerateNewTransactionIdHandler, GetQuotation, KotakPcProposalHandler, KotakTwProposalHandler, TataAigPcProposalHandler, TataAigTwProposalHandler, UpdateQuotation } from 'helper/api';
import VerifyDetails from 'components/PayNow/VerifyDetails';
import Button from '@mui/material/Button';
import KotakPayNow from 'components/PayNow/KotakPayNow';
import TataAigPayNow from 'components/PayNow/TataAigPayNow';
// import styles from './styles/Proposal-styles'
import styles from './styles/ProposalPage.module.scss';
import { CircularProgress } from '@mui/material';

const ProposalPage = ({ router, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [proposalDetails, setProposalDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState('Problem is generating proposal');

  useEffect(() => {
    generateProposal();
    // console.log(JSON.stringify(data));
  }, []);

  const generateProposal = async () => {
    setIsLoading(true);
    let client_object = {};
    const response = await GenerateNewTransactionIdHandler();
    client_object = {
      ...data?.client_object,
      c_transaction_id: response.txnid,
    };
    // console.log(client_object);
    // console.log(JSON.stringify(client_object));
    const resData = await proposalHandler(client_object);
    if (!resData?.data?.error) {
      setProposalDetails(resData.data.data);
      client_object = {
        ...client_object,
        proposal: {
          ...resData.data.data,
        },
      };
    } else {
      setError(true);
      if (resData?.data?.message) {
        setErrorMessage(resData?.data?.message);
      }
    }
    UpdateQuotation(data.quotation_id, client_object);
    setIsLoading(false);
  };

  const proposalHandler = async (client) => {
    const company_name = client?.company_object?.s_company_name || '';
    const service_type = client?.company_object?.s_service_type || '';

    switch (company_name) {
      case 'kotak':
        if (service_type === 'two_wheeler') {
          const response = await KotakTwProposalHandler(client);
          return response;
        }
        if (service_type === 'private_car') {
          const response = await KotakPcProposalHandler(client);
          return response;
        }
      case 'tataAig':
        if (service_type === 'two_wheeler') {
          let client_object = {
            ...client,
            c_thank_you_url: `${DeploymentURL}/transaction/tataAig/?details=${data?.quotation_id}&`,
          };
          const response = await TataAigTwProposalHandler(client_object);
          return response;
        }
        if (service_type === 'private_car') {
          let client_object = {
            ...client,
            c_thank_you_url: `${DeploymentURL}/transaction/tataAig/?details=${data?.quotation_id}&`,
          };
          const response = await TataAigPcProposalHandler(client_object);
          return response;
        }
      default:
        break;
    }
  };

  const BuyNowButton = () => {
    const company_name = data?.client_object?.company_object?.s_company_name || '';
    switch (company_name) {
      case 'kotak':
        return <KotakPayNow data={data} />;
      case 'tataAig':
        return <TataAigPayNow data={proposalDetails} />;

      default:
        return <Button>Now Pay Now</Button>;
    }
  };

  return (
    <div className={styles.proposal}>
      <div className={styles.proposal__inner}>
        <div className={styles.proposal__verify}>
          <div className={styles.proposal__h4_wrapper}>
            <h4>Please verify your details</h4>
          </div>
          <VerifyDetails data={data?.client_object} />
          <div className={styles.proposal__verify_button}>{!isLoading && !error && <BuyNowButton />}</div>
        </div>
        <div className={styles.proposal__generate}>
          <div>{isLoading && <h5>Generating Proposal ...........!</h5>}</div>
          <div>{isLoading ? <CircularProgress color="success" size={35} /> : error ? <h5>{errorMessage}</h5> : <h5>Proposal Generated Successfully</h5>}</div>
        </div>
      </div>
    </div>
  );
};

ProposalPage.prototype = {
  router: PropTypes.object,
  data: PropTypes.object,
};

export default withRouter(ProposalPage);
