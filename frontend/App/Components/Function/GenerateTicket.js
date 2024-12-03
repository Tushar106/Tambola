// This function is used to generate a ticket for the user. It generates a ticket with 3 rows and 9 columns. Each row has 5 numbers. The numbers are generated randomly and are unique in each row. The numbers are generated between 1 and 100. The function returns the generated ticket.
export function generateTicket() {
    const ticket = Array.from({ length: 3 }, () => Array(9).fill(null));
  
    for (let row = 0; row < 3; row++) {
      const rowNumbers = new Set();
      while (rowNumbers.size < 5) {
        const num = Math.floor(Math.random() * 100) + 1;
        rowNumbers.add(num);
      }
  
      const rowNumbersArray = Array.from(rowNumbers);
      let filledColumns = 0;
      for (let col = 0; col < 9; col++) {
        if (filledColumns < 5 && Math.random() < 0.5) {
          ticket[row][col] = rowNumbersArray[filledColumns];
          filledColumns++;
        }
      }
  
      // Ensure exactly 5 numbers are placed in the row
      let col = 0;
      while (filledColumns < 5) {
        if (ticket[row][col] === null) {
          ticket[row][col] = rowNumbersArray[filledColumns];
          filledColumns++;
        }
        col++;
      }
    }
  
    return ticket;
  };