//format budget value
export const useFormatAmount = (numStr: string) => {
  // Remove non-digit characters
  const numeric = numStr.replace(/[^0-9]/g, '');
  if (!numeric) return '';

  // Add commas
  const formatedAmount = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formatedAmount;
};
