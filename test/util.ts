import { EOL } from 'os';

export function csvToArray(csvText: string, separator: string, header: boolean) {
  let array = csvText.split(EOL).map(text => text.split(separator));
  if (!header) {
    array = array.slice(1);
  }
  return array;
}