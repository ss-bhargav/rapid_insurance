import { ImCross } from 'react-icons/im';
export const CustomAlert = ({ text, closeAlert }) => {
  return (
    <div className={`alert alert-danger alert-dismissible p-3 fade show`}>
      <div className="d-flex justify-content-between">
        <strong>{text}&nbsp;&nbsp;&nbsp;</strong>
        <span style={{ cursor: 'pointer' }} onClick={closeAlert}>
          <ImCross />
        </span>
      </div>
    </div>
  );
};
