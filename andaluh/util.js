/**
 * Copyleft (c) 2018-2021 Andalugeeks
 *
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com> (original javascript/typescript dev)
 * - J. Félix Ontañón <felixonta@gmail.com> (port to google apps script)
 *
 */

function isUpperCase(str) {
    return str.toUpperCase() === str;
}

function isLowerCase(str) {
    return str.toLowerCase() === str;
}

function isCapitalized(word) {
    return isUpperCase(word.charAt(0)) && isLowerCase(word.substr(1));
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

// TODO: This can be improved to perform replacement in a per character basis
// NOTE: It assumes replacement_word to be already lowercase
function keep_case(word, replacement_word) {
    if (isLowerCase(word))
        return replacement_word;
    if (isUpperCase(word))
        return replacement_word.toUpperCase();
    if (isCapitalized(word))
        return capitalize(replacement_word);
    return replacement_word;
}

// Useful to calculate the circumflex equivalents.
VOWELS_ALL_NOTILDE = 'aeiouâêîôûAEIOUÂÊÎÔÛ';
VOWELS_ALL_TILDE = 'áéíóúâêîôûÁÉÍÓÚÂÊÎÔÛ';

function get_vowel_tilde(vowel) {
    var i = VOWELS_ALL_NOTILDE.indexOf(vowel);
    // If no tilde, replace with circumflex
    if (vowel && i !== -1)
        return VOWELS_ALL_TILDE[i];
    if (VOWELS_ALL_TILDE.includes(vowel))
        return vowel;
    console.error('Not a vowel', vowel);
}

function get_vowel_circumflex(vowel) {
    var i = VOWELS_ALL_NOTILDE.indexOf(vowel);
    // If no tilde, replace with circumflex
    if (vowel && i !== -1)
        return VOWELS_ALL_NOTILDE[i + 5];
    if (VOWELS_ALL_TILDE.includes(vowel))
        return vowel;
    console.error('Not supported');
}