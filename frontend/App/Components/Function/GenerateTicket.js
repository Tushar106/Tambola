export function generateTicket() {
    const ticket = Array.from({ length: 3 }, () => Array(9).fill(null));

    // Define ranges for each column
    const ranges = [
        [1, 9],
        [10, 19],
        [20, 29],
        [30, 39],
        [40, 49],
        [50, 59],
        [60, 69],
        [70, 79],
        [80, 90]
    ];

    for (let col = 0; col < 9; col++) {
        const [min, max] = ranges[col];

        // Generate unique numbers for each column based on required row slots (0-3 rows, 5 numbers per row)
        const columnNumbers = new Set();
        while (columnNumbers.size < 3) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            columnNumbers.add(num);
        }

        // Place 3 numbers in the column
        const columnNumbersArray = Array.from(columnNumbers);
        let filledRows = 0;
        for (let row = 0; row < 3; row++) {
            if (filledRows < 3 && Math.random() < 0.5) {
                ticket[row][col] = columnNumbersArray[filledRows];
                filledRows++;
            }
        }
    }

    // Randomly select 5 cells in each row to keep the 15-number structure
    for (let row = 0; row < 3; row++) {
        const nonEmptyCells = ticket[row].map((val, idx) => (val ? idx : null)).filter(val => val !== null);
        while (nonEmptyCells.length > 5) {
            const idxToRemove = nonEmptyCells.splice(Math.floor(Math.random() * nonEmptyCells.length), 1)[0];
            ticket[row][idxToRemove] = null;
        }
    }

    return ticket;
}
