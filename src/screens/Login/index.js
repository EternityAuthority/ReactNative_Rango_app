import React from 'react';
import {View} from 'native-base';
import auth from '@react-native-firebase/auth';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import SocialLogin from '../../components/SocialLogin';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import ButtonText from '../../components/Text/buttonText';
import s from '../../assets/styles';
import {TouchableOpacity} from 'react-native';
import Utils from '../../lib/Utils';
import {t} from '../../locale';

class Login extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      email: null,
      password: null,
      errors: {},
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onValueChange = (key, value) => {
    this.updateState({[key]: value});
  };

  loadForgotPassword = () => {
    let {navigation} = this.props;
    navigation.navigate('ForgotPassword');
  };

  loadPrivacy = () => {
    let {navigation} = this.props;
    navigation.navigate('Privacy');
  };

  loadTerms = () => {
    let {navigation} = this.props;
    navigation.navigate('Terms');
  };

  validate = () => {
    let {email, password, errors} = this.state;
    let valid = true;
    if (Utils.validateEmail(email)) {
      errors.email = false;
    } else {
      errors.email = true;
      valid = false;
    }
    if (Utils.validatePassword(password)) {
      errors.password = false;
    } else {
      errors.password = true;
      valid = false;
    }
    this.updateState({errors});
    return valid;
  };

  login = async (next) => {
    let valid = this.validate();
    if (valid) {
      try {
        let {email, password} = this.state;
        await auth().signInWithEmailAndPassword(email, password);
        //next();
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.toastError(t('invalid_credentials'));
            break;
          case 'auth/invalid-email':
            this.toastError(t('invalid_email'));
            break;
          default:
            this.toastError(error.message);
        }
        next();
      }
    } else {
      next();
    }
  };

  render() {
    let {email, password, errors} = this.state;
    return (
      <Container style={[s.bgWhite]}>
        <View style={[s.flex1, s.p5p, s.pt0]}>
          <View style={[s.flex0, s.mt10]}>
            <Text fontWeight="700" style={[s.f24]}>
              {t('signin')}
            </Text>
            <Text style={[s.textGray, s.mt5]}>
              {t('login_to_your_account')}
            </Text>
          </View>
          <View style={[s.flex1, s.mt20]}>
            <View style={[s.mt20]}>
              <Input
                value={email}
                placeholder={t('email_address')}
                invalid={errors.email}
                onChangeText={this.onValueChange.bind(this, 'email')}
              />
            </View>
            <View style={[s.mt20]}>
              <Input
                value={password}
                secureTextEntry={true}
                placeholder={t('password')}
                invalid={errors.password}
                onChangeText={this.onValueChange.bind(this, 'password')}
              />
            </View>
            <View style={[s.mt20, s.jcac]}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.loadForgotPassword}>
                <Text
                  fontWeight="700"
                  style={[s.textPrimary, s.ccase, s.textCenter]}>
                  {t('forgot_password')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[s.mt30, s.mb20]}>
              <Button stretch={true} progress={true} onPress={this.login}>
                <ButtonText>{t('login')}</ButtonText>
              </Button>
            </View>
            {/* <View style={[s.flexRow, s.jcac]}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.loadPrivacy}>
                <Text style={[s.textGray, s.f14, s.p10]}>
                  {t('privacy_policy')}
                </Text>
              </TouchableOpacity>
              <View style={[s.ms5p]} />
              <TouchableOpacity activeOpacity={0.5} onPress={this.loadTerms}>
                <Text style={[s.textGray, s.f14, s.p10]}>{t('terms')}</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={[s.flex1, s.jb]}>
            <View>
              <View style={[s.hr]} />
              <View style={[s.mt_15, s.jcac]}>
                <Text style={[s.bgWhite, s.textGray, s.ps15, s.pe15]}>
                  {t('or')}
                </Text>
              </View>
            </View>
            <SocialLogin />
          </View>
        </View>
      </Container>
    );
  }
}

export default Login;
