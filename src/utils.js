import seedrandom from 'seedrandom'; // Import the seedrandom library

export function generateWinningNumbers(seed) {
  const winningNumbers = new Set();
  const random = seedrandom(seed); // Initialize the random number generator with the seed
  while (winningNumbers.size < 7) {
    winningNumbers.add(Math.floor(random() * 40) + 1);
  }
  return [...winningNumbers];
}