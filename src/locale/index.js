import bg from './bg.json';
import sl from './sl.json';
import ja from './ja.json';
import th from './th.json';
import da from './da.json';
import ar from './ar.json';
import nl from './nl.json';
import de from './de.json';
import uk from './uk.json';
import ro from './ro.json';
import az from './az.json';
import ru from './ru.json';
import vi from './vi.json';
import zh from './zh.json';
import bs from './bs.json';
import hy from './hy.json';
import tr from './tr.json';
import id from './id.json';
import cs from './cs.json';
import hu from './hu.json';
import et from './et.json';
import he from './he.json';
import hi from './hi.json';
import sv from './sv.json';
import fr from './fr.json';
import fa from './fa.json';
import ka from './ka.json';
import it from './it.json';
import lv from './lv.json';
import lt from './lt.json';
import kk from './kk.json';
import pt from './pt.json';
import fi from './fi.json';
import ko from './ko.json';
import el from './el.json';
import pl from './pl.json';
import en from './en.json';

let current = en;
let langCode = 'en';
let RTL = false;
let fontstyle = 'montserrat';

const setDefaultLocale = () => {
  current = en;
  langCode = 'en';
  fontstyle = 'montserrat';
  RTL = false;
};

const setLocale = (language) => {
  let {code, font} = language;
  if (font) {
    fontstyle = font;
  }
  switch (code) {
    case 'bg':
      current = bg;
      RTL = false;
      langCode = 'bg';
      break;

    case 'sl':
      current = sl;
      RTL = false;
      langCode = 'sl';
      break;

    case 'ja':
      current = ja;
      RTL = false;
      langCode = 'ja';
      break;

    case 'th':
      current = th;
      RTL = false;
      langCode = 'th';
      break;

    case 'da':
      current = da;
      RTL = false;
      langCode = 'da';
      break;

    case 'ar':
      current = ar;
      RTL = true;
      langCode = 'ar';
      break;

    case 'nl':
      current = nl;
      RTL = false;
      langCode = 'nl';
      break;

    case 'de':
      current = de;
      RTL = false;
      langCode = 'de';
      break;

    case 'uk':
      current = uk;
      RTL = false;
      langCode = 'uk';
      break;

    case 'ro':
      current = ro;
      RTL = false;
      langCode = 'ro';
      break;

    case 'az':
      current = az;
      RTL = false;
      langCode = 'az';
      break;

    case 'ru':
      current = ru;
      RTL = false;
      langCode = 'ru';
      break;

    case 'vi':
      current = vi;
      RTL = false;
      langCode = 'vi';
      break;

    case 'zh':
      current = zh;
      RTL = false;
      langCode = 'zh';
      break;

    case 'bs':
      current = bs;
      RTL = false;
      langCode = 'bs';
      break;

    case 'hy':
      current = hy;
      RTL = false;
      langCode = 'hy';
      break;

    case 'tr':
      current = tr;
      RTL = false;
      langCode = 'tr';
      break;

    case 'id':
      current = id;
      RTL = false;
      langCode = 'id';
      break;

    case 'cs':
      current = cs;
      RTL = false;
      langCode = 'cs';
      break;

    case 'hu':
      current = hu;
      RTL = false;
      langCode = 'hu';
      break;

    case 'et':
      current = et;
      RTL = false;
      langCode = 'et';
      break;

    case 'he':
      current = he;
      RTL = true;
      langCode = 'he';
      break;

    case 'hi':
      current = hi;
      RTL = false;
      langCode = 'hi';
      break;

    case 'sv':
      current = sv;
      RTL = false;
      langCode = 'sv';
      break;

    case 'fr':
      current = fr;
      RTL = false;
      langCode = 'fr';
      break;

    case 'fa':
      current = fa;
      RTL = true;
      langCode = 'fa';
      break;

    case 'ka':
      current = ka;
      RTL = false;
      langCode = 'ka';
      break;

    case 'it':
      current = it;
      RTL = false;
      langCode = 'it';
      break;

    case 'lv':
      current = lv;
      RTL = false;
      langCode = 'lv';
      break;

    case 'lt':
      current = lt;
      RTL = false;
      langCode = 'lt';
      break;

    case 'kk':
      current = kk;
      RTL = false;
      langCode = 'kk';
      break;

    case 'pt':
      current = pt;
      RTL = false;
      langCode = 'pt';
      break;

    case 'fi':
      current = fi;
      RTL = false;
      langCode = 'fi';
      break;

    case 'ko':
      current = ko;
      RTL = false;
      langCode = 'ko';
      break;

    case 'el':
      current = el;
      RTL = false;
      langCode = 'el';
      break;

    case 'pl':
      current = pl;
      RTL = false;
      langCode = 'pl';
      break;

    default:
      current = en;
      RTL = false;
      langCode = 'en';
      break;
  }
};

const getFontstyle = () => {
  return fontstyle;
};

const getLocale = () => {
  return current;
};

const isRTL = () => {
  return RTL;
};

const getLangCode = () => {
  return langCode;
};

/** Translate the existing values */
const t = (key) => {
  return getLocale()[key];
};

export {
  getLocale,
  setLocale,
  setDefaultLocale,
  t,
  getFontstyle,
  isRTL,
  getLangCode,
};
