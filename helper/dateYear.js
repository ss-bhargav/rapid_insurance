function MonthYear(currentDate) {
  const date = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getUTCFullYear();
  let minMonth = month;
  if (month < 10) {
    minMonth = '0' + month;
  }
  const maxDate = `${year}-${minMonth}`;
  return maxDate;
}

export default MonthYear;
