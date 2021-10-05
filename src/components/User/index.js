import React, {PureComponent} from 'react';
import {
  Image,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {Flag} from 'react-native-svg-flagkit';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import FastImage from '../Image';
import Avatar from '../Avatar';
import Text from '../Text';
import Icon from '../Icon';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import {t} from '../../locale';
import ProfilePicUploader from '../ProfilePicUploader';
import Chart from '../../components/Chart';
import Utils from '../../lib/Utils';
import Input from '../Input';

class User extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.width = Dimensions.get('window').width - 40; // 20 20 padding;
    this.state = {
      graphs: [],
      levels: [],
      wbStats: {},
      loading: true,
      uploading: false,
      isModalVisible: false,
      tempDisplayName: null,
      cc: props.cc,
    };
  }

  async componentDidMount() {
    let {uid, languagekey} = this.props;
    let userCurrentTargetLanguageSnap = await firestore()
      .doc(`users/${uid}`)
      .collection('targetlanguage')
      .doc(languagekey)
      .get();
    let curTargetlanguageData = userCurrentTargetLanguageSnap.data();
    let promise = [
      curTargetlanguageData.level.get(),
      this.fetchAllLevels(),
      this.fetchWeeklyScore(),
      this.fetchWordbankStats(),
    ];
    let proRes = await Promise.all(promise);
    let curLevel = proRes[0].data();
    let levels = proRes[1].filter((al) => al.no < curLevel.no);
    let graphs = proRes[2];
    let wbStats = proRes[3];
    this.updateState({levels, graphs, wbStats, loading: false});
  }

  componentWillUnmount() {
    this.mounted = false;
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

  openWordsbank = () => {
    let {navigation} = this.props;
    navigation.navigate('Wordsbank');
  };

  fetchWeeklyScore = async () => {
    let {languagekey, uid} = this.props;
    const dailyscoreboardref = firestore()
      .doc(`users/${uid}`)
      .collection('targetlanguage')
      .doc(languagekey)
      .collection('dailyscoreboard')
      .orderBy('createdAt', 'desc')
      .limit(7);
    let today = Utils.getMoment();
    let lastDate = Utils.getMoment().subtract(6, 'days');
    let last7Days = Utils.getDaysBetweenDates(lastDate, today);
    let dailySnap = await dailyscoreboardref.get();
    if (dailySnap && !dailySnap.empty) {
      dailySnap.docs.forEach((doc) => {
        let data = doc.data();
        let index = last7Days.findIndex((ld) => ld.date === data.createdAt);
        if (index >= 0) {
          let dataObj = last7Days[index];
          dataObj.trophy = data.trophy;
        }
      });
    }
    return last7Days;
  };

  fetchAllLevels = async () => {
    let {languagekey} = this.props;
    const leaguesRef = firestore()
      .doc(`languages/${languagekey}`)
      .collection('levels')
      .where('published', '==', true)
      .orderBy('no', 'asc');
    let leaguesSnap = await leaguesRef.get();
    let leagues = [];
    if (leaguesSnap && !leaguesSnap.empty) {
      leaguesSnap.docs.forEach((doc) => {
        let league = doc.data();
        league.path = doc.ref.path;
        leagues.push(league);
      });
    }
    return leagues;
  };

  fetchWordbankStats = async () => {
    let {languagekey, uid} = this.props;
    let curDate = Utils.getDateYYYYMMDD();
    let statSnap = await firestore()
      .doc(`users/${uid}`)
      .collection('targetlanguage')
      .doc(languagekey)
      .collection('wordbank')
      .doc('total')
      .get();
    if (statSnap && statSnap.exists) {
      let userTotal = statSnap.data();
      return {
        total: userTotal.count || 0,
        month: userTotal.month || 0,
        today: userTotal.days[curDate] || 0,
      };
    } else {
      return null;
    }
  };

  onSelect = async (image) => {
    let {uid} = this.props;
    this.updateState({uploading: true});
    const FILEPATH = `users/${uid}/dp`;
    await storage().ref().child(FILEPATH).putFile(image.path);
    let prefetchPromise = [
      storage().ref(FILEPATH).getDownloadURL(),
      firestore()
        .collectionGroup('leaderboard')
        .where('uid', '==', uid)
        .limit(30)
        .get(),
    ];
    let prefetchRes = await Promise.all(prefetchPromise);
    let downloadURL = prefetchRes[0];
    let leaderboardSnaps = prefetchRes[1];
    let promise = [
      auth().currentUser.updateProfile({photoURL: downloadURL}),
      firestore().doc(`users/${uid}`).update({photoURL: downloadURL}),
    ];
    if (leaderboardSnaps && !leaderboardSnaps.empty) {
      leaderboardSnaps.docs.forEach((ldsnap) => {
        promise.push(ldsnap.ref.update({photoURL: downloadURL}));
      });
    }
    await Promise.all(promise);
    this.updateState({uploading: false});
  };

  updateName = (value) => {
    this.updateState({tempDisplayName: value});
  };

  saveName = async (next) => {
    let {uid} = this.props;
    let {tempDisplayName} = this.state;
    if (tempDisplayName) {
      let leaderboardSnaps = await firestore()
        .collectionGroup('leaderboard')
        .where('uid', '==', uid)
        .limit(30)
        .get();
      let promise = [
        auth().currentUser.updateProfile({displayName: tempDisplayName}),
        firestore().doc(`users/${uid}`).update({displayName: tempDisplayName}),
      ];
      if (leaderboardSnaps && !leaderboardSnaps.empty) {
        leaderboardSnaps.docs.forEach((ldsnap) => {
          promise.push(ldsnap.ref.update({displayName: tempDisplayName}));
        });
      }
      await Promise.all(promise);
      next();
      this.toggleModal();
    }
  };

  invite = async () => {
    let {invitecode} = this.props;
    const link = `https://langoo.page.link?link=https://langoo.net/app/signup/${invitecode}&apn=net.langoo&ibi=net.langoo&ipbi=net.langoo&efr=1&isi=1542975922`;
    let options = {
      failOnCancel: false,
      message: `Hey, I'm using Langoo to learn English free. Check it out! \n${link}`,
    };
    Share.open(options).then((res) => {
      //console.log(res);
    });
  };

  getCountView = (count, text) => {
    return (
      <View style={[s.mHor10, s.w100, s.jcac, s.br15]}>
        <Text style={[s.textCenter, s.textPrimaryDark, s.f30, s.montserrat700]}>
          {count}
        </Text>
        <Text style={[s.textCenter, s.textGrayLight, s.f12, s.mt5]}>
          {text}
        </Text>
      </View>
    );
  };

  changeCountry = (country) => {
    let {uid} = this.props;
    let {cca2} = country;
    this.updateState({cc: cca2});
    firestore().doc(`users/${uid}`).update({cc: cca2});
  };

  renderWordbank = () => {
    let {wbStats} = this.state;
    let {today = 0, month = 0, total = 0} = wbStats;
    return (
      <View style={[s.pt10, s.pb20]}>
        <View style={[s.flexRow, s.jcac]}>
          {this.getCountView(today, t('this_day'))}
          {this.getCountView(month, t('this_month'))}
          {this.getCountView(total, t('total'))}
        </View>
      </View>
    );
  };

  renderChart = () => {
    let {graphs} = this.state;
    return <Chart data={graphs} />;
  };

  render() {
    let {photoURL, displayName, trophy = 0, uid, loggeduid} = this.props;
    let {levels, uploading, isModalVisible, cc} = this.state;
    displayName = displayName || 'User';
    cc = cc ? cc.toUpperCase() : '';
    return (
      <View style={[s.ms20, s.me20]}>
        <View style={[s.br15, s.bgLight, s.mt50]}>
          <View style={[s.bgWhite, s.br15, s.mb3, s.jcac]}>
            {uid === loggeduid && (
              <ProfilePicUploader
                photoURL={photoURL}
                displayName={displayName}
                uploading={uploading}
                onSelect={this.onSelect}
                style={[s.abs, s.hw100, s.br50, s.mt_50, {top: 0}]}
              />
            )}
            {uid !== loggeduid && (
              <Avatar
                displayName={displayName}
                source={photoURL}
                style={[
                  s.abs,
                  s.hw100,
                  s.br50,
                  s.mt_50,
                  s.b4,
                  s.bWhite,
                  {top: 0},
                ]}
              />
            )}
            <View style={[s.mt50]}>
              <View style={[s.flexRow, s.jcac, s.mt20]}>
                {loggeduid === uid && (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.toggleModal}>
                    <Icon
                      name="edit"
                      type="FontAwesome"
                      style={[s.f18, s.textGray, s.p5]}
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={[
                    s.textCenter,
                    s.ccase,
                    s.montserrat700,
                    s.textGray,
                    s.f18,
                    s.mHor10,
                  ]}>
                  {displayName}
                </Text>
                <View>
                  {uid === loggeduid && (
                    <CountryPicker
                      countryCode={cc}
                      withFilter={true}
                      onSelect={this.changeCountry}
                    />
                  )}
                  {uid !== loggeduid && (
                    <Flag id={cc} width={s.w25.width} height={s.h15.height} />
                  )}
                </View>
              </View>
              <View style={[s.flexRow, s.mt5, s.jcac]}>
                <Text style={[s.montserrat700, s.textWarn]}>{trophy}</Text>
                <View style={[s.ps5]} />
                <Image
                  source={require('../../assets/images/trophy.png')}
                  style={[s.hw20]}
                  resizeMode="contain"
                />
              </View>
              <View style={[s.flexRow, s.jcac, s.m5p, s.flexWrap]}>
                {levels.map((l) => {
                  return (
                    <View style={[s.m5]} key={l.key}>
                      <FastImage
                        source={{uri: l.imageURL}}
                        resizeMode="contain"
                        style={[s.hw60]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
        <View style={[s.br15, s.bgLight, s.mt20]}>
          <View style={[s.bgWhite, s.br15, s.mb3]}>
            <Text fontWeight="700" style={[s.textGray, s.p20]}>
              {t('points_this_week')}
            </Text>
            <View style={[s.w100p]}>{this.renderChart()}</View>
          </View>
        </View>
        <View style={[s.br15, s.bgLight, s.mt20]}>
          <ImageBackground
            resizeMode="cover"
            source={require('../../assets/images/proinvite.jpg')}
            style={[s.w100p, s.aspect_4_3, s.br15, s.ofh, s.mb3, s.jb]}>
            <View style={[s.ms5p, s.me40p]}>
              <Text style={[s.textWhite, s.f14]}>{t('invite_des')}</Text>
              <Button
                progress={false}
                stretch={false}
                type="white"
                height={s.h40.height}
                onPress={this.invite}
                style={[s.mb10p, s.mt5p]}>
                <ButtonText
                  fontWeight="700"
                  style={[s.textPrimaryDark, s.textCenter, s.w100, s.f13]}>
                  {t('invite_friend')}
                </ButtonText>
              </Button>
            </View>
          </ImageBackground>
        </View>
        <View style={[s.br15, s.bgLight, s.mt20]}>
          <View style={[s.bgWhite, s.br15, s.mb3]}>
            <Text fontWeight="700" style={[s.textGray, s.p20]}>
              {t('words_bank')}
            </Text>
            <View>{this.renderWordbank()}</View>
            {loggeduid === uid && (
              <View style={[s.m10p, s.mt5p]}>
                <Button
                  type="ice"
                  stretch={true}
                  onPress={this.openWordsbank}
                  style={[{borderColor: s.textPrimaryDark.color}]}>
                  <ButtonText fontWeight="700" style={[s.textPrimaryDark]}>
                    {t('words_bank')}
                  </ButtonText>
                </Button>
              </View>
            )}
          </View>
        </View>
        <Modal
          isVisible={isModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          onBackButtonPress={this.toggleModal}
          onBackdropPress={this.toggleModal}
          style={[s.m0, s.jb]}>
          <View style={[s.bgWhite, s.brTop15, s.p10p]}>
            <Text fontWeight="700" style={[s.textGray, s.mb5p]}>
              {t('change_your_name')}
            </Text>
            <Input
              maxLength={30}
              defaultValue={displayName}
              placeholder={t('name')}
              onChangeText={this.updateName}
            />
            <Button
              stretch={true}
              progress={true}
              onPress={this.saveName}
              style={[s.mt10p]}>
              <ButtonText>{t('edit')}</ButtonText>
            </Button>
          </View>
        </Modal>
      </View>
    );
  }
}

User.propTypes = {
  invitecode: PropTypes.string,
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
  uid: PropTypes.string.isRequired,
  trophy: PropTypes.number.isRequired,
  languagekey: PropTypes.string.isRequired,
  navigation: PropTypes.any.isRequired,
  loggeduid: PropTypes.string.isRequired,
};

export default User;
