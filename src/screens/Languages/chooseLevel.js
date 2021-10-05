import React from 'react';
import {View} from 'native-base';
import {FlatList, SafeAreaView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container';
import Header from '../../components/Header/secondary';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {getLangCode, t} from '../../locale';
import CurTargetLanguageService from '../../lib/CurTargetLanguageService';
import ChooseLevelItem from '../../components/ListItem/chooselevelItem';

const ENGLISH_KEY = 'wMBgRkoAjlnq1mmI1mYP';

class ChooseLevel extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {user} = props.context;
    this.state = {
      levels: [],
      englishlevel: {},
      loading: true,
    };
    this.engLevelRef = firestore().collection('choose-levels/levels/list');
    this.userRef = firestore().collection('users').doc(user.uid);
    this.userTargetLang = this.userRef
      .collection('targetlanguage')
      .doc(ENGLISH_KEY);
  }

  componentDidMount() {
    this.engLevelRef
      .orderBy('no')
      .get()
      .then((snap) => {
        if (!snap.empty) {
          let levels = [];
          snap.forEach((data, i) => {
            let d = data.data();
            d.path = data.ref.path;
            levels.push(d);
          });
          this.updateState({levels, englishlevel: levels[0], loading: false});
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  /**
   * Saves the user preferred english level in the firestore
   */
  saveLevel = async (next) => {
    let {englishlevel} = this.state;
    if (englishlevel && englishlevel.key) {
      try {
        //Set the first level, unit, gate and lesson
        let {levelno, unitno} = englishlevel;
        let {level, unit, gate, lesson, lug_no} =
          await CurTargetLanguageService.firstInit(
            ENGLISH_KEY,
            levelno,
            unitno,
          );
        await this.userTargetLang.set(
          {level, gate, lesson, unit, lug_no, unit_lesson_completed: 0},
          {merge: true},
        );
        await this.userRef.update({
          englishlevel: englishlevel.path,
        });
        next();
        let {navigation} = this.props;
        navigation.navigate('LearningGoals');
      } catch (error) {
        console.error(error);
        next();
      }
    } else {
      next();
    }
  };

  selectLevel = (item) => {
    this.updateState({englishlevel: item});
  };

  renderItem = ({item}) => {
    let {englishlevel} = this.state;
    let {name, descriptions, key, imageURL} = item;
    let selected = key === englishlevel.key;
    let locale = getLangCode();
    let title = name[locale];
    let description = descriptions[locale];
    return (
      <ChooseLevelItem
        title={title}
        imageURL={imageURL}
        description={description}
        selected={selected}
        onPress={this.selectLevel.bind(this, item)}
      />
    );
  };

  itemSeparatorComponent = () => {
    return <View style={s.mt15} />;
  };

  render() {
    let {levels, loading} = this.state;
    return (
      <Container style={[s.bgWhite]}>
        <Header menu={false} hasTabs={false} />
        <SafeAreaView style={[s.flexGrow]}>
          <View style={[s.flex0, s.p5p, s.pt0]}>
            <Text fontWeight="700" style={[s.textGrayDark, s.f22]}>
              {t('choose_your_goal')}
            </Text>
            <Text style={[s.textGray, s.mt5]}>{t('you_can_change')}</Text>
          </View>
          <FlatList
            data={levels}
            refreshing={loading}
            onRefresh={() => {}}
            keyExtractor={(item, i) => `listl${i}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.itemSeparatorComponent}
            contentContainerStyle={[s.flexGrow, s.p20]}
          />
          <View style={[s.flex0, s.p5p]}>
            <Button
              disabled={loading}
              stretch={true}
              progress={true}
              onPress={this.saveLevel}>
              <ButtonText>{t('continue')}</ButtonText>
            </Button>
          </View>
        </SafeAreaView>
      </Container>
    );
  }
}

export default withContext(ChooseLevel);
