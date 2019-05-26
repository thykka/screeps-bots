module.exports = function displayTotals(totals) {
  console.log(
    Object.entries(totals).reduce((acc, [totalName, total], index, arr)=> {
      return acc + (
        totalName[0] + totalName[totalName.length-1] + ': ' + total +
        index < (arr.length - 1) ? ' ' : ''
      );
    }, '% ')
  );
};
