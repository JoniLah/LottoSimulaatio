export function generateWinningNumbers() {
    const winningNumbers = new Set();
    while (winningNumbers.size < 7) {
      winningNumbers.add(Math.floor(Math.random() * 40) + 1);
    }
    return [...winningNumbers];
}