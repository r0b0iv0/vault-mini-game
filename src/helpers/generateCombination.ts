export function generateCombination(length: number) {
    let currentCombination: Combination[] = [];
    for (let i = 0; i < length; i++) {
        const number = Math.floor(Math.random() * 9) + 1;
        const direction = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
        currentCombination.push({ number, direction });
    }
    console.log(currentCombination)
    return currentCombination
  }