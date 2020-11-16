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
 */

import { keep_case, get_vowel_circumflex, get_vowel_tilde } from './string';
import { matchWholeWordFromSubexpression, matchWholeWordFromSubexpressionAtEnd, matchWholeWord } from './regexp';

const xregexp = require('xregexp');

// EPA character for Voiceless alveolar fricative /s/ https://en.wikipedia.org/wiki/Voiceless_alveolar_fricative
export const VAF = 'ç';

// EPA character for Voiceless velar fricative /x/ https://en.wikipedia.org/wiki/Voiceless_velar_fricative
export const VVF = 'h';

// Digraphs producers. (vowel)(const)(const) that triggers the general digraph rule
export const DIGRAPHS = [
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

export const H_RULES_EXCEPT = {
    'haz': 'âh', 'hez': 'êh', 'hoz': 'ôh',
    'oh': 'ôh',
    'yihad': 'yihá',
    'h': 'h' // Keep an isolated h as-is
}

export const GJ_RULES_EXCEPT = {
    'gin': 'yin', 'jazz': 'yâh', 'jet': 'yêh'
}

export const V_RULES_EXCEPT = {
    'vis': 'bî', 'ves': 'bêh'
}

export const LL_RULES_EXCEPT = {
    'grill': 'grîh'
}

export const WORDEND_D_RULES_EXCEPT = {
    'çed': 'çêh'
}

export const WORDEND_S_RULES_EXCEPT = {
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

export const WORDEND_CONST_RULES_EXCEPT = {
    'al': 'al', 'cual': 'cuâ', 'del': 'del', 'dél': 'dél', 'el': 'el', 'él': 'él', 'tal': 'tal', 'bil': 'bîl',
    // TODO: uir = huir. Maybe better to add the exceptions on h_rules?
    'por': 'por', 'uir': 'huîh',
    // sic, tac
    'çic': 'çic', 'tac': 'tac',
    'yak': 'yak',
    'stop': 'êttôh', 'bip': 'bip'
}

export const WORDEND_D_INTERVOWEL_RULES_EXCEPT = {
    // Ending with -ado
    'fado': 'fado', 'cado': 'cado', 'nado': 'nado', 'priado': 'priado',
    // Ending with -ada
    'fabada': 'fabada', 'fabadas': 'fabadas', 'fada': 'fada', 'ada': 'ada', 'lada': 'lada', 'rada': 'rada',
    // Ending with -adas
    'adas': 'adas', 'radas': 'radas', 'nadas': 'nadas',
    // Ending with -ido
    'aikido': 'aikido', 'bûççido': 'bûççido', 'çido': 'çido', 'cuido': 'cuido', 'cupido': 'cupido', 'descuido': 'descuido',
    'despido': 'despido', 'eido': 'eido', 'embido': 'embido', 'fido': 'fido', 'hido': 'hido', 'ido': 'ido', 'infido': 'infido',
    'laido': 'laido', 'libido': 'libido', 'nido': 'nido', 'nucleido': 'nucleido', 'çonido': 'çonido', 'çuido': 'çuido'
}

export const ENDING_RULES_EXCEPTION = {
    // Exceptions to digraph rules with nm
    'biêmmandao': 'bienmandao', 'biêmmeçabe': 'bienmeçabe', 'buêmmoço': 'buenmoço', 'çiêmmiléçima': 'çienmiléçima', 'çiêmmiléçimo': 'çienmiléçimo', 'çiêmmilímetro': 'çienmilímetro', 'çiêmmiyonéçima': 'çienmiyonéçima', 'çiêmmiyonéçimo': 'çienmiyonéçimo', 'çiêmmirmiyonéçima': 'çienmirmiyonéçima', 'çiêmmirmiyonéçimo': 'çienmirmiyonéçimo',
    // Exceptions to l rules
    'marrotadôh': 'mârrotadôh', 'marrotâh': 'mârrotâh', 'mirrayâ': 'mîrrayâ',
    // Exceptions to psico pseudo rules
    'herôççiquiatría': 'heroçiquiatría', 'herôççiquiátrico': 'heroçiquiátrico', 'farmacôççiquiatría': 'farmacoçiquiatría', 'metempçícoçî': 'metemçícoçî', 'necróçico': 'necróççico', 'pampçiquîmmo': 'pamçiquîmmo',
    // Other exceptions
    'antîççerôttármico': 'antiçerôttármico', 'eclampçia': 'eclampçia', 'pôttoperatorio': 'pôççoperatorio', 'çáccrito': 'çánccrito', 'manbîh': 'mambîh', 'cômmelináçeo': 'commelináçeo', 'dîmmneçia': 'dînneçia', 'todo': 'tó', 'todô': 'tôh', 'toda': 'toa', 'todâ': 'toâ',
    // Other exceptions monosyllables
    'as': 'âh', 'clown': 'claun', 'crack': 'crâh', 'down': 'daun', 'es': 'êh', 'ex': 'êh', 'ir': 'îh', 'miss': 'mîh', 'muy': 'mu', 'ôff': 'off', 'os': 'ô', 'para': 'pa', 'ring': 'rin', 'rock': 'rôh', 'spray': 'êppray', 'sprint': 'êpprín', 'wa': 'gua'
}

export default class EPA {

    private xRegExp = xregexp;

    private tags = [];

    ignore_rules = (text: string) => {
        const patterns = [
            /(https?:\/\/)?(?:www\.)?(?:[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})/gi,
            this.xRegExp('(?:@([\\p{L}])+)', 'gi'),
            this.xRegExp('(?:#([\\p{L}])+)', 'gi'),
            /(?=\b[MCDXLVI]{1,8}\b)M{0,4}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})/g,
        ];

        return patterns.reduce((text, pattern) => {
            const matches = text.match(pattern);
            if (matches) {
                const randomInt = Math.floor(Math.random() * 999999999).toString();
                matches.forEach(match => this.tags.push([randomInt, match]));
                return text.replace(pattern, randomInt);
            }
            return text;
        }, text);
    };

    h_rules = (text: string) => {
        // chihuahua => chiguagua
        return text
            .replace(
                this.xRegExp('([\\p{L}])?(?<!c)(h)(ua)', 'gi'),
                (_, prev_char = '', h_char, ua_chars) => prev_char + keep_case(h_char, 'g') + ua_chars
            )
            .replace(
                this.xRegExp('([\\p{L}])?(?<!c)(h)(u)(e)', 'gi'),
                (_, prev_char = '', h_char, u_char, e_char) => prev_char + keep_case(h_char, 'g') + keep_case(u_char, 'ü') + e_char
            )
            // General /h/ replacements
            .replace(
                this.xRegExp(matchWholeWordFromSubexpression('(?<!c)(h)'), 'gi'),
                (word) => {
                    if (word && H_RULES_EXCEPT[word.toLowerCase()]) {
                        return keep_case(word, H_RULES_EXCEPT[word.toLowerCase()]);
                    }

                    return word.replace(
                        this.xRegExp('(\\p{L})?(?<!c)(h)(\\p{L}?)', 'gi'),
                        (_, prev_char = '', h_char, next_char = '') => prev_char + keep_case(h_char, next_char)
                    );
                }
            );
    }

    x_rules = (text: string, vaf = VAF) => {
        // Replacement rules for /ks/ with EPA VAF
        return text
            // If the /ks/ sound is between vowels
            // Axila => Aççila | Éxito => Éççito
            .replace(
                this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(x)(a|e|i|o|u|y|á|é|í|ó|ú)', 'gi'),
                (_, prev_char, x_char, next_char) => get_vowel_circumflex(prev_char) + keep_case(x_char, vaf).repeat(2) + next_char
            )
            // Every word starting with /ks/
            // Xilófono roto => Çilófono roto
            .replace(this.xRegExp('(?<=^|\\s)(x)', 'gi'), (x_char) => keep_case(x_char, vaf));
    }

    ch_rules = (text: string) => {
        // Replacement rules for /∫/ (voiceless postalveolar fricative)
        return text.replace(this.xRegExp('ch', 'gi'), (match) => keep_case(match[0], 'x'));
    }

    gj_rules = (text: string, vvf = VVF) => {
        // G,J + vowel replacement
        return text
            // Replacing /x/ (voiceless postalveolar fricative) with /h/
            .replace(
                this.xRegExp(matchWholeWordFromSubexpression('(g(?=e|i|é|í)|j)(a|e|i|o|u|á|é|í|ó|ú)'), 'gi'),
                (word) => {
                    if (GJ_RULES_EXCEPT[word.toLowerCase()]) {
                        return keep_case(word, GJ_RULES_EXCEPT[word.toLowerCase()]);
                    }

                    return word.replace(
                        this.xRegExp('(g(?=e|i|é|í)|j)(a|e|i|o|u|á|é|í|ó|ú)', 'gi'),
                        (_, jg_cons, vowel) => keep_case(jg_cons, vvf) + vowel
                    )
                }
            )
            // GUE,GUI replacement
            .replace(this.xRegExp('(g)u(e|i|é|í)', 'gi'), '$1$2')
            // GÜE,GÜI replacement
            .replace(this.xRegExp('(g)(ü)(e|i|é|í)', 'gi'), (_, g_char, middle_u, vowel) => g_char + keep_case(middle_u, 'u') + vowel)
            // bueno / abuelo / sabues => gueno / aguelo / sagues
            .replace(this.xRegExp('(b)(uen)', 'gi'), (_, b_char, suffix) => keep_case(b_char, 'g') + suffix)
            .replace(this.xRegExp('(s|a)?(?<!m)(b)(ue)(l|s)', 'gi'), (_, sa, b, ue, cons) => sa + keep_case(b, 'g') + ue + cons);
    }

    v_rules = (text: string) => {
        return text
            // NV -> NB -> MB (i.e.: envidia -> embidia)
            .replace(this.xRegExp('nv', 'gi'), (chars) => keep_case(chars[0], 'm') + keep_case(chars[1], 'b'))
            // v -> b
            .replace(
                this.xRegExp(matchWholeWordFromSubexpression('v'), 'gi'),
                (word) => {
                    if (V_RULES_EXCEPT[word.toLowerCase()]) {
                        return keep_case(word, V_RULES_EXCEPT[word.toLowerCase()]);
                    }

                    return word.replace(this.xRegExp('v', 'gi'), (word) => keep_case(word, 'b'));
                }
            );
    }

    ll_rules = (text: string) => {
        // Replacing /ʎ/ (digraph ll) with Greek Y for /ʤ/ sound (voiced postalveolar affricate)
        return text.replace(
            this.xRegExp(matchWholeWordFromSubexpression('ll'), 'gi'),
            (word) => {
                if (LL_RULES_EXCEPT[word.toLowerCase()]) {
                    return keep_case(word, LL_RULES_EXCEPT[word.toLowerCase()]);
                }

                return word.replace(this.xRegExp('ll', 'gi'), (word) => keep_case(word, 'y'));
            }
        );
    }

    l_rules = (text: string) => {
        // Rotating /l/ with /r/
        return text.replace(
            this.xRegExp('(l)(b|c|ç|g|s|d|f|g|h|k|m|p|q|r|t|x|z)', 'gi'),
            (_, l_char, suffix) => keep_case(l_char, 'r') + suffix
        );
    }

    psico_pseudo_rules = (text: string) => {
        return text.replace(this.xRegExp('p(sic|seud)', 'gi'), '$1');
    }

    vaf_rules = (text: string, vaf = VAF) => {
        // Replacing Voiceless alveolar fricative (vaf) /s/ /θ/ with EPA's ç/Ç
        return text
            .replace(
                this.xRegExp('(c(?=e|i|é|í|ê|î)|z|s)(a|e|i|o|u|á|é|í|ó|ú|Á|É|Í|Ó|Ú|â|ê|î|ô|û|Â|Ê|Î|Ô|Û)', 'gi'),
                (_, cons_char, suffix) => keep_case(cons_char, vaf) + suffix
            );
    }

    word_ending_rules = (text: string) => {
        const repl_rules = {
            a: 'â', A: 'Â', á: 'â', Á: 'Â',
            e: 'ê', E: 'Ê', é: 'ê', É: 'Ê',
            i: 'î', I: 'Î', í: 'î', Í: 'Î',
            o: 'ô', O: 'Ô', ó: 'ô', Ó: 'Ô',
            u: 'û', U: 'Û', ú: 'û', Ú: 'Û'
        };
        const stressed_rules = {
            a: 'á', A: 'Á', á: 'á', Á: 'Á',
            e: 'é', E: 'É', é: 'é', É: 'É',
            i: 'î', I: 'Î', í: 'î', Í: 'Î',
            o: 'ô', O: 'Ô', ó: 'ô', Ó: 'Ô',
            u: 'û', U: 'Û', ú: 'û', Ú: 'Û'
        };
        const contain_vocal_tilde = (string: string) => this.xRegExp('á|é|í|ó|ú', 'gi').test(string);

        const replace_intervowel_d_end_with_case = (word: string, prefix: string, suffix_vowel_a: string, suffix_d_char: string, suffix_vowel_b: string, ending_s: string) => {
            if (WORDEND_D_INTERVOWEL_RULES_EXCEPT[word.toLowerCase()]) {
                return keep_case(word, WORDEND_D_INTERVOWEL_RULES_EXCEPT[word.toLowerCase()]);
            }

            if (contain_vocal_tilde(prefix)) return word;

            const suffix = suffix_vowel_a + suffix_d_char + suffix_vowel_b + ending_s;

            switch (suffix.toLowerCase()) {
                case 'ada':
                    return prefix + keep_case(suffix_vowel_b, 'á');
                case 'adas':
                    return prefix + keep_case(suffix.substring(0, 2), get_vowel_circumflex(suffix[0]) + 'h');
                case 'ado':
                    return prefix + suffix_vowel_a + suffix_vowel_b;
                case 'ados':
                case 'idos':
                case 'ídos':
                    return prefix + get_vowel_tilde(suffix_vowel_a) + get_vowel_circumflex(suffix_vowel_b);
                case 'ido':
                case 'ído':
                    return prefix + keep_case(suffix_vowel_a, 'í') + suffix_vowel_b;
                default:
                    return word;
            }
        };

        const replace_eps_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            //  Leave as it is. There shouldn't be any word with -eps ending withough accent.
            if (!contain_vocal_tilde(prefix)) return prefix + suffix_vowel + suffix_const;
            return prefix + keep_case(suffix_vowel, 'ê');
        };

        const replace_d_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            if (WORDEND_D_RULES_EXCEPT[word.toLowerCase()]) {
                return keep_case(word, WORDEND_D_RULES_EXCEPT[word.toLowerCase()]);
            }

            if (contain_vocal_tilde(prefix)) {
                return prefix + repl_rules[suffix_vowel];
            }

            if (['a', 'e', 'A', 'E', 'á', 'é', 'Á', 'É'].includes(suffix_vowel)) {
                return prefix + stressed_rules[suffix_vowel];
            }

            return prefix + stressed_rules[suffix_vowel] + keep_case(suffix_const, 'h');
        };

        const replace_s_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            if (WORDEND_S_RULES_EXCEPT[word.toLowerCase()]) {
                return keep_case(word, WORDEND_S_RULES_EXCEPT[word.toLowerCase()]);
            }

            if (!contain_vocal_tilde(suffix_vowel)) {
                return prefix + repl_rules[suffix_vowel];
            }

            return prefix + repl_rules[suffix_vowel] + keep_case(suffix_const, 'h');
        };

        const replace_const_end_with_case = (word: string, prefix: string, suffix_vowel: string, suffix_const: string) => {
            if (WORDEND_CONST_RULES_EXCEPT[word.toLowerCase()]) {
                return keep_case(word, WORDEND_CONST_RULES_EXCEPT[word.toLowerCase()]);
            }

            if (contain_vocal_tilde(prefix)) {
                return prefix + repl_rules[suffix_vowel];
            }

            return prefix + repl_rules[suffix_vowel] + keep_case(suffix_vowel, 'h');
        };

        // Intervowel /d/ replacements
        return text
            .replace(this.xRegExp(matchWholeWordFromSubexpressionAtEnd('(a|i|í|Í)(d)(o|a)(s?)'), 'gi'), replace_intervowel_d_end_with_case)
            .replace(this.xRegExp(matchWholeWordFromSubexpressionAtEnd('(e)(ps)'), 'gi'), replace_eps_end_with_case)
            .replace(this.xRegExp(matchWholeWordFromSubexpressionAtEnd('(a|e|i|o|u|á|é|í|ó|ú)(d)'), 'gi'), replace_d_end_with_case)
            .replace(this.xRegExp(matchWholeWordFromSubexpressionAtEnd('(a|e|i|o|u|á|é|í|ó|ú)(s)'), 'gi'), replace_s_end_with_case)
            .replace(this.xRegExp(matchWholeWordFromSubexpressionAtEnd('(a|e|i|o|u|á|â|ç|é|í|ó|ú)(b|c|f|g|j|k|l|p|r|t|x|z)'), 'gi'), replace_const_end_with_case);
    }

    digraph_rules = (text: string) => {
        return text
            // intersticial / solsticio / superstición / cárstico => interttiçiâh / çorttiçio / çuperttiçión / cárttico
            .replace(
                this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(l|r)s(t)', 'gi'),
                (_, vowel_char, lr_char, t_char) => vowel_char + (lr_char.toLowerCase() === 'l' ? keep_case(lr_char, 'r') : lr_char) + t_char + t_char
            )
            // aerotransporte => aerotrâpporte | translado => trâl-lao | transcendente => trâççendente | postpalatal => pôppalatal
            .replace(
                this.xRegExp('(tr|p)(a|o)(?:ns|st)(b|c|ç|d|f|g|h|j|k|l|m|n|p|q|s|t|v|w|x|y|z)', 'gi'),
                (_, init_char, vowel_char, cons_char) => init_char + get_vowel_circumflex(vowel_char) + cons_char + (cons_char.toLowerCase() === 'l' ? '-' : '') + cons_char
            )
            // abstracto => âttrâtto | adscrito => âccrito | perspectiva => pêrppêttiba
            .replace(
                this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(b|d|n|r)(s)(b|c|ç|d|f|g|h|j|k|l|m|n|p|q|s|t|v|w|x|y|z)', 'gi'),
                (_, vowel_char, cons_char, s_char, digraph_char) => {
                    const isrs = cons_char.toLowerCase() === 'r' && s_char.toLowerCase() === 's';
                    return (isrs ? vowel_char + cons_char : get_vowel_circumflex(vowel_char)) + digraph_char.repeat(2);
                }
            )
            // atlántico => âl-lántico | orla => ôl-la | adlátere => âl-látere | tesla => têl-la ...
            .replace(
                this.xRegExp('(a|e|i|o|u|á|é|í|ó|ú)(?:d|j|r|s|t|x|z)(l)', 'gi'),
                (_, vowel_char, digraph_char) => get_vowel_circumflex(vowel_char) + digraph_char + '-' + digraph_char
            )
            // General digraph rules (postperatorio => pôttoperatorio)
            .replace(
                this.xRegExp(`(a|e|i|o|u|á|é|í|ó|ú)(${DIGRAPHS.join('|')})`, 'gi'),
                (_, vowel_char, digraph_chars) => get_vowel_circumflex(vowel_char) + digraph_chars[1].repeat(2)
            );
    }

    exception_rules = (text: string) => {
        // Set of exceptions to the replacement algorithm
        return text.replace(
            this.xRegExp(matchWholeWord(`(${Object.keys(ENDING_RULES_EXCEPTION).join('|')})`), 'gi'),
            (word) => keep_case(word, ENDING_RULES_EXCEPTION[word.toLowerCase()])
        );
    }

    word_interaction_rules = (text: string) => {
        // Contractions and other word interaction rules
        return text.replace(
            this.xRegExp('(?=|$|[^\\p{L}])(\\p{L}*)(l)(\\s)(b|c|ç|d|f|g|h|j|k|l|m|n|ñ|p|q|s|t|v|w|x|y|z)', 'gi'),
            (_, prefix, l_char, whitespace_char, suffix) => prefix + keep_case(l_char, 'r') + whitespace_char + suffix
        );
    }

    transcript = (text: string, vaf = VAF, vvf = VVF, scapeLinks = false) => {
        let substitutedText = text;

        if (scapeLinks) {
            substitutedText = this.ignore_rules(text);
        }

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

        const finalText = rules.reduce((substitutedText, rule) => {
            if (rule === this.x_rules) return this.x_rules(substitutedText, vaf);
            if (rule === this.vaf_rules) return this.vaf_rules(substitutedText, vaf);
            if (rule === this.gj_rules) return this.gj_rules(substitutedText, vvf);
            return rule(substitutedText);
        }, substitutedText);

        return this.tags.reduce((text, tags) => text.replace(tags[0], tags[1]), finalText);
    }
}
