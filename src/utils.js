import seedrandom from 'seedrandom';

export function generateWinningNumbers(seed) {
  const winningNumbers = new Set();
  const random = seedrandom(seed);
  while (winningNumbers.size < 7) {
    winningNumbers.add(Math.floor(random() * 40) + 1);
  }
  return [...winningNumbers];
}

export function generateWinningNumbersDynamic(seed, mainNumbers, totalMainNumbers, extraNumbers, totalExtraNumbers) {
  const winningMainNumbers = new Set();
  const winningExtraNumbers = new Set();
  const random = seedrandom(seed);

  while (winningMainNumbers.size < mainNumbers) {
    winningMainNumbers.add(Math.floor(random() * totalMainNumbers) + 1);
  }

  if (extraNumbers > 0) {
    while (winningExtraNumbers.size < extraNumbers) {
      winningExtraNumbers.add(Math.floor(random() * totalExtraNumbers) + 1);
    }
  }

  return { newWinningMainNumbers: [...winningMainNumbers], newWinningExtraNumbers: [...winningExtraNumbers] };
}