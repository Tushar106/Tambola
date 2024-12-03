const claimTicket = (ticket, revealedNumbers) => {
    let points = 0;
    let allRowsRevealed = true;
  
    for (let row of ticket) {
      let rowRevealed = true;
      for (let num of row) {
        if (num !== null && !revealedNumbers.includes(num)) {
          rowRevealed = false;
          allRowsRevealed = false;
        }
      }
      if (rowRevealed) {
        points += 30;
      }
    }
  
    if (allRowsRevealed) {
      points += 50;
    }
  
    // Deduct points for incorrectly revealed numbers
    for (let num of revealedNumbers) {
      let found = false;
      for (let row of ticket) {
        if (row.includes(num)) {
          found = true;
          break;
        }
      }
      if (!found) {
        points -= 10; // Deduct 10 points for each incorrectly revealed number
      }
    }
  
    return points;
  };
  
  export default claimTicket;