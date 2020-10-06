# Andaluh-js

Transliterate español (spanish) spelling to andaluz proposals

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Publishing](#publishing)
- [Support](#support)
- [Contributing](#contributing)

## Description

The **Andalusian varieties of [Spanish]** (Spanish: *andaluz*; Andalusian) are spoken in Andalusia, Ceuta, Melilla, and Gibraltar. They include perhaps the most distinct of the southern variants of peninsular Spanish, differing in many respects from northern varieties, and also from Standard Spanish. Further info: https://en.wikipedia.org/wiki/Andalusian_Spanish.

This package introduces transliteration functions to convert *español* (spanish) spelling to andaluz. As there's no official or standard andaluz spelling, andaluh-js is adopting the **EPA proposal (Er Prinzipito Andaluh)**. Further info: https://andaluhepa.wordpress.com. Other andaluz spelling proposals are planned to be added as well.

## Installation

From NPM repository
```
$ npm install @andalugeeks/andaluh --save
```

## Usage

First, install dependencies with `npm install`. Then use `tsc CLI` to build the distribution `/dist` folder with `tsc`.

### Javascript

```javascript
const EPA = require('@andalugeeks/andaluh').epa;
const andaluhEPA = new EPA();
console.log(andaluhEPA.transcript('El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja'));
// Er belôh murçiélago indú comía felîh cardiyo y kiwi. La çigueña tocaba er çâççofón detrâh der palenque de paha.
```
### TypeScript

You can simply use:

```typescript
import EPA from '@andalugeeks/andaluh';
var andaluhEPA = new EPA();
console.log(andaluhEPA.transcript('El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja'));
// Er belôh murçiélago indú comía felîh cardiyo y kiwi. La çigueña tocaba er çâççofón detrâh der palenque de paha.
```

## Publishing

To submit a package to npm registry (as `npmjs`), use `tsc` (typescript CLI) to build the distribution folder `/dist`, then:

```shell
$ npm publish
```

Consider to upgrade the major/minor/patch version before submitting a new package (edit `package.json`). Also remember to login with npm on your registry account before publishing.

## Roadmap

* Adding more andaluh spelling proposals.
* Contractions and inter-word interaction rules pending to be implemented.
* Silent /h/ sounds spelling rules pending to be implemented.
* Some spelling intervowel /d/ rules are still pending to be implemented.
* Transliteration rules for some consonant ending words still pending to be implemented.
* The andaluh EPA group is still deliberating about the 'k' letter.

## Support

Please [open an issue](https://github.com/andalugeeks/andaluh-js/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a pull request.