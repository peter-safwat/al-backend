exports.serveDates = (order) => {
  //required dates formats :

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const formattedDate = currentDate.toISOString().split("T")[0];

  const resultYear =
    currentMonth > 6
      ? currentDate.getFullYear()
      : currentDate.getFullYear() - 1;

  // Get the date 5 days ago
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7 * order);
  const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split("T")[0];

  // Get the date 5 days from now
  const sevenDaysLater = new Date(currentDate);
  sevenDaysLater.setDate(currentDate.getDate() + 7 * order);
  const formattedSevenDaysLater = sevenDaysLater.toISOString().split("T")[0];
  return {
    currDate: formattedDate,
    seasonYear: resultYear,
    formattedSevenDaysAgo,
    formattedSevenDaysLater,
  };
};
