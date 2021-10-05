import React from 'react';
import {withContext} from '../../lib/AppContext';
import {View} from 'native-base';
import {FlatList, Dimensions, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import s from '../../assets/styles';
import CurTargetLanguageService from '../../lib/CurTargetLanguageService';
import LessonComplete from '../../components/RewardsView/lessoncomplete';
import GateComplete from '../../components/RewardsView/gatecomplete';
import UnitComplete from '../../components/RewardsView/unitcomplete';
import LevelComplete from '../../components/RewardsView/levelcomplete';
import Utils from '../../lib/Utils';
import {QUIZ_MODE, UNIT_PASS_NO} from '../../lib/Constants';
import UnitSuccess from '../../components/RewardsView/unitsuccess';

const events = {
  LESSON_COMPLETE: 'lessoncomplete',
  GATE_COMPLETE: 'gatecomplete',
  UNIT_COMPLETE: 'unitcomplete',
  UNIT_SUCCESS: 'unitsuccess',
  LEVEL_COMPLETE: 'levelcomplete',
};

class QuizFinish extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {params = {}} = props.route;
    let {rewardsconfig, useranswers, lesson, unit, mode} = params;
    let winnings = [];
    if (lesson.type === 'unit_test') {
      winnings.push(events.UNIT_COMPLETE);
    } else {
      winnings.push(events.LESSON_COMPLETE);
    }
    this.state = {
      rewardsconfig,
      useranswers,
      lesson,
      unit,
      mode: mode,
      itemWidth: Dimensions.get('window').width,
      winnings: winnings,
      cangoback: false,
      page: 0,
    };
    let {curTargetLanguage} = props.context;
    this.currentAnsPath = `${curTargetLanguage.path}/useranswers/${lesson.key}`;
    this.currentCompPath = `${curTargetLanguage.path}/completed/data`;
    this.curTargetLangService = new CurTargetLanguageService(curTargetLanguage);
  }

  async componentDidMount() {
    let {winnings, lesson, useranswers, mode} = this.state;
    let {correctcount} = useranswers;
    let {curTargetLanguage} = this.props.context;
    if (mode === QUIZ_MODE.REPEAT) {
      /**
       * In Repeat mode we have to delete the previous answers and then save the new answers,
       * Do not change the level unit and gates or lesson, so we do not nedd nextDatas.
       * beware repeat can be for any lesson, it will not be currentTarget language
       */
      let prevAnswer = await firestore().doc(this.currentAnsPath).get();
      if (prevAnswer.exists) {
        await firestore().doc(this.currentAnsPath).delete();
      }
      let curTargetLocal = Utils.getLUGLfromLessonPath(lesson.path);
      await this.saveUserAnswers(curTargetLocal, useranswers);
      this.updateState({cangoback: true});
    } else {
      /**
       * In test mode save the answers and then changed the level unit and gates or lessons.
       * if the test type is of unit test then we have to check whether user passed unit or not.
       * once he passes the unit then only he can go to next level.
       */
      this.saveUserAnswers(curTargetLanguage, useranswers);
      if (lesson.type === 'unit_test') {
        if (correctcount < UNIT_PASS_NO) {
          this.cangoback = true;
          return;
        } else {
          winnings.push(events.UNIT_SUCCESS);
        }
      }
      let nextDatas = await this.curTargetLangService.getNext();
      winnings = this.getEvents(winnings, lesson, nextDatas, curTargetLanguage);
      this.updateState({winnings});
      const lug = await this.getLugData(nextDatas);
      await this.finish(curTargetLanguage, nextDatas, lug);
      this.updateState({cangoback: true});
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  updateMultiplier = (multiplier) => {
    let {useranswers} = this.state;
    useranswers.multiplier = multiplier;
    this.updateState({useranswers}, () => {
      firestore().doc(this.currentAnsPath).set({multiplier: 2}, {merge: true});
    });
  };

  saveUserAnswers = async (curTargetLanguage, useranswers) => {
    let completed = {
      [curTargetLanguage.level.id]: {
        [curTargetLanguage.unit.id]: {
          [curTargetLanguage.gate.id]: {
            [curTargetLanguage.lesson.id]: true,
          },
        },
      },
    };
    let batch = firestore().batch();
    batch.set(firestore().doc(this.currentAnsPath), useranswers, {merge: true});
    batch.set(firestore().doc(this.currentCompPath), completed, {merge: true});
    await batch.commit();
    return true;
  };

  /**
   * Based on the next data calculate and show it to user the events.
   * Gate completed can only happen on normal quiz, where as level will only change after unit test.
   * @param {*} nextData
   */
  getEvents = (winnings, lesson, nextDatas, curTargetLanguage) => {
    if (
      !lesson.type ||
      (lesson.type !== 'unit_test' && lesson.type !== 'stories')
    ) {
      if (nextDatas.gate.id !== curTargetLanguage.gate.id) {
        winnings.push(events.GATE_COMPLETE);
      }
    } else {
      if (nextDatas.level.id !== curTargetLanguage.level.id) {
        winnings.push(events.LEVEL_COMPLETE);
      }
    }
    return winnings;
  };

  /**
   * Returns the next lug data from the next datas
   */
  getLugData = async (nextDatas) => {
    let {level, unit, gate} = nextDatas;
    let lugPromises = [level.get(), unit.get(), gate.get()];
    let lugRes = await Promise.all(lugPromises);
    let lug = {
      nextLevelData: lugRes[0].data(),
      nextUnitData: lugRes[1].data(),
      nextGateData: lugRes[2].data(),
    };
    // eslint-disable-next-line prettier/prettier
    lug.no = `${Utils.padStart(lug.nextLevelData.no)}-${Utils.padStart(lug.nextUnitData.no)}-${Utils.padStart(lug.nextGateData.no)}`;
    return lug;
  };

  /** Updates the lug information and advances the user to next gate lesson unit of level.
   * Based on the hanys feedback stories and unit test will also be taken into percentage calculation account
   */
  finish = async (curTargetLanguage, nextDatas, lug) => {
    let {level, unit, gate, lesson} = nextDatas;
    let unitChanged = nextDatas.unit.id !== curTargetLanguage.unit.id;
    // let unitCompletionIncrement =
    //   lesson.type !== 'unit_test' && lesson.type !== 'stories' ? 1 : 0;
    await firestore()
      .doc(curTargetLanguage.path)
      .update({
        unit_lesson_completed: unitChanged
          ? 0
          : firestore.FieldValue.increment(1),
        level: level,
        unit: unit,
        gate: gate,
        lesson: lesson,
        lug_no: lug.no,
      });
    return true;
  };

  onContinue = async () => {
    let {user} = this.props.context;
    let {page, winnings} = this.state;
    page++;
    if (page < winnings.length) {
      this.updateState({page});
      this.scrollRef.scrollToIndex({index: page});
    } else {
      //All rewards shown
      let {navigation} = this.props;
      if (user.isPro) {
        navigation.goBack();
      } else {
        //Redirect them to upgrade to pro
        navigation.replace('UpgradeToPro', {ads: true});
      }
    }
  };

  onRepeat = () => {
    let {lesson} = this.state;
    this.props.navigation.replace('Quiz', {
      lessonPath: lesson.path,
      mode: QUIZ_MODE.REPEAT,
    });
  };

  renderRewardView = (item, index) => {
    let {rewardsconfig, useranswers, unit, page, cangoback} = this.state;
    let activeScreen = page === index;
    let {user} = this.props.context;
    switch (item) {
      case events.LESSON_COMPLETE:
        return (
          <LessonComplete
            activeScreen={activeScreen}
            rewardsconfig={rewardsconfig}
            useranswers={useranswers}
            onContinue={this.onContinue}
            updateMultiplier={this.updateMultiplier}
            isPro={user.isPro}
            cangoback={cangoback}
          />
        );
      case events.GATE_COMPLETE:
        return (
          <GateComplete
            activeScreen={activeScreen}
            onContinue={this.onContinue}
            cangoback={cangoback}
          />
        );
      case events.UNIT_COMPLETE:
        return (
          <UnitComplete
            onRepeat={this.onRepeat}
            rewardsconfig={rewardsconfig}
            useranswers={useranswers}
            activeScreen={activeScreen}
            onContinue={this.onContinue}
            cangoback={cangoback}
          />
        );
      case events.UNIT_SUCCESS:
        return (
          <UnitSuccess
            unit={unit}
            activeScreen={activeScreen}
            onContinue={this.onContinue}
            cangoback={cangoback}
          />
        );
      case events.LEVEL_COMPLETE:
        let {nextLevel} = this.state;
        return (
          <LevelComplete
            level={nextLevel}
            activeScreen={activeScreen}
            onContinue={this.onContinue}
            cangoback={cangoback}
          />
        );
    }
  };

  renderItem = ({item, index}) => {
    let {itemWidth} = this.state;
    return (
      <View style={[s.flex1, {width: itemWidth}]}>
        <ScrollView contentContainerStyle={[s.flexGrow]}>
          {this.renderRewardView(item, index)}
        </ScrollView>
      </View>
    );
  };

  render() {
    let {winnings, itemWidth} = this.state;
    return (
      <Container header="primary" avoidScrollView={true}>
        <FlatList
          ref={(node) => (this.scrollRef = node)}
          initialNumToRender={1}
          updateCellsBatchingPeriod={100}
          maxToRenderPerBatch={1}
          data={winnings}
          renderItem={this.renderItem}
          horizontal={true}
          scrollEnabled={false}
          contentContainerStyle={[s.flexGrow]}
          keyExtractor={(item, i) => `eve_${i}`}
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemWidth}
          decelerationRate="fast"
        />
      </Container>
    );
  }
}

export default withContext(QuizFinish);
