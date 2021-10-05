import React from 'react';
import {View} from 'native-base';
import {Linking, Platform, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t, isRTL} from '../../locale';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import Iconmoon from '../../components/Icon/moon';
import Utils from '../../lib/Utils';
import RNFS from 'react-native-fs';
import {DOWNLOAD_PATH} from '../../lib/QuestionService';

const RowItem = (props) => {
  let {children, style = [], onPress} = props;
  let cStyle = [
    ...style,
    s.jsb,
    s.pt10,
    s.pb10,
    s.ac,
    isRTL() ? s.flexRowRev : s.flexRow,
  ];
  if (onPress && typeof onPress === 'function') {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={cStyle}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={cStyle}>{children}</View>;
};

class Settings extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {user} = props.context;
    this.state = {
      expiringAt: user.isPro
        ? Utils.getDateYYYYMMDDTime(user.proExpiringAt)
        : '',
      settings: user.settings || {},
    };
    this.userRef = firestore().doc(`users/${user.uid}`);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  updateSettings = (key, value) => {
    let {settings} = this.state;
    settings[key] = value;
    this.updateState({settings});
    this.userRef.update({settings});
  };

  renderGap = () => {
    return <View style={[s.hrlight, s.mt5, s.mb5]} />;
  };

  getChevron = () => {
    if (isRTL()) {
      return (
        <Iconmoon
          name="angle-arrow-pointing-left"
          style={[s.textGrayLight, s.f18]}
        />
      );
    } else {
      return (
        <Iconmoon
          name="angle-arrow-pointing-right"
          style={[s.textGrayLight, s.f18]}
        />
      );
    }
  };

  signOut = () => {
    global.signOut();
  };

  deleteDownloads = () => {
    RNFS.exists(DOWNLOAD_PATH).then((exists) => {
      if (exists) {
        RNFS.unlink(DOWNLOAD_PATH);
      }
      this.toastInfo(t('files_deleted'));
    });
  };

  loadGoals = () => {
    this.props.navigation.navigate('LearningGoals', {redirectback: true});
  };

  loadTerms = () => {
    this.props.navigation.navigate('Terms');
  };

  loadPolicy = () => {
    this.props.navigation.navigate('Privacy');
  };

  loadHelp = () => {
    this.props.navigation.navigate('Faq');
  };

  loadFeedback = () => {
    this.props.navigation.navigate('Feedback');
  };

  cancelSubscription = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL(
        'https://play.google.com/store/account/subscriptions?package=net.langoo',
      );
    }
  };

  render() {
    let {user} = this.props.context;
    let {expiringAt, settings} = this.state;
    return (
      <Container
        header="blue"
        title={t('settings')}
        style={[s.bgWhite]}
        contentContainerStyle={[s.p5p]}>
        <Text fontWeight="700" style={[s.textGray, s.f20, s.mt20, s.mb20]}>
          {t('subscription')}
        </Text>
        <RowItem>
          <Text style={[s.textGray, s.f18]}>{t('typeof_student')}</Text>
          <Text style={[s.textGray, s.f18]}>
            {user.isPro ? 'Pro' : 'Normal'}
          </Text>
        </RowItem>
        {user.isPro && (
          <>
            {this.renderGap()}
            <RowItem>
              <Text style={[s.textGray, s.f18]}>{t('subscription')}</Text>
              <Text style={[s.textGray, s.f18]}>{expiringAt}</Text>
            </RowItem>
            {this.renderGap()}
            <RowItem onPress={this.cancelSubscription}>
              <Text style={[s.textGray, s.f18]}>
                {t('cancel_subscription')}
              </Text>
              {this.getChevron()}
            </RowItem>
          </>
        )}
        {this.renderGap()}
        <RowItem onPress={this.deleteDownloads}>
          <Text style={[s.textGray, s.f18]}>{t('delete_all_downloads')}</Text>
          {this.getChevron()}
        </RowItem>
        {this.renderGap()}
        <RowItem onPress={this.loadGoals}>
          <Text style={[s.textGray, s.f18]}>{t('edit_daily_goals')}</Text>
          {this.getChevron()}
        </RowItem>
        {/* <Text fontWeight="700" style={[s.textGray, s.f20, s.mt15p, s.mb20]}>
          {t('effects')}
        </Text>
        <RowItem>
          <Text style={[s.textGray, s.f18]}>{t('sound_effects')}</Text>
          <Switch
            thumbColor="white"
            trackColor={{true: s.textPrimaryDark.color}}
            value={settings.sound}
            onValueChange={this.updateSettings.bind(this, 'sound')}
          />
        </RowItem>
        {this.renderGap()}
        <RowItem>
          <Text style={[s.textGray, s.f18]}>{t('motivational_moves')}</Text>
          <Switch
            thumbColor="white"
            trackColor={{true: s.textPrimaryDark.color}}
            value={settings.moves}
            onValueChange={this.updateSettings.bind(this, 'moves')}
          />
        </RowItem> */}
        <View style={[s.mt15p]}>
          {/* <Button type="ice" stretch={true} onPress={this.loadHelp}>
            <ButtonText fontWeight="700" style={[s.textPrimaryDark]}>
              {t('help_center')}
            </ButtonText>
          </Button> */}
          <Button
            type="ice"
            stretch={true}
            style={[s.mt10]}
            onPress={this.loadFeedback}>
            <ButtonText fontWeight="700" style={[s.textPrimaryDark]}>
              {t('contact_support')}
            </ButtonText>
          </Button>
          <Button
            type="ice"
            stretch={true}
            style={[s.mt10]}
            onPress={this.loadPolicy}>
            <ButtonText fontWeight="700" style={[s.textPrimaryDark]}>
              {t('privacy_policy')}
            </ButtonText>
          </Button>
          <Button
            type="ice"
            stretch={true}
            style={[s.mt10]}
            onPress={this.loadTerms}>
            <ButtonText fontWeight="700" style={[s.textPrimaryDark]}>
              {t('terms_of_service')}
            </ButtonText>
          </Button>
          <Button
            type="danger"
            progress={true}
            stretch={true}
            style={[s.mt20]}
            onPress={this.signOut}>
            <ButtonText fontWeight="700">{t('sign_out')}</ButtonText>
          </Button>
        </View>
      </Container>
    );
  }
}

export default withContext(Settings);
