export function isUpperCase(str: string) {
    return str.toUpperCase() === str;
}

export function isLowerCase(str: string) {
    return str.toLowerCase() === str;
}

export function isCapitalized(word) {
    return isUpperCase(word.charAt(0)) && isLowerCase(word.substr(1));
}

export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

// TODO: This can be improved to perform replacement in a per character basis
// NOTE: It assumes replacement_word to be already lowercase
export function keep_case(word: string, replacement_word: string) {
    if (isLowerCase(word)) return replacement_word;
    if (isUpperCase(word)) return replacement_word.toUpperCase();
    if (isCapitalized(word)) return capitalize(replacement_word);
    return replacement_word;
}

// Useful to calculate the circumflex equivalents.
export const VOWELS_ALL_NOTILDE = 'aeiouâêîôûAEIOUÂÊÎÔÛ';
export const VOWELS_ALL_TILDE = 'áéíóúâêîôûÁÉÍÓÚÂÊÎÔÛ';

export function get_vowel_tilde(vowel) {
    const i = VOWELS_ALL_NOTILDE.indexOf(vowel);
    // If no tilde, replace with circumflex
    if (vowel && i !== -1) return VOWELS_ALL_TILDE[i];
    if (VOWELS_ALL_TILDE.includes(vowel)) return vowel;
    console.error('Not a vowel', vowel);
}

export function get_vowel_circumflex(vowel: string) {
    const i = VOWELS_ALL_NOTILDE.indexOf(vowel);
    if (vowel && i !== -1) return VOWELS_ALL_NOTILDE[i + 5];
    if (VOWELS_ALL_TILDE.includes(vowel)) return vowel;
    console.error('Not supported');
}
