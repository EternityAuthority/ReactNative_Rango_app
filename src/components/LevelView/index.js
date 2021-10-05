import React, {Component} from 'react';
import {Spinner, View} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Text from '../Text';
import DFastImage from 'react-native-fast-image';
import FastImage from '../Image';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import {t} from '../../locale';
import Progress from '../Progress';
import {QUIZ_MODE} from '../../lib/Constants';

class LevelView extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      visited: true,
      loading: true,
      level: null,
      unit: null,
      nextunit: null,
      splash: null,
      progress: 0,
    };
  }

  componentDidUpdate(prevProps) {
    let {curTargetLanguage} = this.props;
    if (
      curTargetLanguage.level &&
      curTargetLanguage.unit &&
      curTargetLanguage.gate &&
      (curTargetLanguage.level.id !== prevProps.curTargetLanguage.level.id ||
        curTargetLanguage.unit.id !== prevProps.curTargetLanguage.unit.id ||
        curTargetLanguage.gate.id !== prevProps.curTargetLanguage.gate.id)
    ) {
      this.unsubscribeVisitedGate();
      this.subscribeToVisitedGate(curTargetLanguage);
      this.fetchData(curTargetLanguage);
    }
    if (
      curTargetLanguage.unit_lesson_completed !==
      prevProps.curTargetLanguage.unit_lesson_completed
    ) {
      let {unit} = this.state;
      let progress = this.getProgress(curTargetLanguage, unit);
      this.updateState({progress});
    }
  }

  componentDidMount() {
    let {curTargetLanguage} = this.props;
    if (curTargetLanguage) {
      this.subscribeToVisitedGate(curTargetLanguage);
      this.fetchData(curTargetLanguage);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribeVisitedGate();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  fetchData = async (curTargetLanguage) => {
    let {
      level,
      unit,
      gate,
      lesson,
      progress,
    } = await this.fetchAllLevelUnitData(curTargetLanguage);
    let nextunit = await this.fetchNextUnitData(curTargetLanguage, unit);
    let splash = null;
    if (gate.splash) {
      splash = {
        url: gate.splash,
        title: gate.splashtitle,
        description: gate.splashdes,
        gatekey: gate.key,
      };
      DFastImage.preload([{uri: gate.splash}]);
    }
    this.updateState({
      level,
      unit,
      nextunit,
      progress,
      lesson,
      splash: splash,
      loading: false,
    });
  };

  unsubscribeVisitedGate = () => {
    if (this.unsubscribe && typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  };

  subscribeToVisitedGate = (curTargetLanguage) => {
    let {user} = this.props;
    if (curTargetLanguage.gate) {
      this.unsubscribe = firestore()
        .doc(`users/${user.uid}`)
        .collection('visitedgates')
        .doc(curTargetLanguage.gate.id)
        .onSnapshot((visitedGate) => {
          if (!visitedGate || !visitedGate.exists) {
            this.updateState({visited: false});
          } else {
            this.updateState({visited: true});
          }
        });
    }
  };

  fetchAllLevelUnitData = async (curTargetLanguage) => {
    let promises = [
      curTargetLanguage.level.get(),
      curTargetLanguage.unit.get(),
      curTargetLanguage.gate.get(),
      curTargetLanguage.lesson.get(),
    ];
    let proRes = await Promise.all(promises);
    let level = proRes[0].data();
    let unit = proRes[1].data();
    let gate = proRes[2].data();
    let lesson = proRes[3].data();
    lesson.path = curTargetLanguage.lesson.path;
    let progress = this.getProgress(curTargetLanguage, unit);
    return {level, unit, gate, lesson, progress};
  };

  fetchNextUnitData = async (curTargetLanguage, unit) => {
    let nextunit = null;
    let nextUnitSnap = await curTargetLanguage.unit.parent
      .where('no', '>', unit.no)
      .orderBy('no')
      .limit(1)
      .get();
    if (nextUnitSnap && !nextUnitSnap.empty) {
      nextunit = nextUnitSnap.docs[0].data();
    }
    return nextunit;
  };

  getProgress = (curTargetLanguage, unit) => {
    if (!unit) {
      return 0;
    }
    let progress =
      ((curTargetLanguage.unit_lesson_completed * 1.0) /
        (unit.lessoncount || 1)) *
      100;
    if (progress > 100) {
      progress = 100.0;
    }
    return progress;
  };

  openWordsbank = (next) => {
    next();
    let {navigation} = this.props;
    navigation.navigate('Wordsbank');
  };

  onStart = (next) => {
    let {navigation, curTargetLanguage} = this.props;
    let {splash, visited, lesson} = this.state;
    if (lesson.type === 'stories') {
      navigation.navigate('Stories', {lesson});
    } else {
      if (splash && !visited) {
        navigation.navigate('GatesSplash', {splash});
      } else {
        navigation.navigate('Quiz', {
          lessonPath: curTargetLanguage.lesson.path,
          mode: QUIZ_MODE.TEST,
        });
      }
    }
    next();
  };

  render() {
    if (this.state.loading) {
      return <Spinner color={s.textPrimary.color} />;
    }
    let {level, unit, nextunit, progress} = this.state;
    return (
      <>
        {level && (
          <FastImage
            source={{uri: level.imageURL}}
            style={[s.img200]}
            resizeMode="contain"
          />
        )}
        <View style={[s.mt30, s.ms15p, s.me15p, s.flex, s.flexRow, s.ac]}>
          <View style={[s.flex0, s.ac]}>
            <View style={[s.hw30, s.br15, {backgroundColor: unit.bgcolor}]}>
              <FastImage
                source={{uri: unit.imageURL}}
                style={[s.abs, s.as, s.hw36, s.br18, s.ofh, s.bottom0]}
                resizeMode="contain"
              />
            </View>
            <Text fontWeight="700" style={[s.mt5, s.textPurpleDark, s.f12]}>
              {`${t('unit')} ${unit.no}`}
            </Text>
          </View>
          <View style={[s.flex1, s.ps10, s.pe10]}>
            <Progress value={progress} />
          </View>
          {nextunit && (
            <View style={[s.flex0, s.ac]}>
              <View
                style={[s.hw30, s.br15, {backgroundColor: nextunit.bgcolor}]}>
                <FastImage
                  source={{uri: nextunit.imageURL}}
                  style={[s.abs, s.as, s.hw36, s.br18, s.ofh, s.bottom0]}
                  resizeMode="contain"
                />
              </View>
              <Text fontWeight="700" style={[s.mt5, s.textPurpleDark, s.f12]}>
                {`${t('unit')} ${nextunit.no}`}
              </Text>
            </View>
          )}
        </View>
        <View style={[s.mt20, s.ms10p, s.me10p, s.flexRow]}>
          <View style={[s.flex1]}>
            <Button stretch={true} progress={true} onPress={this.onStart}>
              <ButtonText fontWeight="700">{t('start')}</ButtonText>
            </Button>
          </View>
          <View style={[s.flex0, s.hw15]} />
          <View style={[s.flex1]}>
            <Button
              type="warning"
              stretch={true}
              progress={true}
              onPress={this.openWordsbank}>
              <ButtonText fontWeight="700">{t('words_bank')}</ButtonText>
            </Button>
          </View>
        </View>
      </>
    );
  }
}

LevelView.propTypes = {
  curTargetLanguage: PropTypes.any.isRequired,
  navigation: PropTypes.any,
  user: PropTypes.any,
};

export default LevelView;
