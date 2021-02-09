/**
 * Copyleft (c) 2018-2019 Andalugeeks
 *
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com>
 * - J. Félix Ontañón <felixonta@gmail.com>
 */

import EPA, { VAF, VVF } from '../src/transcripts/epa';
import { expect } from 'chai';
import { readFileSync, } from 'fs';
import { resolve } from 'path';
import { csvToArray } from './util';
const lemarioCsv = readFileSync(resolve(__dirname, 'lemario.csv'), 'utf-8');
const lemarioArr = csvToArray(lemarioCsv, ',', false);

describe('Andalugeeks - EPA transcription Tests', () => {
    const epa = new EPA();

    lemarioArr.forEach(line => {
        it(`should transcript ${line[0]} correctly`, () => {
            expect(epa.transcript(line[0])).to.equal(line[1]);
        });
    });

});
