/**
 * Copyleft (c) 2018-2019 Andalugeeks
 *
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com>
 * - J. Félix Ontañón <felixonta@gmail.com>
 */

import EPA, { VAF, VVF } from '../src/transcripts/epa';
import { expect } from 'chai';

describe('Andalugeeks - EPA transcription Tests', () => {
    const epa = new EPA();

    const transcriptionsTest = {
        'Todo Xenomorfo dice: [haber], que el Éxito y el éxtasis asfixian, si no eres un xilófono Chungo.': 'Tó Çenomorfo diçe: [abêh], que el Éççito y el éttaçî âffîççian, çi no erê un çilófono Xungo.',
        'Lleva un Guijarrito el ABuelo, ¡Qué Bueno! ¡para la VERGÜENZA!': 'Yeba un Giharrito el AGuelo, ¡Qué Gueno! ¡pa la BERGUENÇA!',
        'VALLA valla, si vas toda de ENVIDIA': 'BAYA baya, çi bâ toa de EMBIDIA',
        'Alrededor de la Alpaca había un ALfabeto ALTIVO de valkirias malnacidas': 'Arrededôh de la Arpaca abía un ARfabeto ARTIBO de barkiriâ mânnaçidâ',
        'En la Zaragoza y el Japón asexual se Sabía SÉriamente sILBAR con el COxis': 'En la Çaragoça y er Hapón açêççuâh çe Çabía ÇÉriamente çIRBÂH con er CÔççî',
        'Transportandonos a la connotación perspicaz del abstracto solsticio de Alaska, el aislante plástico adsorvente asfixió al aMnésico pseudoescritor granadino de constituciones, para ConMemorar broncas adscritas': 'Trâpportandonô a la cônnotaçión perppicâh del âttrâtto çorttiçio de Alâkka, el aîl-lante pláttico âççorbente âffîççió al ânnéçico çeudoêccritôh granadino de côttituçionê, pa CôMMemorâh broncâ âccritâ',
        'En la postmodernidad, el transcurso de los transportes y translados en postoperatorios transcienden a la postre unas postillas postpalatales apostilladas se transfieren': 'En la pômmodênnidá, er trâccurço de lô trâpportê y trâl-láô en pôttoperatoriô trâççienden a la pôttre unâ pôttiyâ pôppalatalê apôttiyâh çe trâffieren',
        'Venid todos a correr en anorak de visón a Cádiz con actitud y maldad, para escuchar el tríceps de Albéniz tocar ápud con virtud de laúd.': 'Benîh tôh a corrêh en anorâh de biçón a Cádî con âttitûh y mardá, pa êccuxâh er tríçê de Arbénî tocâh ápû con birtûh de laûh.',
        'Una comida fabada con fado, y sin descuido será casada y amarrada al acolchado roido.': 'Una comida fabada con fado, y çin dêccuido çerá caçá y amarrá al acorxao roío.',
        'Los SABuesos ChiHuaHUA comían cacaHuETes, FramBuESas y Heno, ¡y HABLAN ESPANGLISH!': 'Lô ÇAGueçô XiGuaGUA comían cacaGuETê, FramBuEÇâ y Eno, ¡y ABLAN ÊPPANGLÎ!',
    };

    const testScapeLinks = {
        'Oye hermano @miguel, la web HTTPS://andaluh.es no sale en google.es pero si en http://google.com #porqueseñor': 'Oye ermano @miguel, la wêh HTTPS://andaluh.es no çale en google.es pero çi en http://google.com #porqueseñor',
        'Bienvenidos al Siglo XXI a los nuevos integrantes @Karlos_30 y @usuario2342 #bienvenida #saludos': 'Biembeníô ar Çiglo XXI a lô nuebô integrantê @Karlos_30 y @usuario2342 #bienvenida #saludos',
        'El otro día ConoCí a UNa seXY señorita': 'El otro día ConoÇí a UNa çêÇÇY çeñorita'
    };

    for (const key of Object.keys(transcriptionsTest)) {
        it('should transcipt "' + key.substring(0, 20) + '..." correctly', () => {
            expect(epa.transcript(key)).to.equal(transcriptionsTest[key]);
        });
    }

    for (const key of Object.keys(testScapeLinks)) {
        it('should transcipt "' + key.substring(0, 20) + '..." correctly', () => {
            expect(epa.transcript(key, VAF, VVF, true)).to.equal(testScapeLinks[key]);
        });
    }

    it('should pass h_rules', () => {
        // rule 1
        expect(epa.h_rules('chihuahua chua hua')).to.equal('chiguagua chua gua');
        // rule 2
        expect(epa.h_rules('acahuete chueca hueco')).to.equal('acagüete chueca güeco');
        // rule 3
        expect(epa.h_rules('ahora hora hazahí hay habrá haz hez')).to.equal('aora ora azaí ay abrá âh êh');
    });

    it('should pass x_rules', () => {
        // rule 1
        expect(epa.x_rules('Xilófono roto')).to.equal('Çilófono roto');
        // rule 2
        expect(epa.x_rules('Axila Éxito')).to.equal('Âççila Éççito');
        // rule 3
        expect(epa.x_rules('p xi xhin xino exquisito ex Éxito')).to.equal('p çi çhin çino exquisito ex Éççito');

        // test VAF -> z
        expect(epa.x_rules('p xi xhin xino exquisito ex Éxito', 'z')).to.equal('p zi zhin zino exquisito ex Ézzito');
        // test VAF -> s
        expect(epa.x_rules('p xi xhin xino exquisito ex Éxito', 's')).to.equal('p si shin sino exquisito ex Éssito');
        // test VAF -> h
        expect(epa.x_rules('p xi xhin xino exquisito ex Éxito', 'h')).to.equal('p hi hhin hino exquisito ex Éhhito');
    });

    it('should pass ch_rules', () => {
        // rule 1
        expect(epa.ch_rules('hecho hache hachis')).to.equal('hexo haxe haxis');
    });

    it('should pass gj_rules', () => {
        // exceptions
        expect(epa.gj_rules('gin jazz gin jet')).to.equal('yin yâh yin yêh');
        // G,J + vowel replacement
        expect(epa.gj_rules('ages sausages ají exagerado jerónimo aajo ajonjolí')).to.equal('ahes sausahes ahí exaherado herónimo aaho ahonholí');
        // GUE,GUI,GÜE,GÜI replacement
        expect(epa.gj_rules('ague agUÍ aGUe agUÍ agÜe agüÍ aGÜe ÂgüÍ')).to.equal('age agÍ aGe agÍ agUe aguÍ aGUe ÂguÍ');
        // bueno  => gueno
        expect(epa.gj_rules('bueno')).to.equal('gueno');
        // abuelo / sabueso / aguelo / sagues
        expect(epa.gj_rules('abuelo / sabueso')).to.equal('aguelo / sagueso');
    });

    it('should pass v_rules', () => {
        // exceptions
        expect(epa.v_rules('vis vis ves visavis')).to.equal('bî bî bêh bisabis');
        expect(epa.v_rules('envidia')).to.equal('embidia');
    });

    it('should pass ll_rules', () => {
        expect(epa.ll_rules('llanto Llanta llAnta lLAnta llaRLla')).to.equal('yanto Yanta yAnta yAnta yaRYa');
    });

    it('should pass l_rules', () => {
        expect(epa.l_rules('elbetis eLCabesa eLçol')).to.equal('erbetis eRCabesa eRçol');
    });

    it('should pass psico_pseudo_rules', () => {
        expect(epa.psico_pseudo_rules('psicóloga PSIcológico pseuDoNimo PSEUDónimo')).to.equal('sicóloga SIcológico seuDoNimo SEUDónimo');
    });

    it('should pass vaf_rules', () => {
        expect(epa.vaf_rules('sazonador zorro saco zoológico cepillo cinturón contról cêhilla zíso sâl')).to.equal('çaçonador çorro çaco çoológico çepillo çinturón contról çêhilla çíço çâl');
    });

    it('should pass word_ending_rules', () => {
        // exceptions
        expect(epa.word_ending_rules('fado despido cado bûççido')).to.equal('fado despido cado bûççido');
        expect(epa.word_ending_rules('áeps sonadO sonaDas sáeps saeps enFadADa enfadaDos espío despdo')).to.equal('áê sonaO sonâh sáê saeps enFadá enfadáô espío despdo');
    });

    it('should pass digraph_rules', () => {
        // solsticio / superstición / cárstico
        expect(epa.digraph_rules('solsticio superstición cárstico')).to.equal('sortticio superttición cárttico');

        expect(epa.digraph_rules('aerotransporte translado transcendente')).to.equal('aerotrâpporte trâl-lado trâccendente');

        expect(epa.digraph_rules('abstracto adscrito perspectiva')).to.equal('âttrâtto âccrito perppêttiva');
    });

    it('should pass exception_rules', () => {
        expect(
            epa.exception_rules('muy biêmmandao mârrotâh mirrayâ as biêmmeçabe clown')
        ).to.equal('mu bienmandao mârrotâh mîrrayâ âh bienmeçabe claun');
    });

    it('should pass word_interaction_rules', () => {
        expect(epa.word_interaction_rules('el betis el çol ôl con el zoo')).to.equal('er betis er çol ôr con er zoo');
    });

});
