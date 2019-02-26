# Andaluh-js

Transliterate español (spanish) spelling to andaluz proposals

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Description

The **Andalusian varieties of [Spanish]** (Spanish: *andaluz*; Andalusian) are spoken in Andalusia, Ceuta, Melilla, and Gibraltar. They include perhaps the most distinct of the southern variants of peninsular Spanish, differing in many respects from northern varieties, and also from Standard Spanish. Further info: https://en.wikipedia.org/wiki/Andalusian_Spanish.

This package introduces transliteration functions to convert *español* (spanish) spelling to andaluz. As there's no official or standard andaluz spelling, andaluh-py is adopting the **EPA proposal (Er Prinzipito Andaluh)**. Further info: https://andaluhepa.wordpress.com. Other andaluz spelling proposals are planned to be added as well.

## Installation

From NPM repository
```
$ npm install @andalugeeks/andaluh --save
```

## Usage

### Javascript
```javascript
const EPA = require('@andalugeeks/andaluh').epa;
const andaluhEPA = new EPA();
console.log(andaluhEPA.transcript('El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja'));
// Er belôh murçiélago indú comía felîh cardiyo y kiwi. La çigueña tocaba er çâççofón detrâh der palenque de paha.
```
### TypeScript
```typescript
import EPA from '@andalugeeks/andaluh';
var andaluhEPA = new EPA();
console.log(andaluhEPA.transcript('El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja'));
// Er belôh murçiélago indú comía felîh cardiyo y kiwi. La çigueña tocaba er çâççofón detrâh der palenque de paha.
```

## Roadmap

* Adding more andaluh spelling proposals.
* Contractions and inter-word interaction rules pending to be implemented.
* Silent /h/ sounds spelling rules pending to be implemented.
* Some spelling intervowel /d/ rules are still pending to be implemented.
* Transliteration rules for some consonant ending words still pending to be implemented.
* The andaluh EPA group is still deliberating about the 'k' letter.

## Support

Please [open an issue](https://github.com/andalugeeks/andaluh-py/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a pull request.