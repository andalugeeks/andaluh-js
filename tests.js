/**
 * Copyleft (c) 2018-2021 Andalugeeks
 *
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com> (original javascript/typescript dev)
 * - J. Félix Ontañón <felixonta@gmail.com> (port to google apps script)
 *
 */

var transcriptionsTest = {
    'Todo Xenomorfo dice: [haber], que el Éxito y el éxtasis asfixian, si no eres un xilófono Chungo.': 'Tó Çenomorfo diçe: [abêh], que el Éççito y el éttaçî âffîççian, çi no erê un çilófono Xungo.',
    'Lleva un Guijarrito el ABuelo, ¡Qué Bueno! ¡para la VERGÜENZA!.': 'Yeba un Giharrito el AGuelo, ¡Qué Gueno! ¡pa la BERGUENÇA!.',
    'VALLA valla, si vas toda de ENVIDIA.': 'BAYA baya, çi bâ toa de EMBIDIA.',
    'Alrededor de la Alpaca había un ALfabeto ALTIVO de valkirias malnacidas.': 'Arrededôh de la Arpaca abía un ARfabeto ARTIBO de barkiriâ mânnaçidâ.',
    'En la Zaragoza y el Japón asexual se Sabía SÉriamente sILBAR con el COxis.': 'En la Çaragoça y er Hapón açêççuâh çe Çabía ÇÉriamente çIRBÂH con er CÔççî.',
    'Transportandonos a la connotación perspicaz del abstracto solsticio de Alaska, el aislante plástico adsorvente asfixió al aMnésico pseudoescritor granadino de constituciones, para ConMemorar broncas adscritas.': 'Trâpportandonô a la cônnotaçión perppicâh del âttrâtto çorttiçio de Alâkka, el aîl-lante pláttico âççorbente âffîççió al ânnéçico çeudoêccritôh granadino de côttituçionê, pa CôMMemorâh broncâ âccritâ.',
    'En la postmodernidad, el transcurso de los transportes y translados en postoperatorios transcienden a la postre unas postillas postpalatales apostilladas se transfieren.': 'En la pômmodênnidá, er trâccurço de lô trâpportê y trâl-láô en pôttoperatoriô trâççienden a la pôttre unâ pôttiyâ pôppalatalê apôttiyâh çe trâffieren.',
    'Venid todos a correr en anorak de visón a Cádiz con actitud y maldad, para escuchar el tríceps de Albéniz tocar ápud con virtud de laúd.': 'Benîh tôh a corrêh en anorâh de biçón a Cádî con âttitûh y mardá, pa êccuxâh er tríçê de Arbénî tocâh ápû con birtûh de laûh.',
    'Una comida fabada con fado, y sin descuido será casada y amarrada al acolchado roido.': 'Una comida fabada con fado, y çin dêccuido çerá caçá y amarrá al acorxao roío.',
    'Los SABuesos ChiHuaHUA comían cacaHuETes, FramBuESas y Heno sobre la mampara, ¡y HABLAN ESPANGLISH!.': 'Lô ÇAGueçô XiGuaGUA comían cacaGuETê, FramBuEÇâ y Eno çobre la mampara, ¡y ABLAN ÊPPANGLÎ!.',
};

var testScapeLinks = {
    'Oye hermano @miguel, la web HTTPS://andaluh.es no sale en google.es pero si en http://google.com #porqueseñor.': 'Oye ermano @miguel, la wêh HTTPS://andaluh.es no çale en google.es pero çi en http://google.com #porqueseñor.',
    'Bienvenidos al Siglo XXI a los nuevos integrantes @Kárlos_30 y @usûario2342 #bienvenida #saludos.': 'Biembeníô ar Çiglo XXI a lô nuebô integrantê @Kárlos_30 y @usûario2342 #bienvenida #saludos.',
    'El otro día ConoCí a UNa seXY señorita.': 'El otro día ConoÇí a UNa çêÇÇY çeñorita.'
};

function words(s) {
  return s.toLowerCase().match(/\S+/g);
}

function loop(tests, vaf, vvf, escapeLinks) {
  var epa = new EPA();

  var errors = false;

  for (var i = 0, a = Object.keys(tests); i < a.length; i++) {
    var key = a[i];
    var value = tests[key];
    var and = epa.transcript(key, vaf, vvf, escapeLinks);

    if (value != and) {
      let a = words(value);
      let b = words(and);
      let differences = b.filter(i => !a.includes(i));

      console.log('ERROR: ', value, and);
      console.log(differences);
      errors = true;
    }
  }

  return errors;
}

function main() {
  var err1 = loop(transcriptionsTest, 'ç', 'h', false);
  var err2 = loop(testScapeLinks, 'ç', 'h', true);

  if (!err1 && !err2) { console.log ("Success!")};
}