import { formatMoney } from './formatMoney';

const Input = ({ values, name, label, type, handler, min, max }) => {
  return (
    <div className="form-group mr-3">
      <label htmlFor={label}>
        <h6>{label}</h6>
      </label>
      <input type={type} name={name} className="form-control col-12" value={values[name]} onChange={(e) => handler(e.target.value, name)} />
      <p style={{ fontSize: '12px', fontWeight: '600' }}>
        Min {formatMoney(min)} To Max {formatMoney(max)}
      </p>
    </div>
  );
};

export default Input;
