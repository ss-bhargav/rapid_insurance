import { format } from 'date-fns';

const formatDate = (date) => {
  if (date) {
    return format(new Date(date), 'yyyy/MM/dd');
  }
};

export default formatDate;
