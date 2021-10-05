import React from 'react';
import {withContext} from '../../lib/AppContext';
import {SectionList, Image} from 'react-native';
import {Spinner, View} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import Iconmoon from '../../components/Icon/moon';
import Button from '../../components/Button';
import Text from '../../components/Text';
import UnitState from './unitState';
import LevelService from '../../lib/LevelService';
import s from '../../assets/styles';
import {t} from '../../locale';
import TintedImage from '../../components/TintedImage';
import Utils from '../../lib/Utils';

class Learn extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      completed: {},
      currentLevel: {},
      data: [],
      loading: true,
    };
  }

  /** Loop and fetch all levels and units and there gates */
  async componentDidMount() {
    this.subscribeCompleted();
    let {curTargetLanguage} = this.props.context;
    let levelService = new LevelService(curTargetLanguage.key);
    let levels = await levelService.getForSectionList();
    let currentLevel = this.getcLevelFromLevels(levels, curTargetLanguage);
    this.updateState({data: levels, currentLevel, loading: false});
  }

  /**
   * We have to listen to update in the level or the language.
   * If the language changes then we have to fetch the levels and units data again
   * @param {*} prevProps
   */
  async componentDidUpdate(prevProps) {
    let {curTargetLanguage} = this.props.context;
    let prevContext = prevProps.context;
    if (curTargetLanguage.key !== prevContext.curTargetLanguage.key) {
      //This means language has been change, we have to redownload the levels
      this.unsubscribeCompleted();
      this.subscribeCompleted();
      this.updateState({data: [], currentLevel: {}, loading: true});
      let levelService = new LevelService(curTargetLanguage.key);
      let levels = await levelService.getForSectionList();
      let currentLevel = this.getcLevelFromLevels(levels, curTargetLanguage);
      this.updateState({data: levels, currentLevel, loading: false});
    } else {
      //Language is same, may be level changed
      if (
        curTargetLanguage.level.id !== prevContext.curTargetLanguage.level.id
      ) {
        let {levels} = this.state;
        let currentLevel = this.getcLevelFromLevels(levels, curTargetLanguage);
        this.updateState({currentLevel});
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribeCompleted();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  toggleModal = () => {
    let {isModalVisible} = this.state;
    this.updateState({isModalVisible: !isModalVisible});
  };

  /**
   * Fetches the current level by looping the other levels and matching the id
   * @param {*} levels
   * @param {*} curTargetLanguage
   * @returns
   */
  getcLevelFromLevels = (levels, curTargetLanguage) => {
    let currentLevel = {};
    levels.forEach((levelData) => {
      let level = levelData.title; //because it is in section list format
      if (level.key === curTargetLanguage.level.id) {
        currentLevel = level;
      }
    });
    return currentLevel;
  };

  unsubscribeCompleted = () => {
    if (this.unsubscribe && typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  };

  subscribeCompleted = () => {
    let {curTargetLanguage} = this.props.context;
    let compPath = firestore().doc(`${curTargetLanguage.path}/completed/data`);
    this.unsubscribe = compPath.onSnapshot((compSnap) => {
      if (compSnap && compSnap.exists) {
        let completed = compSnap.data();
        this.updateState({completed});
      }
    });
  };

  renderLevel = ({section}) => {
    let level = section.title;
    let {currentLevel} = this.state;
    let {language} = this.props.context;
    let {defaultText, no, rewardtrophy} = level;
    let levelName = defaultText;
    let showCertificate = currentLevel.no > no;
    let activeAndBelow = no <= currentLevel.no;
    let titleStyle = [s[`${language.font}700`], s.textPrimaryDarker];
    return (
      <View style={[s.jcac]}>
        <TintedImage
          imageURL={level.imageURL}
          style={[s.img200]}
          tintColor={activeAndBelow ? null : s.bgBlack5.backgroundColor}
        />
        <Text style={[s.textCenter, s.f18, s.ucase, titleStyle]}>
          {levelName}
        </Text>
        <View
          style={[
            s.bgSilverLight,
            s.p5,
            s.br10,
            s.mt10,
            s.mb20,
            s.flexRow,
            s.ac,
          ]}>
          <View style={[s.ps5]} />
          <Text fontWeight="700" style={[s.ucase, s.textGray]}>
            {t('trophies')}
          </Text>
          <View style={[s.ps5]} />
          <Image
            source={require('../../assets/images/trophy.png')}
            style={[s.hw20]}
            resizeMode="contain"
          />
          <View style={[s.ps5]} />
          <Text fontWeight="700" style={[s.ucase, s.textGray]}>
            {rewardtrophy}
          </Text>
          <View style={[s.ps5]} />
        </View>
        {showCertificate && (
          <View style={[s.abs, {right: 0, top: 20}]}>
            <Button
              badge={true}
              height={s.h34.height}
              borderRadius={s.br10.borderRadius}>
              <Iconmoon
                name="medal"
                style={[s.textWhite, s.ps10, s.pe10, s.f16]}
              />
            </Button>
          </View>
        )}
      </View>
    );
  };

  renderUnit = ({item, section}) => {
    if (item.length === 0) {
      return null;
    }
    let level = section.title;
    let {navigation, context} = this.props;
    let {curTargetLanguage} = context;
    let {completed} = this.state;
    return item.map((unit, i) => {
      let unitAnswerObject = {};
      if (completed[level.key] && completed[level.key][unit.key]) {
        unitAnswerObject = completed[level.key][unit.key];
      }
      // eslint-disable-next-line prettier/prettier
      let localLug = `${Utils.padStart(level.no)}-${Utils.padStart(unit.no)}-000`;
      let active =
        curTargetLanguage.unit.id === unit.key ||
        localLug < curTargetLanguage.lug_no;
      return (
        <View key={unit.key} style={[s.mt15, s.mb15]}>
          <UnitState
            level={level}
            unit={unit}
            active={active}
            onRepeat={this.onRepeat}
            lug_no={curTargetLanguage.lug_no}
            unitAnswerObject={unitAnswerObject}
            navigation={navigation}
          />
        </View>
      );
    });
  };

  renderSeperator = () => {
    return <View style={[s.mt30]} />;
  };

  renderEmpty = () => {
    return (
      <View style={[s.flex1, s.jcac]}>
        <Spinner />
      </View>
    );
  };

  render() {
    let {data} = this.state;
    return (
      <Container header="primary" avoidScrollView={true}>
        <SectionList
          inverted={true}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={[s.flexGrow, s.ps15, s.pe15, s.pt15]}
          sections={data}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          keyExtractor={(item) => item.key}
          renderItem={this.renderUnit}
          renderSectionFooter={this.renderLevel}
          ItemSeparatorComponent={this.renderSeperator}
          ListEmptyComponent={this.renderEmpty}
        />
      </Container>
    );
  }
}

export default withContext(Learn);
