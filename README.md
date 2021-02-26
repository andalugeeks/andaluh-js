# Andaluh-gs

Google Apps Script implementation for [andaluh-js](https://github.com/andalugeeks/andaluh-js). Transliterate español (spanish) spelling to andaluz proposals.

<img width="800" alt="andaluh-gs about" src="https://github.com/andalugeeks/andaluh-js/raw/google-apps-script/img/andaluh-gs.png?raw=true">

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Support](#support)
- [Contributing](#contributing)

## Description

The **Andalusian varieties of [Spanish]** (Spanish: *andaluz*; Andalusian) are spoken in Andalusia, Ceuta, Melilla, and Gibraltar. They include perhaps the most distinct of the southern variants of peninsular Spanish, differing in many respects from northern varieties, and also from Standard Spanish. Further info: https://en.wikipedia.org/wiki/Andalusian_Spanish.

This package introduces transliteration functions to convert *español* (spanish) spelling to andaluz. As there's no official or standard andaluz spelling, andaluh-js is adopting the **EPA proposal (Er Prinzipito Andaluh)**. Further info: https://andaluhepa.wordpress.com. Other andaluz spelling proposals are planned to be added as well.

## Installation

Just upload the `andalu/*js` files into your Google Apps Script project, or automate with Google Apps Script `clasp` tool. The benefit of the second approach is you can keep developing locally your `andaluh-gs` based project instead of using the Google Apps Script web IDE.

```
$ npm install -g @google/clasp
```

Install the google apps script type definitions as well:

```
$ npm i -S @types/google-apps-script
```

Login and push!

```
$ clasp login
$ clasp push
```

## Usage

Have a look at the following snippet

```javascript
const andaluhEPA = new EPA();
console.log(andaluhEPA.transcript('El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja'));
// Er belôh murçiélago indú comía felîh cardiyo y kiwi. La çigueña tocaba er çâççofón detrâh der palenque de paha.
```

## Roadmap

* Adding more andaluh spelling proposals.
* Contractions and inter-word interaction rules pending to be implemented.
* Silent /h/ sounds spelling rules pending to be implemented.
* Some spelling intervowel /d/ rules are still pending to be implemented.
* Transliteration rules for some consonant ending words still pending to be implemented.

## Support

Please [open an issue](https://github.com/andalugeeks/andaluh-js/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a pull request.
