let generatedWinningNumbers = null; // Initialize with null

export function generateWinningNumbers() {
  if (!generatedWinningNumbers) {
    const winningNumbers = new Set();
    while (winningNumbers.size < 7) {
      winningNumbers.add(Math.floor(Math.random() * 40) + 1);
    }
    generatedWinningNumbers = [...winningNumbers]; // Cache the generated winning numbers
  }
  return generatedWinningNumbers;
}