// import seedrandom from 'seedrandom';

// let generatedWinningNumbers = null; // Initialize with null

// export function generateWinningNumbers() {
//   if (!generatedWinningNumbers) {
//     const winningNumbers = new Set();
//     while (winningNumbers.size < 7) {
//       winningNumbers.add(Math.floor(Math.random() * 40) + 1);
//     }
//     generatedWinningNumbers = [...winningNumbers]; // Cache the generated winning numbers
//   }
//   return generatedWinningNumbers;
// }

// export function generateWinningNumbers(seed) {
//   const winningNumbers = new Set();
//   const random = seedrandom(seed); // Initialize the random number generator with the seed
//   while (winningNumbers.size < 7) {
//     winningNumbers.add(Math.floor(random() * 40) + 1);
//   }
//   return [...winningNumbers];
// }

import seedrandom from 'seedrandom'; // Import the seedrandom library

let generatedWinningNumbers = null; // Initialize with null

export function generateWinningNumbers(seed) {
  if (!generatedWinningNumbers) {
    const winningNumbers = new Set();
    const random = seedrandom(seed); // Initialize the random number generator with the seed
    while (winningNumbers.size < 7) {
      winningNumbers.add(Math.floor(random() * 40) + 1);
    }
    generatedWinningNumbers = [...winningNumbers]; // Cache the generated winning numbers
  }
  return generatedWinningNumbers;
}