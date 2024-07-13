import { BadgeSharp } from '@mui/icons-material';

const Badge = ({ text, value }) => {
  const badgeBg = {
    borderRadius: '5px',
    color: '#fff',
    marginTop: '5px',
    marginLeft: '4px',
    fontSize: '12px',
    backgroundColor: '#1B75BA',
  };
  const badgeValue = {
    backgroundColor: '#fff',
    color: '#000',
    padding: '0px 4px',
  };
  return (
    <>
      <span className="p-1 text-capitalize" style={badgeBg}>
        {text}&nbsp;
        <span style={badgeValue}>{value}</span>
      </span>
    </>
  );
};

export default Badge;
