import { formatMoney } from 'helper/formatMoney';
import { addDays, addYears, subDays } from 'date-fns';
import format from 'date-fns/format';
import styles from './PayNow.module.scss';

const VerifyDetails = ({ data }) => {
  // console.log('data', data);
  let startDate = 'null';
  let endDate = 'null';
  if (data.c_prev_policy_start_date) {
    startDate = data?.c_prev_policy_start_date;
    endDate = data?.c_prev_policy_expire_date;
  }
  return (
    <>
      <table className="table table-striped table-bordered table_items" style={{ borderCollapse: 'initial' }}>
        <tbody className="text-bold">
          <tr>
            <td className="h6">Name</td>
            <td className="h6">{`${data?.c_title.toLocaleUpperCase()}. ${data?.c_first_name.toLocaleUpperCase()} ${data?.c_last_name.toLocaleUpperCase()}`}</td>
          </tr>
          <tr>
            <td className="h6">Vehicle Number</td>
            <td className="h6 text-uppercase">{data?.c_registration_number.toUpperCase()}</td>
          </tr>
          <tr>
            <td className="h6">Vehicle Details</td>
            <td className="h6">{data?.c_make_model}</td>
          </tr>
          {data.c_rollover === true ? (
            <tr>
              <td className="h6">Policy Duration</td>
              {startDate.length > 4 ? (
                <td className="h6">
                  {startDate}&nbsp;-&nbsp;{endDate}
                </td>
              ) : (
                <td className="h6">{format(addDays(new Date(data?.c_prev_policy_expire_date), 1), 'dd/MM/yyyy') + ' - ' + format(new Date(addYears(new Date(data?.c_prev_policy_expire_date), parseInt(data?.c_policy_tenure))), 'dd/MM/yyyy')}</td>
              )}
            </tr>
          ) : null}
          <tr>
            <td className="h6">Vehicle Reg Date</td>
            <td className="h6">{format(new Date(data?.c_registration_date), 'dd/MM/yyyy')}</td>
          </tr>
          <tr>
            <td className="h6">Total Premium</td>
            <td className="h6">&#8377;&nbsp;{formatMoney(Math.round(data?.company_object?.s_total_premium))}.00</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default VerifyDetails;
