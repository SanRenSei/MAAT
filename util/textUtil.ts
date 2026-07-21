
export default class TextUtil {

  static wrapText(text:string, maxLineChars:number) {
    let words = text.trim().split(/\s+/), lines = [], currentLine = '';

    for (let word of words) {
      if (word.length > maxLineChars) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        lines.push(word);
        continue;
      }

      if (!currentLine) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= maxLineChars) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.join("\n");
  }
  
}