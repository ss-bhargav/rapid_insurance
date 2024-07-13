const sortingFunction = (quotations, params, asc) => {
  if (asc === 1) {
    quotations.sort((firstItem, secondItem) => {
      return firstItem[params] - secondItem[params];
    });
  } else {
    quotations.sort((firstItem, secondItem) => {
      return secondItem[params] - firstItem[params];
    });
  }
  return quotations;
};

export default sortingFunction;

export const defaultSort = (quotations, params) => {
  return quotations.sort((min, max) => {
    return min[params] - max[params];
  });
};
