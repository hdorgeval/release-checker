export function extractFirstLineOf(input: string): string {
  const lines = input
    .split(/\n|\r/)
    .map((line) => line.replace(/[\t]/g, ' '))
    .map((line) => line.trim())
    .filter((line) => line && line.length > 0);

  return lines[0];
}
