/**
 * Copyleft (c) 2018-2019 Andalugeeks
 * 
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com>
 * - Ksar Feui <a.moreno.losana@gmail.com>
 * - J. Félix Ontañón <felixonta@gmail.com>
 * 
 * Dev notes:
 * - Negative lookaheads/lookbehinds (used in andaluh-py) are only supported from ECMASCRIPT 2018 onwards (only supported in latest chrome)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the License.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

var xregexp = require('xregexp');

// Useful for calculate the circumflex equivalents.
export var VOWELS_ALL_NOTILDE = 'aeiouâêîôûAEIOUÂÊÎÔÛ';
export var VOWELS_ALL_TILDE = 'áéíóúâêîôûÁÉÍÓÚÂÊÎÔÛ';

// EPA character for Voiceless alveolar fricative /s/ https://en.wikipedia.org/wiki/Voiceless_alveolar_fricative
export var VAF = 'ç';

// EPA character for Voiceless velar fricative /x/ https://en.wikipedia.org/wiki/Voiceless_velar_fricative
export var VVF = 'h';

// Digraphs producers. (vowel)(const)(const) that triggers the general digraph rule
export var DIGRAPHS = [
    'bb', 'bc', 'bç', 'bÇ', 'bd', 'bf', 'bg', 'bh', 'bm', 'bn', 'bp', 'bq', 'bt', 'bx', 'by', 'cb', 'cc',
    'cç', 'cÇ', 'cd', 'cf', 'cg', 'ch', 'cm', 'cn', 'cp', 'cq', 'ct', 'cx', 'cy',
    'db', 'dc', 'dç', 'dÇ', 'dd', 'df', 'dg', 'dh', 'dl', 'dm', 'dn', 'dp', 'dq', 'dt', 'dx', 'dy',
    'fb', 'fc', 'fç', 'fÇ', 'fd', 'ff', 'fg', 'fh', 'fm', 'fn', 'fp', 'fq', 'ft', 'fx', 'fy',
    'gb', 'gc', 'gç', 'gÇ', 'gd', 'gf', 'gg', 'gh', 'gm', 'gn', 'gp', 'gq', 'gt', 'gx', 'gy',
    'jb', 'jc', 'jç', 'jÇ', 'jd', 'jf', 'jg', 'jh', 'jl', 'jm', 'jn', 'jp', 'jq', 'jr', 'jt', 'jx', 'jy',
    'lb', 'lc', 'lç', 'lÇ', 'ld', 'lf', 'lg', 'lh', 'll', 'lm', 'ln', 'lp', 'lq', 'lr', 'lt', 'lx', 'ly',
    'mm', 'mn',
    'nm', 'nn',
    'pb', 'pc', 'pç', 'pÇ', 'pd', 'pf', 'pg', 'ph', 'pm', 'pn', 'pp', 'pq', 'pt', 'px', 'py',
    'rn',
    'sb', 'sc', 'sç', 'sÇ', 'sd', 'sf', 'sg', 'sh', 'sk', 'sl', 'sm', 'sn', 'sñ', 'sp', 'sq', 'sr', 'st', 'sx', 'sy',
    'tb', 'tc', 'tç', 'tÇ', 'td', 'tf', 'tg', 'th', 'tl', 'tm', 'tn', 'tp', 'tq', 'tt', 'tx', 'ty',
    'xb', 'xc', 'xç', 'xÇ', 'xd', 'xf', 'xg', 'xh', 'xl', 'xm', 'xn', 'xp', 'xq', 'xr', 'xt', 'xx', 'xy',
    'zb', 'zc', 'zç', 'zÇ', 'zd', 'zf', 'zg', 'zh', 'zl', 'zm', 'zn', 'zp', 'zq', 'zr', 'zt', 'zx', 'zy'
];

export var H_RULES_EXCEPT = {
    'haz': 'âh', 'hez': 'êh', 'hoz': 'ôh',
    'oh': 'ôh',
    'yihad': 'yihá',
    'h': 'h' // Keep an isolated h as-is
}

export var GJ_RULES_EXCEPT = {
    'gin': 'yin', 'jazz': 'yâh', 'jet': 'yêh'
}

export var V_RULES_EXCEPT = {
    'vis': 'bî', 'ves': 'bêh'
}

export var LL_RULES_EXCEPT = {
    'grill': 'grîh'
}

export var WORDEND_D_RULES_EXCEPT = {
    'çed': 'çêh'
}

export var WORDEND_S_RULES_EXCEPT = {
    'bies': 'biêh', 'bis': 'bîh', 'blues': 'blû', 'bus': 'bûh',
    'dios': 'diôh', 'dos': 'dôh',
    'gas': 'gâh', 'gres': 'grêh', 'gris': 'grîh',
    'luis': 'luîh',
    'mies': 'miêh', 'mus': 'mûh',
    'os': 'ô',
    'pis': 'pîh', 'plus': 'plûh', 'pus': 'pûh',
    'ras': 'râh', 'res': 'rêh',
    'tos': 'tôh', 'tres': 'trêh', 'tris': 'trîh'
}

export var WORDEND_CONST_RULES_EXCEPT = {
    'al': 'al', 'cual': 'cuâ', 'del': 'del', 'dél': 'dél', 'el':'el', 'él':'èl', 'tal': 'tal', 'bil': 'bîl',
    // TODO: uir = huir. Maybe better to add the exceptions on h_rules?
    'por': 'por', 'uir': 'huîh',
    // sic, tac
    'çic': 'çic', 'tac': 'tac',
    'yak': 'yak',
    'stop': 'êttôh', 'bip': 'bip'
}

export var WORDEND_D_INTERVOWEL_RULES_EXCEPT = {
    // Ending with -ado
    'fado': 'fado', 'cado': 'cado', 'nado': 'nado', 'priado': 'priado',
    // Ending with -ada
    'fabada': 'fabada', 'fabadas':'fabadas', 'fada': 'fada', 'ada': 'ada', 'lada': 'lada', 'rada': 'rada',
    // Ending with -adas
    'adas': 'adas', 'radas': 'radas', 'nadas': 'nadas',
    // Ending with -ido
    'aikido': 'aikido', 'bûççido': 'bûççido', 'çido': 'çido', 'cuido': 'cuido', 'cupido': 'cupido', 'descuido': 'descuido',
    'despido': 'despido', 'eido': 'eido', 'embido': 'embido', 'fido': 'fido', 'hido': 'hido', 'ido': 'ido', 'infido': 'infido',
    'laido': 'laido', 'libido': 'libido', 'nido': 'nido', 'nucleido': 'nucleido', 'çonido': 'çonido', 'çuido': 'çuido'
}

export var ENDING_RULES_EXCEPTION = {
    // Exceptions to digraph rules with nm
    'biêmmandao':'bienmandao', 'biêmmeçabe':'bienmeçabe', 'buêmmoço':'buenmoço', 'çiêmmiléçima':'çienmiléçima', 'çiêmmiléçimo':'çienmiléçimo', 'çiêmmilímetro':'çienmilímetro', 'çiêmmiyonéçima':'çienmiyonéçima', 'çiêmmiyonéçimo':'çienmiyonéçimo', 'çiêmmirmiyonéçima':'çienmirmiyonéçima', 'çiêmmirmiyonéçimo':'çienmirmiyonéçimo',
    // Exceptions to l rules
    'marrotadôh':'mârrotadôh', 'marrotâh':'mârrotâh', 'mirrayâ':'mîrrayâ',
    // Exceptions to psico pseudo rules
    'herôççiquiatría':'heroçiquiatría', 'herôççiquiátrico':'heroçiquiátrico', 'farmacôççiquiatría':'farmacoçiquiatría', 'metempçícoçî':'metemçícoçî', 'necróçico':'necróççico', 'pampçiquîmmo':'pamçiquîmmo',
    // Other exceptions
    'antîççerôttármico':'antiçerôttármico', 'eclampçia':'eclampçia', 'pôttoperatorio':'pôççoperatorio', 'çáccrito':'çánccrito', 'manbîh':'mambîh', 'cômmelináçeo':'commelináçeo', 'dîmmneçia':'dînneçia', 'todo': 'tó', 'todô': 'tôh', 'toda': 'toa', 'todâ': 'toâ',
    // Other exceptions monosyllables
    'as':'âh', 'clown':'claun', 'crack':'crâh', 'down':'daun', 'es':'êh', 'ex':'êh', 'ir':'îh', 'miss':'mîh', 'muy':'m', 'ôff':'off', 'os':'ô', 'para':'pa', 'ring':'rin', 'rock':'rôh', 'spray':'êppray', 'sprint':'êpprín', 'wa':'gua'
}

export default class EPA {

    private xRegExp = xregexp;

    constructor() { }
  
    h_rules = (text: string) => {
        var replace_with_case = (word: string, group_0: string) => {
            if (word && H_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, H_RULES_EXCEPT[word.toLowerCase()]);
            } else {
                var replace_with_case_all_browsers = (match, prev_char, h_char, next_char) => {
                    if (prev_char && prev_char.toLowerCase() === 'c') {
                        return match;
                    }
                    prev_char = typeof prev_char === 'string' ? prev_char : '';
                    if (next_char && h_char === h_char.toUpperCase()) {
                        return prev_char + next_char.toUpperCase();
                    } else if (next_char && h_char === h_char.toLowerCase()) {
                        return prev_char + next_char.toLowerCase();
                    } else {
                        return prev_char;
                    }
                }
                return this.sub(word, this.xRegExp('([\\p{L}])?(h)([a-z\u0080-\u00ff]?)', 'gi'), replace_with_case_all_browsers);
            }
        }
        // chihuahua => chiguagua
        text = this.sub(
            text,
            this.xRegExp('([\\p{L}])?(h)(ua)', 'gi'), 
            (match, prev_char, h_char, ua_chars) => { // TODO: recover replace_with_case for original expression
                if (prev_char && prev_char.toLowerCase() === 'c') {
                    return match;
                }
                prev_char = typeof prev_char === 'string' ? prev_char : '';
                if (h_char === h_char.toLowerCase()) {
                    return prev_char + 'g' + ua_chars;
                } else {
                    return prev_char + 'G' + ua_chars;
                }
            }
        );
        // cacahuete => cacagûete
        text = this.sub(
            text,
            this.xRegExp('([\\p{L}])?(h)(u)(e)', 'gi'),
            (match, prev_char, h_char, u_char, e_char) => { 
                if (prev_char && prev_char.toLowerCase() === 'c') {
                    return match;
                }
                prev_char = typeof prev_char === 'string' ? prev_char : '';
                if (h_char === h_char.toLowerCase()) {
                    return prev_char + 'g' + this.keep_case(u_char, 'ü') + e_char;
                } else {
                    return prev_char + 'G' + this.keep_case(u_char, 'ü') + e_char;
                }
            }
        );
        // General /h/ replacements
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]*?)(h)([a-z\u0080-\u00ff]*?)(?=^|$|[^\\p{L}])', 'gi'), replace_with_case);

        return text;
    }


    x_rules = (text: string, vaf = VAF) => {
        // Replacement rules for /ks/ with EPA VAF
        var replace_with_case_prev_all_browsers = (match, prev_char, x_char) => {
            if (prev_char !== undefined) {
                return match;
            }
            prev_char = typeof prev_char === 'string' ? prev_char : '';
            if (x_char === x_char.toLowerCase()) {
                return prev_char + vaf;
            } else {
                return prev_char + vaf.toUpperCase();
            }
        }
            
        var replace_intervowel_with_case = (match: string, prev_char: string, x_char: string, next_char: string) => {
            if (prev_char === '') {
                return match;
            }

            prev_char = this.get_vowel_circumflex(prev_char)
            if (x_char === x_char.toUpperCase()) {
                return prev_char + vaf.toUpperCase() + vaf.toUpperCase() + next_char;
            } else {
                return prev_char + vaf + vaf + next_char;
            }                
        }

        // If the text begins with /ks/
        // Xilófono roto => Çilófono roto
        text = text[0] === 'X' ? vaf.toUpperCase() + text.substr(1, (text.length - 1)) : text[0] === 'x' ?
            vaf + text.substr(1, (text.length - 1)) : text;

        // If the /ks/ sound is between vowels
        // Axila => Aççila | Éxito => Éççito
        text = this.sub(text, this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú|)(x)(a|e|i|o|u|á|é|í|ó|ú)', 'gi'), replace_intervowel_with_case);

        // Every word starting with /ks/
        text = this.sub(text, this.xRegExp('([\\p{L}])?(x)', 'gi'), replace_with_case_prev_all_browsers)

        return text;
    }


    ch_rules = (text: string) => {
        // Replacement rules for /∫/ (voiceless postalveolar fricative)
        text = this.sub(text, this.xRegExp('(c)(h)', 'gi'), (match: string) => {
            if (match[0] === match[0].toLowerCase()) {
                return 'x'
            } else {
                return 'X';
            }
        });

        return text
    }


    gj_rules = (text: string, vvf = VVF) => {
        // Replacing /x/ (voiceless postalveolar fricative) with /h/
        var exception_or_replace_with_h_case = (word: string) => {
            if (GJ_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, GJ_RULES_EXCEPT[word.toLowerCase()]);
            } else {
                word = this.sub(word, this.xRegExp('(g|j)(e|i|é|í)', 'gi'), (chars) => {
                        return chars[0] === chars[0].toUpperCase() ? vvf.toUpperCase() + chars[1] : vvf + chars[1];
                    }
                );
                word = this.sub(word, this.xRegExp('(j)(a|o|u|á|ó|ú)', 'gi'), (chars) => {
                    return chars[0] === chars[0].toUpperCase() ? vvf.toUpperCase() + chars[1] : vvf + chars[1];
                    }
                );

                return word;
            }
        }

        var replace_with_ge_case = (chars: string) => {
            if (chars[0] === chars[0].toUpperCase()) {
                return 'G' + chars[2];
            } else {
                return 'g' + chars[2];
            }
        }

        var replace_with_gu_case = (chars: string) => {
            if (chars[1] === chars[1].toUpperCase()) {
                return chars[0] + 'U' + chars[2];
            } else {
                return chars[0] + 'u' + chars[2];
            }
        }

        var replace_with_g_case_all_browsers = (match, s, a, no_m, b, ue, cons) => {
            if (no_m && no_m === 'm') {
                return match;
            }
            return s + a + this.keep_case(b, 'g') + ue + cons;
        }

        // G,J + vowel replacement
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]*?)(g|j)(e|i|é|í)([a-z\u0080-\u00ff]*?)(?=^|$|[^\\p{L}])', 'gi'), exception_or_replace_with_h_case);
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]*?)(j)(a|o|u|á|ó|ú)([a-z\u0080-\u00ff]*?)(?=^|$|[^\\p{L}])', 'gi'), exception_or_replace_with_h_case);
        
        // GUE,GUI replacement
        text = this.sub(text, this.xRegExp('(gu|gU)(e|i|é|í|E|I|É|Í)', 'g'), replace_with_ge_case);
        text = this.sub(text, this.xRegExp('(Gu|GU)(e|i|é|í|E|I|É|Í)', 'g'), replace_with_ge_case);

        // GÜE,GÜI replacement
        text = this.sub(text, this.xRegExp('(g|G)(ü)(e|i|é|í|E|I|É|Í)', 'g'), replace_with_gu_case);
        text = this.sub(text, this.xRegExp('(g|G)(Ü)(e|i|é|í|E|I|É|Í)', 'g'), replace_with_gu_case);
        
        // bueno / abuelo / sabues => gueno / aguelo / sagues
        text = this.sub(text, this.xRegExp('(b)(uen)', 'gi'), (chars) => chars[0] === chars[0].toUpperCase() ? 'G' + chars.substring(1) : 'g' + chars.substring(1));
        text = this.sub(text, this.xRegExp('(?P<s>s?)(?P<a>a?)(?P<noM>m?)(?P<b>b)(?P<ue>ue)(?P<const>l|s)', 'gi'), replace_with_g_case_all_browsers);
    
        return text;
    }


    v_rules = (text: string) => {

        var replace_with_case = (word: string) => {
            if (V_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, V_RULES_EXCEPT[word.toLowerCase()]);
            } else {
                // NV -> NB -> MB (i.e.: envidia -> embidia)
                word = this.sub(word, this.xRegExp('(n)(v)', 'gi'), (chars: string) => {
                    let n_char = chars[0];
                    let v_char = chars[1];

                    if (n_char === n_char.toLowerCase() && v_char === v_char.toLowerCase()) {
                        return 'mb';
                    } else if (n_char === n_char.toUpperCase() && v_char === v_char.toUpperCase()) {
                        return 'MB';
                    } else if (n_char === n_char.toUpperCase() && v_char === v_char.toLowerCase()) {
                        return 'Mb';
                    } else {
                        return 'mB';
                    }
                });
                // v -> b
                word = this.sub(word, this.xRegExp('v', 'g'), 'b');
                word = this.sub(word, this.xRegExp('V', 'g'), 'B');
                return word;
            }
        }
        
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]*?)(v)([a-z\u0080-\u00ff]*?)(?=^|$|[^\\p{L}])', 'gi'), replace_with_case);
        return text;
    }


    ll_rules = (text: string) => {
        // Replacing /ʎ/ (digraph ll) with Greek Y for /ʤ/ sound (voiced postalveolar affricate)
        var replace_with_case = (word: string) => {
            if (LL_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, LL_RULES_EXCEPT[word.toLowerCase()]);
            } else {
                return this.sub(word, this.xRegExp('(l)(l)', 'gi'), (chars) => chars[0] === chars[0].toLowerCase() ? 'y' : 'Y');
            }
        }

        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]*?)(l)(l)([a-z\u0080-\u00ff]*?)(?=^|$|[^\\p{L}])', 'gi'), replace_with_case);
        return text; 
    }


    l_rules = (text: string) => {
        // Rotating /l/ with /r/
        var replace_with_case = (chars: string) => {
            if (chars[0] === chars[0].toLowerCase()) {
                return `r${chars[1]}`;
            } else {
                return `R${chars[1]}`;
            }
        }
    
        text = this.sub(text, this.xRegExp('(l)(b|c|ç|Ç|g|s|d|f|g|h|k|m|p|q|r|t|x|z)', 'gi'), replace_with_case);
        return text;
    }


    psico_pseudo_rules = (text: string) => {
        // Drops /p/ for pseudo- or psico- prefixes
        var replace_psicpseud_with_case = (chars: string) => {
            let ps_syllable = chars;
            if (ps_syllable[0] == 'p') {
                return ps_syllable.substring(1);
            } else {
                return ps_syllable[1].toUpperCase() + ps_syllable.substring(2);
            }
        }

        text = this.sub(text, this.xRegExp('(psic|pseud)', 'gi'), replace_psicpseud_with_case);
        return text;
    }


    vaf_rules = (text: string, vaf = VAF) => {
        // Replacing Voiceless alveolar fricative (vaf) /s/ /θ/ with EPA's ç/Ç
        var replace_with_case = (chars: string) => {
            let l_char = chars[0];
            let next_char = chars[1];
    
            if (l_char === l_char.toLowerCase()) {
                return vaf + next_char;
            } else {
                return vaf.toUpperCase() + next_char;
            }
        } 
        text = this.sub(text, this.xRegExp('(z|s)(a|e|i|o|u|á|é|í|ó|ú|Á|É|Í|Ó|Ú|â|ê|î|ô|û|Â|Ê|Î|Ô|Û)', 'gi'), replace_with_case);
        text = this.sub(text, this.xRegExp('(c)(e|i|é|í|É|Í|ê|î|Ê|Î)', 'gi'), replace_with_case);
    
        return text
    }


    word_ending_rules = (text: string) => {
        
        var get_vowel_tilde = (vowel) => {
            if (vowel && VOWELS_ALL_NOTILDE.indexOf(vowel) !== 1) {
                // If no tilde, replace with circumflex
                const i = VOWELS_ALL_NOTILDE.indexOf(vowel);
                return VOWELS_ALL_TILDE[i]

            } else if (vowel && VOWELS_ALL_TILDE.indexOf(vowel) !== 1) {
                // If vowel with tilde, leave it as it is
                return vowel;
            } else {
                console.error('Not a vowel', vowel);
            }
        }
        
        var replace_intervowel_d_end_with_case = (word: string, prefix: string, suffix_vowel_a: string, suffix_d_char: string, suffix_vowel_b: string, ending_s: string) => {
            let suffix = suffix_vowel_a + suffix_d_char + suffix_vowel_b + ending_s;
            if (WORDEND_D_INTERVOWEL_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, WORDEND_D_INTERVOWEL_RULES_EXCEPT[word.toLowerCase()]);

            } else if (!this._contain_vocal_tilde(prefix)) {
                // Ending word -ada rules
                if (suffix.toLowerCase() === 'ada') {
                    if (suffix_vowel_b.toUpperCase() === suffix_vowel_b) {
                        return `${prefix}Á`;
                    } else {
                        return `${prefix}á`;
                    }
                }
                // Ending word -adas rules
                if (suffix.toLowerCase() === 'adas') {
                    return prefix + this.keep_case(suffix.substring(0, 2), this.get_vowel_circumflex(suffix[0]) + 'h');
                
                // Ending word -ado rules
                } else if (suffix.toLowerCase() === 'ado') {
                    return prefix + suffix_vowel_a + suffix_vowel_b;
                
                // Ending word -ados -idos -ídos rules      
                } else if (['ados', 'idos', 'ídos'].indexOf(suffix.toLowerCase()) !== -1) {
                    return prefix + get_vowel_tilde(suffix_vowel_a) + this.get_vowel_circumflex(suffix_vowel_b)
                    
                // Ending word -ido -ído rules
                } else if (suffix.toLowerCase() === 'ido' || suffix.toLowerCase() === 'ído') {
                    if (suffix_vowel_a.toUpperCase() === suffix_vowel_a) {
                        return prefix + 'Í' + suffix_vowel_b
                    } else {
                        return prefix + 'í' + suffix_vowel_b
                    }
                            
                } else {
                    return word;
                }
            } else {
                return word;
            }
        }

        var replace_eps_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            if (this._contain_vocal_tilde(prefix)) { 
                if (suffix_vowel.toUpperCase() === suffix_vowel) {
                    return prefix + 'Ê'
                } else {
                    return prefix + 'ê';
                }
            } else {
                //  Leave as it is. There shouldn't be any word with -eps ending withough accent.
                return prefix + suffix_vowel + suffix_const;
            }
        }

        var replace_d_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            const unstressed_rules = {
                'a':'â', 'A':'Â', 'á':'â', 'Á':'Â',
                'e':'ê', 'E':'Ê', 'é':'ê', 'É':'Ê',
                'i':'î', 'I':'Î', 'í':'î', 'Í':'Î',
                'o':'ô', 'O':'Ô', 'ó':'ô', 'Ó':'Ô',
                'u':'û', 'U':'Û', 'ú':'û', 'Ú':'Û'
            }
            const stressed_rules = {
                'a':'á', 'A':'Á', 'á':'á', 'Á':'Á',
                'e':'é', 'E':'É', 'é':'é', 'É':'É',
                'i':'î', 'I':'Î', 'í':'î', 'Í':'Î',
                'o':'ô', 'O':'Ô', 'ó':'ô', 'Ó':'Ô',
                'u':'û', 'U':'Û', 'ú':'û', 'Ú':'Û'
            }

            if (WORDEND_D_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, WORDEND_D_RULES_EXCEPT[word.toLowerCase()]);
            }
            if (this._contain_vocal_tilde(prefix)) {
                return prefix + unstressed_rules[suffix_vowel];
            } else {
                if (['a', 'e', 'A', 'E', 'á', 'é', 'Á', 'É'].indexOf(suffix_vowel) !== -1) {
                    return prefix + stressed_rules[suffix_vowel];
                } else {
                    if (suffix_const === suffix_const.toUpperCase()) {
                        return prefix + stressed_rules[suffix_vowel] + 'H';
                    } else {
                        return prefix + stressed_rules[suffix_vowel] + 'h';
                    }
                }
            }
        }

        var replace_s_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {

            const repl_rules = {
                'a':'â', 'A':'Â', 'á':'â', 'Á':'Â',
                'e':'ê', 'E':'Ê', 'é':'ê', 'É':'Ê',
                'i':'î', 'I':'Î', 'í':'î', 'Í':'Î',
                'o':'ô', 'O':'Ô', 'ó':'ô', 'Ó':'Ô',
                'u':'û', 'U':'Û', 'ú':'û', 'Ú':'Û'
            }

            if (WORDEND_S_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, WORDEND_S_RULES_EXCEPT[word.toLowerCase()]);
            } else if (this._contain_vocal_tilde(suffix_vowel)) {
                if (suffix_const === suffix_const.toUpperCase()) {
                    return prefix + repl_rules[suffix_vowel] + 'H';
                } else {
                    return prefix + repl_rules[suffix_vowel] + 'h';
                }
            } else {
                return prefix + repl_rules[suffix_vowel];
            }
        }

        var replace_const_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            
            const repl_rules = {
                'a':'â', 'A':'Â', 'á':'â', 'Á':'Â',
                'e':'ê', 'E':'Ê', 'é':'ê', 'É':'Ê',
                'i':'î', 'I':'Î', 'í':'î', 'Í':'Î',
                'o':'ô', 'O':'Ô', 'ó':'ô', 'Ó':'Ô',
                'u':'û', 'U':'Û', 'ú':'û', 'Ú':'Û', 'â':'JIJIIJJ', 'ç': 'jojojo'
            }
            
            if (WORDEND_CONST_RULES_EXCEPT[word.toLowerCase()]) {
                return this.keep_case(word, WORDEND_CONST_RULES_EXCEPT[word.toLowerCase()]);
            } else if (this._contain_vocal_tilde(prefix)) {
                return prefix + repl_rules[suffix_vowel];
            } else {
                if (suffix_const === suffix_const.toUpperCase()) {
                    return prefix + repl_rules[suffix_vowel] + 'H';
                } else {
                    return prefix + repl_rules[suffix_vowel] + 'h';
                }
            }
        }

        // Intervowel /d/ replacements
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]*?)(a|i|í|Í)(d)(o|a)(?P<s>s?)(?=^|$|[^\\p{L}])', 'gi'), replace_intervowel_d_end_with_case);

        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]+?)(e)(ps)(?=^|$|[^\\p{L}])', 'gi'), replace_eps_end_with_case);
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]+?)(a|e|i|o|u|á|é|í|ó|ú)(d)(?=^|$|[^\\p{L}])', 'gi'), replace_d_end_with_case);
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]+?)(a|e|i|o|u|á|é|í|ó|ú)(s)(?=^|$|[^\\p{L}])', 'gi'), replace_s_end_with_case);
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])([a-z\u0080-\u00ff]+?)(a|e|i|o|u|á|â|ç|é|í|ó|ú)(b|c|f|g|j|k|l|p|r|t|x|z)(?=^|$|[^\\p{L}])', 'gi'), replace_const_end_with_case);

        return text;
    }


    digraph_rules = (text: string) => {
        // Replacement of consecutive consonant with EPA VAF
        var replace_lstrst_with_case = (match: string, vowel_char: string, lr_char: string, s_char: string, t_char: string) => {
            if (lr_char === 'l') {
                lr_char = 'r';
            } else if (lr_char === 'L') {
                lr_char = 'R';
            }
            return vowel_char + lr_char + t_char + t_char;
        }

        var replace_transpost_with_case = (word: string, init_char: string, vowel_char: string, s_char: string, cons_char: string) => {
            if (cons_char.toLowerCase() === 'l') {
                return init_char + this.get_vowel_circumflex(vowel_char) + cons_char + '-' + cons_char;
            } else {
                return init_char + this.get_vowel_circumflex(vowel_char) + cons_char + cons_char;
            }
        }

        var replace_bdnr_s_with_case = (word: string, vowel_char: string, cons_char: string, s_char: string, digraph_char: string) => {
            if (cons_char.toLowerCase() + s_char.toLowerCase() === 'rs') {
                return vowel_char + cons_char + digraph_char + digraph_char;
            } else {
                return this.get_vowel_circumflex(vowel_char) + digraph_char + digraph_char;
            }
        }

        var replace_l_with_case = (word: string, vowel_char: string, group_2: string, digraph_char: string) => {
            return this.get_vowel_circumflex(vowel_char) + digraph_char + '-' + digraph_char;
        }

        var replace_digraph_with_case = (word: string, group_1: string, group_2: string) => {
            const digraph_char = group_2[1];
            return this.get_vowel_circumflex(group_1) + digraph_char + digraph_char;
        }

        // intersticial / solsticio / superstición / cárstico => interttiçiâh / çorttiçio / çuperttiçión / cárttico
        text = this.sub(text, this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(l|r)(s)(t)', 'gi'), replace_lstrst_with_case);
        // aerotransporte => aerotrâpporte | translado => trâl-lao | transcendente => trâççendente | postpalatal => pôppalatal
        text = this.sub(text, this.xRegExp('(tr|p)(a|o)(ns|st)(b|c|ç|Ç|d|f|g|h|j|k|l|m|n|p|q|s|t|v|w|x|y|z)', 'gi'), replace_transpost_with_case);
        // abstracto => âttrâtto | adscrito => âccrito | perspectiva => pêrppêttiba
        text = this.sub(text, this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(b|d|n|r)(s)(b|c|ç|Ç|d|f|g|h|j|k|l|m|n|p|q|s|t|v|w|x|y|z)', 'gi'), replace_bdnr_s_with_case);
        // atlántico => âl-lántico | orla => ôl-la | adlátere => âl-látere | tesla => têl-la ...
        text = this.sub(text, this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(d|j|r|s|t|x|z)(l)', 'gi'), replace_l_with_case);
        // General digraph rules (postperatorio => pôttoperatorio)
        text = this.sub(text, this.xRegExp("(a|e|i|o|u|á|é|í|ó|ú)(" + DIGRAPHS.join('|') + ")", 'gi'), replace_digraph_with_case);
    
        return text;
    }
    

    exception_rules = (text: string) => {
        // Set of exceptions to the replacement algorithm
        var replace_with_case = (word: string) => {
            const replacement_word = ENDING_RULES_EXCEPTION[word.toLowerCase()];
            return this.keep_case(word, replacement_word)
        }

        const words = Object.keys(ENDING_RULES_EXCEPTION).join('|');
        text = this.sub(text, this.xRegExp('(?=|$|[^\\p{L}])(' + words + ')(?=^|$|[^\\p{L}])', 'gi'), replace_with_case);
    
        return text;
    }


    word_interaction_rules = (text: string) => {
        // Contractions and other word interaction rules
        var replace_with_case = (word: string, prefix: string, l_char: string, whitespace_char: string, next_word_char: string) => {
            let r_char = this.keep_case(l_char, 'r');
            return prefix + r_char + whitespace_char + next_word_char;
        }

        text = this.sub(text, this.xRegExp('\\b([a-z\u0080-\u00ff]*?)(l)(\\s)(b|c|ç|d|f|g|h|j|k|l|m|n|ñ|p|q|s|t|v|w|x|y|z)', 'gi'), replace_with_case);
        return text;
    }

    
    private _contain_vocal_tilde = (string: string) => {
        for (let s of string) {
            if (['á','é','í','ó','ú','Á','É','Í','Ó','Ú'].indexOf(s) !== -1) {
                return true;
            }
        }
        return false;
    }


    // TODO: This can be improved to perform replacement in a per character basis
    // NOTE: It assumes replacement_word to be already lowercase
    private keep_case = (word: string, replacement_word: string) => {
        var isTitle = (word) => word.charAt(0).toUpperCase() === word.charAt(0) && word.substr(1).toLowerCase() === word.substr(1);
        var toTitle = (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        if (word && word.toLowerCase() === word) {
            return replacement_word;
        } else if (word && word.toUpperCase() === word) {
            return replacement_word.toUpperCase();
        } else if (isTitle(word)) {
            return toTitle(replacement_word);
        } else {
            return replacement_word;
        }
    }

    private sub(text, searchMask, replaceMask, match = false) {
        const regExp = new RegExp(searchMask);
        if (match) {
            text = text.match(regExp, replaceMask);
        } else {
            text = text.replace(regExp, replaceMask);
        }

        return text;
    }

    private get_vowel_circumflex = (vowel: string) => {
        //  If no tilde, replace with circumflex
        if (vowel && VOWELS_ALL_NOTILDE.indexOf(vowel) !== -1) {
            let i = VOWELS_ALL_NOTILDE.indexOf(vowel);
            return VOWELS_ALL_NOTILDE[i + 5];
        
        // If no tilde, replace with circumflex
        } else if (VOWELS_ALL_TILDE.indexOf(vowel) !== -1) {
            return vowel;

        } else {
            console.error('not supported');
        }
    }

    transcript = (text: string, vaf = VAF, vvf = VVF) => {
        const rules = [
            this.h_rules,
            this.x_rules,
            this.ch_rules,
            this.gj_rules,
            this.v_rules,
            this.ll_rules,
            this.l_rules,
            this.psico_pseudo_rules,
            this.vaf_rules,
            this.word_ending_rules,
            this.digraph_rules,
            this.exception_rules,
            this.word_interaction_rules
        ];

        for (let rule of rules) {
            if (rule === this.x_rules) {
                text = this.x_rules(text, vaf);

            } else if (rule === this.vaf_rules) {
                text = this.vaf_rules(text, vaf);

            } else if (rule === this.gj_rules) {
                text = this.gj_rules(text, vvf);
                
            } else {
                text = rule(text);
            }
        }
    
        return text;
    }   
}