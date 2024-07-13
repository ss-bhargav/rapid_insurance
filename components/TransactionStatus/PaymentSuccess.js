import styles from './TransactionDetails.module.scss'
import { motion } from 'framer-motion'
import { BsPatchCheckFill } from 'react-icons/bs'
import TransactionDetails from './TransactionDetails'
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import { withRouter } from 'next/router';
import { KotakPcProposalHandler, KotakPolicyDocumentHandler, KotakTwProposalHandler } from 'helper/api'


const SuccessPage = ({ data }) => {
  const [document, setDocument] = useState('')
  const [documentLoading, setDocumentLoading] = useState(true)
  const [proposalLoading, setProposalLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [error, setError] = useState(false)

  const details = {
    companyName: data?.data?.company_object?.s_plan_name || null,
    transaction_id: data?.hash_keys?.txnid || null,
    bikeModel: data?.data?.c_make_model || null,
    rto: data?.data?.c_place_of_registration || null,
    idv: data?.data?.company_object?.s_idv || null,
    crn: data?.data?.c_crn || null,
    basic_od: data?.data?.company_object?.s_basic_od_premium || null,
    third_party_premium: data?.data?.company_object?.s_basic_tp_premium || null,
    ncb_discount: data?.data?.company_object?.s_ncb_amount || null,
    net_premium: data?.data?.company_object?.s_net_premium || null,
    gst_amount: data?.data?.company_object?.s_gst_amount || null,
    total_premium: data?.data?.company_object?.s_total_premium || null,
  }

  useEffect(async () => {
    console.log(data)
    try {
      setDocumentLoading(true)
      const downloadDoc = await PolicyDocumentHandler()
      setDocument(downloadDoc.data)
      setDocumentLoading(false)
    } catch (error) {
      console.log(error)
      setDocumentLoading(false)
    }
  }, [])


  const PolicyDocumentHandler = async () => {
    const company_name = data?.client_object?.company_object?.s_company_name || ""
    if (company_name === 'kotak') {
      const response = await KotakPolicyDocumentHandler(data?.client_object?.proposal)
      return response
    }
  }


  return (
    <div>
      <div className={styles.savePolicyAndDownload}>
        <div className={styles.download}>
          {
            documentLoading ? (
              <CircularProgress color="success" />
            ) : (
              <button>
                <a download="Policy Document" href={`data:application/pdf;base64,${document}`} title="Download pdf document">
                  Policy Document
                </a>
              </button>
            )
          }
        </div>
      </div>
      {/* <div className={styles.successPageWrapper}>
        <div className={styles.successMsgWrapper}>
          <h1 className={styles.successIcon}>
            <BsPatchCheckFill size="1em" color="green" />
          </h1>
          <h2 className="text-success p-2" style={{ textAlign: 'center' }}>
            Transaction Success
          </h2>
          <TransactionDetails details={details} />
        </div>
      </div> */}
    </div>
  )
}



SuccessPage.prototype = {
  router: PropTypes.object
}


export default withRouter(SuccessPage)
