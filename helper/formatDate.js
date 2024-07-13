import { format } from 'date-fns';
const formatDate = (object, params) => {
  const decryptDate = object[params].split('/');
  return format(new Date(decryptDate[2], decryptDate[1], decryptDate[0]), 'yyyy/MM/dd');
};

export default formatDate;

export const calculateYears = (date1, date2) => {
  const diffTime = new Date(date2).getTime() - new Date(date1).getTime();
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diffTime / day);
  const months = Math.floor(days / 31);
  const years = months / 12;
  return years;
};
