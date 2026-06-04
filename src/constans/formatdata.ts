export const formatDate = (dateString:Date) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} at ${year}`;
};