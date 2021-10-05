import React from 'react';
import {View} from 'native-base';
import {TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t, getLangCode} from '../../locale';
import Text from '../../components/Text';
import ToLearn from './tolearn';
import IKnow from './iknow';
import Utils from '../../lib/Utils';
import RNFS from 'react-native-fs';
import {DOWNLOAD_PATH} from '../../lib/QuestionService';

class WordsBank extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      language: {},
      loading: true,
      total: 0,
      today: 0,
      month: 0,
      page: 0,
    };
  }

  async componentDidMount() {
    await RNFS.mkdir(DOWNLOAD_PATH);
    let curDate = Utils.getDateYYYYMMDD();
    let {curTargetLanguage} = this.props.context;
    this.unsubscribe = firestore()
      .doc(`${curTargetLanguage.path}/wordbank/total`)
      .onSnapshot((snap) => {
        if (snap && snap.exists) {
          let userTotal = snap.data();
          this.updateState({
            total: userTotal.count || 0,
            month: userTotal.month || 0,
            today: userTotal.days[curDate] || 0,
            loading: false,
          });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe && typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  changePage = (page) => {
    this.updateState({page: page});
  };

  upgradeToPro = () => {
    let {navigation} = this.props;
    navigation.navigate('UpgradeToPro');
  };

  getCountView = (count, text) => {
    return (
      <View
        style={[s.mHor10, s.p15, s.w100, s.jcac, s.bgPrimaryDarker, s.br15]}>
        <Text style={[s.textCenter, s.textYellow, s.f30, s.montserrat700]}>
          {count}
        </Text>
        <Text style={[s.textCenter, s.textWhite, s.f12, s.mt5]}>{text}</Text>
      </View>
    );
  };

  renderHeaderComponent = () => {
    let {total, month, today} = this.state;
    return (
      <View style={[s.pt20, s.pb20, s.bgPrimaryDark]}>
        <View style={[s.flexRow, s.jcac]}>
          {this.getCountView(today, t('this_day'))}
          {this.getCountView(month, t('this_month'))}
          {this.getCountView(total, t('total'))}
        </View>
      </View>
    );
  };

  render() {
    let {curTargetLanguage, user, language} = this.props.context;
    let {loading, page} = this.state;
    return (
      <Container header="blue" title={t('words_bank')} avoidScrollView={true}>
        <View style={s.flex1}>
          <View style={[s.flex0]}>{this.renderHeaderComponent()}</View>
          <View style={[s.flex0]}>
            <View style={[s.bgPrimaryDark, s.abs, s.h20, s.w100p]} />
            <View style={[s.flexRow, s.jcac]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changePage.bind(this, 0)}
                style={[s.w150, s.br5, s.bgLight]}>
                <View
                  style={[
                    s.p10,
                    s.jcac,
                    s.br5,
                    s.mb2,
                    page === 0 ? s.bgPrimaryDark : s.bgWhite,
                  ]}>
                  <Text
                    fontWeight="700"
                    style={[page === 0 ? s.textWhite : s.textPrimaryDark]}>
                    {t('to_learn')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={[s.mHor10]} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changePage.bind(this, 1)}
                style={[s.w150, s.br5, s.bgLight]}>
                <View
                  style={[
                    s.p10,
                    s.jcac,
                    s.br5,
                    s.mb2,
                    page === 1 ? s.bgSuccessLight : s.bgWhite,
                  ]}>
                  <Text fontWeight="700" style={[s.textSuccessDarker]}>
                    {t('i_know')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[s.flex1]}>
            {!loading && page === 0 && (
              <ToLearn
                user={user}
                curTargetLanguage={curTargetLanguage}
                language={language}
                langCode={getLangCode()}
                upgradeToPro={this.upgradeToPro}
              />
            )}
            {!loading && page === 1 && (
              <IKnow
                user={user}
                curTargetLanguage={curTargetLanguage}
                language={language}
                langCode={getLangCode()}
                upgradeToPro={this.upgradeToPro}
              />
            )}
          </View>
        </View>
      </Container>
    );
  }
}

export default withContext(WordsBank);
