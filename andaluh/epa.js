/**
 * Copyleft (c) 2018-2021 Andalugeeks
 *
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com> (original javascript/typescript dev)
 * - J. Félix Ontañón <felixonta@gmail.com> (port to google apps script)
 *
 */

"use strict";
exports.__esModule = true;
var util = require("./util");
// EPA character for Voiceless alveolar fricative /s/ https://en.wikipedia.org/wiki/Voiceless_alveolar_fricative
exports.VAF = 'ç';

// EPA character for Voiceless velar fricative /x/ https://en.wikipedia.org/wiki/Voiceless_velar_fricative
exports.VVF = 'h';

// Digraphs producers. (vowel)(const)(const) that triggers the general digraph rule
exports.DIGRAPHS = [
    'bb', 'bc', 'bç', 'bÇ', 'bd', 'bf', 'bg', 'bh', 'bm', 'bn', 'bp', 'bq', 'bt', 'bx', 'by', 'cb', 'cc',
    'cç', 'cÇ', 'cd', 'cf', 'cg', 'ch', 'cm', 'cn', 'cp', 'cq', 'ct', 'cx', 'cy', 'çt',
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

exports.H_RULES_EXCEPT = {
    'haz': 'âh', 'hez': 'êh', 'hoz': 'ôh',
    'oh': 'ôh',
    'yihad': 'yihá',
    'h': 'h' // Keep an isolated h as-is
};

exports.GJ_RULES_EXCEPT = {
    'gin': 'yin', 'jazz': 'yâh', 'jet': 'yêh'
};

exports.V_RULES_EXCEPT = {
    'vis': 'bî', 'ves': 'bêh'
};

exports.LL_RULES_EXCEPT = {
    'grill': 'grîh'
};

exports.WORDEND_D_RULES_EXCEPT = {
    'çed': 'çêh'
};

exports.WORDEND_S_RULES_EXCEPT = {
    'bies': 'biêh', 'bis': 'bîh', 'blues': 'blû', 'bus': 'bûh',
    'dios': 'diôh', 'dos': 'dôh',
    'gas': 'gâh', 'gres': 'grêh', 'gris': 'grîh',
    'luis': 'luîh',
    'mies': 'miêh', 'mus': 'mûh',
    'os': 'ô',
    'pis': 'pîh', 'plus': 'plûh', 'pus': 'pûh',
    'ras': 'râh', 'res': 'rêh',
    'tos': 'tôh', 'tres': 'trêh', 'tris': 'trîh'
};

exports.WORDEND_CONST_RULES_EXCEPT = {
    'al': 'al', 'cual': 'cuâ', 'del': 'del', 'dél': 'dél', 'el': 'el', 'él': 'él', 'tal': 'tal', 'bil': 'bîl',
    // TODO: uir = huir. Maybe better to add the exceptions on h_rules?
    'por': 'por', 'uir': 'huîh',
    // sic, tac
    'çic': 'çic', 'tac': 'tac',
    'yak': 'yak',
    'stop': 'êttôh', 'bip': 'bip'
};

exports.WORDEND_D_INTERVOWEL_RULES_EXCEPT = {
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
};

exports.ENDING_RULES_EXCEPTION = {
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
};

var EPA = /** @class */ (function () {
    function EPA() {
        var _this = this;
        this.tags = [];

        // Regex compilation.
        // Words to ignore in the translitaration in escapeLinks mode.
        this.ignore_rules = function (text) {
            var patterns = [
                //URLs, i.e. andaluh.es, www.andaluh.es, https://www.andaluh.es
                /(https?:\/\/)?(?:www\.)?(?:[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})/gi,
                /(?:@\S+)/gi, // Mentions, i.e. @andaluh
                /(?:#\S+)/gi, // Hashtags, i.e. #andaluh
                /(?=\b[MCDXLVI]{1,8}\b)M{0,4}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})/g, // roman numerals
            ];

            return patterns.reduce(function (text, pattern) {
                var matches = text.match(pattern);
                if (matches) {
                    var randomInt = Math.floor(Math.random() * 999999999).toString();
                    matches.forEach(function (match) { return _this.tags.push([randomInt, match]); });
                    return text.replace(pattern, randomInt);
                }
                return text;
            }, text);
        };

        this.h_rules = function (text) {
            // chihuahua => chiguagua
            return text
            .replace(/(c?)(h)(ua|úa|uá)/gi, function (word, prev_char, h_char, ua_chars) {
                if (prev_char.toLowerCase() === 'c') { return word };
                if (prev_char === void 0) { prev_char = ''; }
                return prev_char + util.keep_case(h_char, 'g') + ua_chars;
            })
            // cacahuete => cacagûete
            .replace(/(c?)(h)(u)(e)/gi, function (word, prev_char, h_char, u_char, e_char) {
                if (prev_char.toLowerCase() === 'c') { return word };
                if (prev_char === void 0) { prev_char = ''; }
                return prev_char + util.keep_case(h_char, 'g') + util.keep_case(u_char, 'ü') + e_char;
            })
            // General /h/ replacements
            .replace(/\b(\w*?)(h)(\S*?)\b/gi, function (word) {
              if (word && exports.H_RULES_EXCEPT[word.toLowerCase()]) {
                  return util.keep_case(word, exports.H_RULES_EXCEPT[word.toLowerCase()]);
              }
              return word.replace(/(c?)(h)(\S?)/gi, function (word, prev_char, h_char, next_char) {
                if (prev_char.toLowerCase() === 'c') { return word };
                return util.keep_case(h_char, next_char);
              });
            });
        };

        this.x_rules = function (text, vaf) {
            if (vaf === void 0) { vaf = exports.VAF; }
            // Replacement rules for /ks/ with EPA VAF
            return text
                // If the /ks/ sound is between vowels
                // Axila => Aççila | Éxito => Éççito
                .replace(/(a|e|i|o|u|á|é|í|ó|ú)(x)(a|e|i|o|u|y|á|é|í|ó|ú)/gi, function (_, prev_char, x_char, next_char) { return util.get_vowel_circumflex(prev_char) + util.keep_case(x_char, vaf).repeat(2) + next_char; })
                // Every word starting with /ks/
                // Xilófono roto => Çilófono roto
                .replace(/\b(x)/gi, function (x_char) { return util.keep_case(x_char, vaf); });
        };

        this.ch_rules = function (text) {
            // Replacement rules for /∫/ (voiceless postalveolar fricative)
            return text.replace(/ch/gi, function (match) { return util.keep_case(match[0], 'x'); });
        };

        this.gj_rules = function (text, vvf) {
            if (vvf === void 0) { vvf = exports.VVF; }
            // G,J + vowel replacement
            return text
                // Replacing /x/ (voiceless postalveolar fricative) with /h/
                .replace(/(\S*)(g(?=e|i|é|í)|j)(a|e|i|o|u|á|é|í|ó|ú)(\S*)/gi, function (word) {
                if (exports.GJ_RULES_EXCEPT[word.toLowerCase()]) {
                    return util.keep_case(word, exports.GJ_RULES_EXCEPT[word.toLowerCase()]);
                }
                return word.replace(/(g(?=e|i|é|í)|j)(a|e|i|o|u|á|é|í|ó|ú)/gi, function (_, jg_cons, vowel) { return util.keep_case(jg_cons, vvf) + vowel; });
                })
                // GUE,GUI replacement
                .replace(/(g)u(e|i|é|í)/gi, '$1$2')
                // GÜE,GÜI replacement
                .replace(/(g)(ü)(e|i|é|í)/gi, function (_, g_char, middle_u, vowel) { return g_char + util.keep_case(middle_u, 'u') + vowel; })
                // bueno / abuelo / sabues => gueno / aguelo / sagues
                .replace(/(b)(uen)/gi, function (_, b_char, suffix) { return util.keep_case(b_char, 'g') + suffix; })
                .replace(/(s|a)?(m?)(b)(ue)(l|s)/gi, function (word, sa, m, b, ue, cons) {
                    if (m) { return word };
                    return sa + util.keep_case(b, 'g') + ue + cons;
                });
        };

        this.v_rules = function (text) {
            return text
                // NV -> NB -> MB (i.e.: envidia -> embidia)
                .replace(/nv/gi, function (chars) { return util.keep_case(chars[0], 'm') + util.keep_case(chars[1], 'b'); })
                // v -> b
                .replace(/\b(\S*)(v)(\S*)\b/gi, function (word) {
                if (exports.V_RULES_EXCEPT[word.toLowerCase()]) {
                    return util.keep_case(word, exports.V_RULES_EXCEPT[word.toLowerCase()]);
                }
                return word.replace(/v/gi, function (word) { return util.keep_case(word, 'b'); });
            });
        };

        this.ll_rules = function (text) {
            // Replacing /ʎ/ (digraph ll) with Greek Y for /ʤ/ sound (voiced postalveolar affricate)
            return text.replace(/\b(\w*?)(l)(l)(\w*?)\b/gi, function (word) {
                if (exports.LL_RULES_EXCEPT[word.toLowerCase()]) {
                    return util.keep_case(word, exports.LL_RULES_EXCEPT[word.toLowerCase()]);
                }
                return word.replace(/ll/gi, function (word) { return util.keep_case(word, 'y'); });
            });
        };

        this.l_rules = function (text) {
            // Rotating /l/ with /r/
            return text.replace(/(l)(b|c|ç|g|s|d|f|g|h|k|m|p|q|r|t|x|z)/gi, function (_, l_char, suffix) { return util.keep_case(l_char, 'r') + suffix; });
        };

        //TODO: Keep case.
        this.psico_pseudo_rules = function (text) {
            return text.replace(/(psic|psiq|pseud)/gi, function (_, syllabe) {
              return util.keep_case(syllabe[0], syllabe[1]) + syllabe.slice(2, syllabe.length)
            });
        };

        // Replacing Voiceless alveolar fricative (vaf) /s/ /θ/ with EPA's ç/Ç
        this.vaf_rules = function (text, vaf) {
            if (vaf === void 0) { vaf = exports.VAF; }
            return text
                .replace(/(c(?=e|i|é|í|ê|î)|z|s)(a|e|i|o|u|á|é|í|ó|ú|Á|É|Í|Ó|Ú|â|ê|î|ô|û|Â|Ê|Î|Ô|Û)/gi, function (_, cons_char, suffix) { return util.keep_case(cons_char, vaf) + suffix; });
        };

        this.word_ending_rules = function (text) {
            var repl_rules = {
                a: 'â', A: 'Â', á: 'â', Á: 'Â',
                e: 'ê', E: 'Ê', é: 'ê', É: 'Ê',
                i: 'î', I: 'Î', í: 'î', Í: 'Î',
                o: 'ô', O: 'Ô', ó: 'ô', Ó: 'Ô',
                u: 'û', U: 'Û', ú: 'û', Ú: 'Û'
            };

            var stressed_rules = {
                a: 'á', A: 'Á', á: 'á', Á: 'Á',
                e: 'é', E: 'É', é: 'é', É: 'É',
                i: 'î', I: 'Î', í: 'î', Í: 'Î',
                o: 'ô', O: 'Ô', ó: 'ô', Ó: 'Ô',
                u: 'û', U: 'Û', ú: 'û', Ú: 'Û'
            };

            var contain_vocal_tilde = function (string) { return new RegExp(/á|é|í|ó|ú/gi).test(string); };

            var replace_intervowel_d_end_with_case = function (word, prefix, suffix_vowel_a, suffix_d_char, suffix_vowel_b, ending_s) {
                if (exports.WORDEND_D_INTERVOWEL_RULES_EXCEPT[word.toLowerCase()]) {
                    return util.keep_case(word, exports.WORDEND_D_INTERVOWEL_RULES_EXCEPT[word.toLowerCase()]);
                }
                if (contain_vocal_tilde(prefix))
                    return word;
                var suffix = suffix_vowel_a + suffix_d_char + suffix_vowel_b + ending_s;
                switch (suffix.toLowerCase()) {
                    case 'ada':
                        return prefix + util.keep_case(suffix_vowel_b, 'á');
                    case 'adas':
                        return prefix + util.keep_case(suffix.substring(0, 2), util.get_vowel_circumflex(suffix[0]) + 'h');
                    case 'ado':
                        return prefix + suffix_vowel_a + suffix_vowel_b;
                    case 'ados':
                    case 'idos':
                    case 'ídos':
                        return prefix + util.get_vowel_tilde(suffix_vowel_a) + util.get_vowel_circumflex(suffix_vowel_b);
                    case 'ido':
                    case 'ído':
                        return prefix + util.keep_case(suffix_vowel_a, 'í') + suffix_vowel_b;
                    default:
                        return word;
                }
            };

            var replace_eps_end_with_case = function (word, prefix, suffix_vowel, suffix_const) {
                //  Leave as it is. There shouldn't be any word with -eps ending withough accent.
                if (!contain_vocal_tilde(prefix))
                    return prefix + suffix_vowel + suffix_const;
                return prefix + util.keep_case(suffix_vowel, 'ê');
            };

            var replace_d_end_with_case = function (match, prefix, suffix_vowel, suffix_const) {
                var word = prefix + suffix_vowel + suffix_const;

                if (exports.WORDEND_D_RULES_EXCEPT[word.toLowerCase()]) {
                    var and_word = util.keep_case(word, exports.WORDEND_D_RULES_EXCEPT[word.toLowerCase()]);
                    return match.replace(word, and_word);
                }

                if (contain_vocal_tilde(prefix)) {
                    return match.replace(word, prefix + repl_rules[suffix_vowel]);
                }

                if (['a', 'e', 'A', 'E', 'á', 'é', 'Á', 'É'].indexOf(suffix_vowel) >= 0) {
                    return match.replace(word, prefix + stressed_rules[suffix_vowel]);
                }

                return match.replace(word, prefix + stressed_rules[suffix_vowel] + util.keep_case(suffix_const, 'h'));
            };

            var replace_s_end_with_case = function (match, prefix, suffix_vowel, suffix_const) {
                var word = prefix + suffix_vowel + suffix_const;

                if (exports.WORDEND_S_RULES_EXCEPT[word.toLowerCase()]) {
                    var and_word = util.keep_case(word, exports.WORDEND_S_RULES_EXCEPT[word.toLowerCase()]);
                    return match.replace(word, and_word);
                }

                if (!contain_vocal_tilde(suffix_vowel)) {
                    return match.replace(word, prefix + repl_rules[suffix_vowel]);
                }

                return match.replace(word, prefix + repl_rules[suffix_vowel] + util.keep_case(suffix_const, 'h'));
            };

            var replace_const_end_with_case = function (match, prefix, suffix_vowel, suffix_const) {
                var word = prefix + suffix_vowel + suffix_const;

                if (exports.WORDEND_CONST_RULES_EXCEPT[word.toLowerCase()]) {
                    var and_word = util.keep_case(word, exports.WORDEND_CONST_RULES_EXCEPT[word.toLowerCase()]);
                    return match.replace(word, and_word);
                }

                if (contain_vocal_tilde(prefix)) {
                    return match.replace(word, prefix + repl_rules[suffix_vowel]);
                }
                return match.replace(word, prefix + repl_rules[suffix_vowel] + util.keep_case(suffix_vowel, 'h'));
            };

            return text
                .replace(/\b(\S*?)(a|i|í|Í)(d)(o|a)(s?)\b/gi, replace_intervowel_d_end_with_case)
                .replace(/\b(\S+?)(e)(ps)\b/gi, replace_eps_end_with_case)
                .replace(/[\s.,;!?]?(\S+?)(a|e|i|o|u|á|é|í|ó|ú)(d)([\s.,;!?]|$)/gi, replace_d_end_with_case)
                .replace(/[\s.,;!?]?(\S+?)(a|e|i|o|u|á|é|í|ó|ú)(s)([\s.,;!?]|$)/gi, replace_s_end_with_case)
                .replace(/(\S+?)(a|e|i|o|u|á|é|í|ó|ú)(b|c|f|g|j|k|l|p|r|t|x|z)([\s.,;:!?\]\)\}]|$)/gi, replace_const_end_with_case);
        };

        this.digraph_rules = function (text) {
          var digraphs = exports.DIGRAPHS.join('|');
          var rDigraphs = new RegExp('(a|e|i|o|u|á|é|í|ó|ú)(' + digraphs + ')', 'gi');

          return text
              // intersticial / solsticio / superstición / cárstico => interttiçiâh / çorttiçio / çuperttiçión / cárttico
              .replace(/(a|e|i|o|u|á|é|í|ó|ú)(l|r)s(t)/gi, function (_, vowel_char, lr_char, t_char) { 
                return vowel_char + (lr_char.toLowerCase() === 'l' ? util.keep_case(lr_char, 'r') : lr_char) + t_char + t_char; })
              // aerotransporte => aerotrâpporte | translado => trâl-lao | transcendente => trâççendente | postpalatal => pôppalatal
              .replace(/(tr|p)(a|o)(?:ns|st)(b|c|ç|d|f|g|h|j|k|l|m|n|p|q|s|t|v|w|x|y|z)/gi, function (_, init_char, vowel_char, cons_char) { 
                return init_char + util.get_vowel_circumflex(vowel_char) + cons_char + (cons_char.toLowerCase() === 'l' ? '-' : '') + cons_char; })
              // abstracto => âttrâtto | adscrito => âccrito | perspectiva => pêrppêttiba
              .replace(/(a|e|i|o|u|á|é|í|ó|ú)(b|d|n|r)(s)(b|c|ç|d|f|g|h|j|k|l|m|n|p|q|s|t|v|w|x|y|z)/gi, function (_, vowel_char, cons_char, s_char, digraph_char) {
                var isrs = cons_char.toLowerCase() === 'r' && s_char.toLowerCase() === 's';
                return (isrs ? vowel_char + cons_char : util.get_vowel_circumflex(vowel_char)) + digraph_char.repeat(2);
              })
              // atlántico => âl-lántico | orla => ôl-la | adlátere => âl-látere | tesla => têl-la ...
              .replace(/(a|e|i|o|u|á|é|í|ó|ú)(?:d|j|r|s|t|x|z)(l)/gi, function (_, vowel_char, digraph_char) { 
                return util.get_vowel_circumflex(vowel_char) + digraph_char + '-' + digraph_char; 
              })
              // General digraph rules
              .replace(rDigraphs, function (_, vowel_char, digraph_chars) { 
                return util.get_vowel_circumflex(vowel_char) + digraph_chars[1].repeat(2); 
              })
            ;
        };

        this.exception_rules = function (text) {
          var exceptions = Object.keys(exports.ENDING_RULES_EXCEPTION).join('|');
          // FIX giu only works Safari>=v10 Check: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode
          var rExceptions = new RegExp('(?=|$|[^\\p{L}])(' + exceptions + ')(?=^|$|[^\\p{L}])', 'giu');

          // Set of exceptions to the replacement algorithm
          return text.replace(rExceptions, function (word) {
            return util.keep_case(word, exports.ENDING_RULES_EXCEPTION[word.toLowerCase()]);
          });
        };

        // Contractions and other word interaction rules
        this.word_interaction_rules = function (text) {
          // Rotating word ending /l/ with /r/ if first next word char is non-r consonant
          return text.replace(/\b(\w*?)(l)(\s)(b|c|ç|d|f|g|h|j|k|l|m|n|ñ|p|q|s|t|v|w|x|y|z)/gi, function (_, prefix, l_char, whitespace_char, suffix) {
            return prefix + util.keep_case(l_char, 'r') + whitespace_char + suffix; 
          });
        };

        this.transcript = function (text, vaf, vvf, scapeLinks) {
            if (vaf === void 0) { vaf = exports.VAF; }
            if (vvf === void 0) { vvf = exports.VVF; }
            if (scapeLinks === void 0) { scapeLinks = false; }

            var substitutedText = text;

            if (scapeLinks) {
                substitutedText = _this.ignore_rules(text);
            }

            var rules = [
                _this.h_rules,
                _this.x_rules,
                _this.ch_rules,
                _this.gj_rules,
                _this.v_rules,
                _this.ll_rules,
                _this.l_rules,
                _this.psico_pseudo_rules,
                _this.vaf_rules,
                _this.word_ending_rules,
                _this.digraph_rules,
                _this.exception_rules,
                _this.word_interaction_rules
            ];

            var finalText = rules.reduce(function (substitutedText, rule) {
                if (rule === _this.x_rules)
                    return _this.x_rules(substitutedText, vaf);
                if (rule === _this.vaf_rules)
                    return _this.vaf_rules(substitutedText, vaf);
                if (rule === _this.gj_rules)
                    return _this.gj_rules(substitutedText, vvf);
                return rule(substitutedText);
            }, substitutedText);

            return _this.tags.reduce(function (text, tags) { return text.replace(tags[0], tags[1]); }, finalText);
        };
    }
    return EPA;
}());
exports["EPA"] = EPA;