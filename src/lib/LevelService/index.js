import firestore from '@react-native-firebase/firestore';

/**
 * Level service that fetches all levels fo a current language
 * Accepts language in the constructor
 */
export default class LevelService {
  constructor(languageKey) {
    this.languageKey = languageKey;
  }

  getForSectionList = async () => {
    let result = [];
    let data = {};
    let unitPromises = [];
    let langRef = firestore().doc(`languages/${this.languageKey}`);
    let levels = (await this.collectionData(langRef, 'levels')).data;
    levels.forEach((level) => {
      data[level.key] = {title: level, data: []};
      let unitRef = langRef.collection('levels').doc(level.key);
      unitPromises.push(this.collectionData(unitRef, 'units', level.key));
    });
    let unitsResp = await Promise.all(unitPromises);
    unitsResp.forEach((res) => {
      let levelKey = res.field;
      data[levelKey].data.push(res.data);
    });
    //Here we have our nested level of data ready, just we have to convert it to array
    levels.forEach((l) => {
      let d = data[l.key];
      result.push(d);
    });
    return result;
  };

  get = async () => {
    let result = [];
    let data = {};
    let unitPromises = [];
    let langRef = firestore().doc(`languages/${this.languageKey}`);
    let levels = (await this.collectionData(langRef, 'levels')).data;
    levels.forEach((level) => {
      data[level.key] = {level, units: []};
      let unitRef = langRef.collection('levels').doc(level.key);
      unitPromises.push(this.collectionData(unitRef, 'units', level.key));
    });
    let unitsResp = await Promise.all(unitPromises);
    unitsResp.forEach((res) => {
      let levelKey = res.field;
      data[levelKey].units.push(res.data);
    });
    //Here we have our nested level of data ready, just we have to convert it to array
    levels.forEach((l) => {
      let d = data[l.key];
      result.push(d);
    });
    return result;
  };

  collectionData = async (ref, collectionName, field) => {
    let data = [];
    let snaps = await ref
      .collection(collectionName)
      .where('published', '==', true)
      .orderBy('no')
      .get();
    if (snaps && !snaps.empty) {
      snaps.forEach((snap) => {
        let d = snap.data();
        d.path = snap.ref.path;
        data.push(d);
      });
    }
    let resp = {data};
    if (field) {
      resp.field = field;
    }
    return resp;
  };
}
