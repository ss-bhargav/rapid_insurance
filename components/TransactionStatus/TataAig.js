import React, { useEffect, useState } from 'react';
import { GetQuotation, TataAigPolicyDocumentHandler } from 'helper/api';
import { CircularProgress } from '@mui/material';
import { withRouter } from 'next/router'
import Button from "@mui/material/Button";

const TataAigTransaction = ({ response, quotation_id, router }) => {

     const [pdfString, setPdfString] = useState("")
     const [status, setStatus] = useState("")
     const [isLoading, setIsLoading] = useState(true)
     const [policyNumber, setPolicyNumber] = useState('')
     const [randomNumber, setRandomNumber] = useState("")
     const [policyType, setPolicyType] = useState('')

     useEffect(async () => {
          updateQuotationHandler()
          if (response.status === '1') {
               setPolicyNumber(response?.data?.policyno)
               setRandomNumber(response?.data?.rnd_str)
               setPolicyType(response?.data?.productname)
          }
     }, [])

     const updateQuotationHandler = async () => {
          let client_object = {}
          const data = await GetQuotation(quotation_id)
          if (data.length > 0) {
               client_object = {
                    ...data[0]?.client_object,
                    transactionDetails: {
                         ...response
                    }
               }
               UpdateQuotation(quotation_id, client_object)
          }
     }


     return (<div className="flex flex-col justify-center ">
          <div className="mt-20 flex justify-center">
               <div>
                    {
                         policyType === "Two Wheeler" && <form action={`https://pipuat.tataaiginsurance.in/tagichubws/motor_policy.jsp?polno=${policyNumber}&src=app&key=${randomNumber}`} method="post">
                              <Button type="submit" variant="contained">Policy Document</Button>
                         </form>
                    }
                    {
                         policyType == "Private Car" && <form action={`https://pipuat.tataaiginsurance.in/tagichubws/motor_policy.jsp?polno=${policyNumber}&src=app&key=${randomNumber}`} method="post">
                              <Button type="submit" variant="contained">Policy Document</Button>
                         </form>
                    }
               </div>
          </div>
     </div>)
}

export default withRouter(TataAigTransaction);