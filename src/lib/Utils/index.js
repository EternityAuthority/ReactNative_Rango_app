import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {distance} from 'fastest-levenshtein';
import {QUESTION_TYPES} from '../Constants';

/* IF any of the validation method changes then change accordingly on the server */
const Utils = {
  snooze: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /** Returns a random number between 1 to 10 */
  getRandom: () => {
    return Math.floor(Math.random() * 4 - 1);
  },

  /** Update logic on server as well when changed */
  validateName: (name) => {
    return name && name.trim().length > 1 && /^[A-Za-z0-9\s]+$/.test(name);
  },

  /** Update logic on server as well when changed */
  validateAge: (age) => {
    return age && age.trim().length > 0 && /^[0-9]+$/.test(age);
  },

  /** Update on server as well, when changed */
  validateEmail: (email) => {
    return email && /\S+@\S+\.\S+/.test(email);
  },

  validatePassword: (password) => {
    return password && password.length > 7;
  },

  /** Extracts first name from the name */
  getFirstName: (name) => {
    let firstName = name.split(' ')[0];
    return firstName;
  },

  /** Returns the first leter of each of the words in name, max up to two chars */
  getInitialsOfName: (name = '') => {
    let arr = name.split(' ');
    let finalName = '';
    if (arr.length > 1) {
      finalName = `${arr[0].charAt(0)}${arr[1].charAt(0)}`;
    } else {
      finalName = `${arr[0].charAt(0)}`;
    }
    return finalName.toUpperCase();
  },

  /** Makes a json request to the cloud functions, returns an object with promise and cancel option */
  request: async (url, data = {}) => {
    const token = await auth().currentUser.getIdToken();
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        lang: 'en',
      },
      body: JSON.stringify(data),
    });
    let json = await response.json();
    if (response.status === 200) {
      return json;
    } else {
      throw new Error(json.message);
    }
  },

  get: async (url) => {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    let json = await response.json();
    if (response.status === 200) {
      return json;
    } else {
      throw new Error(json.message);
    }
  },

  elapsedReadable: (seconds) => {
    return moment.unix(seconds).fromNow();
  },

  /** returns the elapsed seconds from the timestamp in seconds */
  elapsedSeconds: (seconds) => {
    let now = moment();
    let past = moment.unix(seconds);
    var duration = moment.duration(now.diff(past));
    var hours = duration.asSeconds();
    return hours;
  },

  elapsedDays: (seconds) => {
    let now = moment();
    let past = moment.unix(seconds);
    var duration = moment.duration(now.diff(past, 'days'));
    let days = duration.asDays();
    return parseInt(days, 10);
  },

  secondsToHM: (seconds) => {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var hDisplay = h > 0 ? h + 'h' : '';
    var mDisplay = m > 0 ? m + 'm' : '';
    var sDisplay = '';
    if (m === 0 && h === 0) {
      sDisplay = seconds > 0 ? seconds.toFixed(0) + 's' : '';
    }
    return `${hDisplay} ${mDisplay} ${sDisplay}`;
  },

  secondsToHOURM: (seconds) => {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var hDisplay = h > 0 ? (h > 1 ? h + ' hours' : h + ' hour') : '';
    var mDisplay = m > 0 ? m + ' mins' : '';
    return `${hDisplay} ${mDisplay}`;
  },

  getDateYYYYMMDD: () => {
    return moment().format('YYYY-MM-DD');
  },

  getDateYYYYMMDDTime: () => {
    return moment().format('YYYY-MM-DD, h:mma');
  },

  getMoment: () => {
    return moment();
  },

  getDaysBetweenDates: (startDate, endDate) => {
    let now = startDate.clone();
    let dates = [];
    while (now.isSameOrBefore(endDate)) {
      let obj = {
        date: now.format('YYYY-MM-DD'),
        day: now.format('ddd'),
        trophy: 0,
      };
      dates.push(obj);
      now.add(1, 'days');
    }
    return dates;
  },

  randDarkColor: () => {
    var lum = -0.25;
    var hex = String(
      '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
    ).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }
    return rgb;
  },

  getObjectKeysAsArray: (obj) => {
    return Object.keys(obj);
  },

  shuffle: (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

  clean: (text) => {
    text = text.replace(/[\W_]+/g, '').toLowerCase();
    return text;
  },

  /**
   * Returns the percentage mached
   * @param {*} selectedAnswer
   * @param {*} correctAnswer
   * @param {*} type
   * @returns
   */
  matchAnswer: (selectedAnswer, correctAnswer, type) => {
    let selectedClean = Utils.clean(selectedAnswer);
    let correctClean = Utils.clean(correctAnswer);
    if (selectedClean === correctClean) {
      return 100;
    } else if (type === QUESTION_TYPES.listen_and_write) {
      let allowedFreedom = Math.ceil(correctClean * 0.15);
      let errorDis = distance(selectedClean, correctClean);
      if (errorDis <= allowedFreedom) {
        return 100;
      } else {
        return 0;
      }
    } else if (type === QUESTION_TYPES.listen_and_record) {
      let errorDis = distance(selectedClean, correctClean);
      let correctDis = correctClean.length - errorDis;
      if (correctDis < 0) {
        return 0;
      } else {
        //calculate correct
        let percent = Math.round((correctDis / correctClean.length) * 100.0);
        return percent;
      }
    } else {
      return 0;
    }
  },

  padStart: (str, char = '0') => {
    str = String(str);
    return str.padStart(3, char);
  },

  /**
   * Return in the format of current target language
   * @param {*} lessonPath
   * @returns
   */
  getLUGLfromLessonPath: (lessonPath) => {
    lessonPath = lessonPath.replace(/^\/|\/$/g, '');
    let pathArray = lessonPath.split('/');
    return {
      language: {id: pathArray[1]},
      level: {id: pathArray[3]},
      unit: {id: pathArray[5]},
      gate: {id: pathArray[7]},
      lesson: {id: pathArray[9]},
    };
  },
};

export default Utils;
