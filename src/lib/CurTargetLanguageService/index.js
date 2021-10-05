import firestore from '@react-native-firebase/firestore';
import Utils from '../Utils';
export default class CurTargetLanguageService {
  constructor(curTargetLanguage) {
    this.curTargetLanguage = curTargetLanguage;
  }

  static firstInit = async (languageKey, levelno, unitno) => {
    let targetLevelRef = firestore()
      .doc(`languages/${languageKey}`)
      .collection('levels')
      .where('published', '==', true);

    if (levelno >= 0) {
      targetLevelRef = targetLevelRef.where('no', '==', levelno);
    } else {
      targetLevelRef.orderBy('no').limit(1);
    }
    let targetLevelSnap = await targetLevelRef.get();
    let level = null;
    let unit = null;
    let gate = null;
    let lesson = null;
    let lug_no = ''; //level unit gate no is lug_no
    if (!targetLevelSnap.empty) {
      level = targetLevelSnap.docs[0].ref;
      let levelData = targetLevelSnap.docs[0].data();
      lug_no += Utils.padStart(levelData.no);
      let unitQuery = level.collection('units').where('published', '==', true);
      if (unitno >= 0) {
        unitQuery = unitQuery.where('no', '==', unitno);
      } else {
        unitQuery.orderBy('no').limit(1);
      }
      let unitSnap = await unitQuery.get();
      if (!unitSnap.empty) {
        unit = unitSnap.docs[0].ref;
        let unitData = unitSnap.docs[0].data();
        lug_no += `-${Utils.padStart(unitData.no)}`;
        let gatesSnap = await unit
          .collection('gates')
          .where('published', '==', true)
          .orderBy('no')
          .limit(1)
          .get();
        if (!gatesSnap.empty) {
          gate = gatesSnap.docs[0].ref;
          let gateData = gatesSnap.docs[0].data();
          lug_no += `-${Utils.padStart(gateData.no)}`;
          let lessonSnap = await gate
            .collection('lessons')
            .where('published', '==', true)
            .orderBy('no')
            .limit(1)
            .get();
          if (!lessonSnap.empty) {
            lesson = lessonSnap.docs[0].ref;
          }
        }
      }
    }
    return {lesson, unit, gate, level, lug_no};
  };

  getNextData = async (dbref) => {
    if (dbref) {
      let data = (await dbref.get()).data();
      let next = await firestore()
        .collection(dbref.parent.path)
        .where('no', '>', data.no)
        .where('published', '==', true)
        .orderBy('no')
        .limit(1)
        .get();
      if (next && !next.empty) {
        return next.docs[0].ref;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  findFirstInCollection = async (ref, collection) => {
    let snap = await ref
      .collection(collection)
      .where('published', '==', true)
      .orderBy('no')
      .limit(1)
      .get();
    return snap.docs[0].ref;
  };

  getNext = async () => {
    let {lesson, unit, gate, level} = this.curTargetLanguage;
    let nextLesson = await this.getNextData(lesson);
    if (nextLesson) {
      return {lesson: nextLesson, gate, unit, level};
    } else {
      let nextGate = await this.getNextData(gate);
      if (nextGate) {
        nextLesson = await this.findFirstInCollection(nextGate, 'lessons');
        return {lesson: nextLesson, gate: nextGate, unit, level};
      } else {
        let nextUnit = await this.getNextData(unit);
        if (nextUnit) {
          nextGate = await this.findFirstInCollection(nextUnit, 'gates');
          nextLesson = await this.findFirstInCollection(nextGate, 'lessons');
          return {lesson: nextLesson, gate: nextGate, unit: nextUnit, level};
        } else {
          let nextLevel = await this.getNextData(level);
          if (nextLevel) {
            nextUnit = await this.findFirstInCollection(nextLevel, 'units');
            nextGate = await this.findFirstInCollection(nextUnit, 'gates');
            nextLesson = await this.findFirstInCollection(nextGate, 'lessons');
            return {
              lesson: nextLesson,
              gate: nextGate,
              unit: nextUnit,
              level: nextLevel,
            };
          } else {
            //This means user has completed evrything, return same
            return {lesson, unit, gate, level, completed: true};
          }
        }
      }
    }
  };
}
