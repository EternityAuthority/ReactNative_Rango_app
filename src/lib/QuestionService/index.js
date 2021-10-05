import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
export const DOWNLOAD_PATH = `${RNFS.DocumentDirectoryPath}/downloads`;

/**
 * Question service that fetches its data (i.e) all questions for lesson from the local db or online firebase.
 * Accepts lesson path in the constructor
 */
export default class QuestionService {
  constructor(lessonPath, language) {
    this.lessonPath = lessonPath;
    this.language = language;
  }

  get = async (raw = false) => {
    let results = [];
    await RNFS.mkdir(DOWNLOAD_PATH);
    let snap = await firestore()
      .doc(this.lessonPath)
      .collection('questions')
      .where('published', '==', true)
      .orderBy('ordering')
      .get();
    if (snap && !snap.empty) {
      snap.docs.forEach((doc) => {
        let question = doc.data();
        question.path = doc.ref.path;
        question.repeat_count = 0;
        results.push(question);
      });
    }
    /**
     * If users asks for raw result then give them as it is
     */
    if (raw) {
      return results;
    }
    //let time = new Date().getMilliseconds();
    let promises = [];
    results.forEach((question) => {
      promises.push(this.downloadFilesOfQuestions(question));
    });
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    //let maxTime = new Date().getMilliseconds();
    //console.log(maxTime - time);
    //console.log(results);
    return results;
    //return results.reverse();
  };

  downloadFilesOfQuestions = async (question) => {
    let promises = [];
    let code = this.language.code;
    let {options = [], audioURL = {}, key, voice} = question;
    if (voice && audioURL[code]) {
      let from = audioURL[code];
      let to = `${DOWNLOAD_PATH}/${key}.mp3`;
      audioURL[code] = `file://${to}`;
      promises.push(this.checkAndDownload(from, to));
    }
    options.forEach((option, i) => {
      if (option.voice && option.audioURL && option.audioURL[code]) {
        let from = option.audioURL[code];
        let to = `${DOWNLOAD_PATH}/audio${key}_${i}.mp3`;
        option.audioURL[code] = `file://${to}`;
        promises.push(this.checkAndDownload(from, to));
      }
      if (option.imageURL) {
        let from = option.imageURL;
        let to = `${DOWNLOAD_PATH}/image${key}_${i}.jpg`;
        option.imageURL = `file://${to}`;
        promises.push(this.checkAndDownload(from, to));
      }
    });
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    return;
  };

  checkAndDownload = async (from, to) => {
    let exists = await RNFS.exists(to);
    if (exists) {
      return Promise.resolve();
    } else {
      return this.download(from, to);
    }
  };

  /**
   * Uses RNFS to download a file from source to destination, it is useful to prefetch the file
   * return promise
   */
  download = (from, to) => {
    return RNFS.downloadFile({
      fromUrl: from,
      toFile: to,
      cacheable: true,
      connectionTimeout: 20000,
      readTimeout: 20000,
    }).promise;
  };

  remove = (location) => {
    return RNFS.unlink(location);
  };
}
