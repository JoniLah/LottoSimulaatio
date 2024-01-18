import seedrandom from 'seedrandom';

export function generateWinningNumbers(seed) {
  const winningNumbers = new Set();
  const random = seedrandom(seed);
  while (winningNumbers.size < 7) {
    winningNumbers.add(Math.floor(random() * 40) + 1);
  }
  return [...winningNumbers];
}