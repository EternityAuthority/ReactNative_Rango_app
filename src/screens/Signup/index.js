import React from 'react';
import {View} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import SocialLogin from '../../components/SocialLogin';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import ButtonText from '../../components/Text/buttonText';
import Utils from '../../lib/Utils';
import s from '../../assets/styles';
import {t} from '../../locale';

class SignUp extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      name: null,
      age: null,
      email: null,
      password: null,
      terms_consent: false,
      errors: {},
    };
    this.userColl = firestore().collection('users');
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

  loadPrivacy = () => {
    let {navigation} = this.props;
    navigation.navigate('Privacy');
  };

  loadTerms = () => {
    let {navigation} = this.props;
    navigation.navigate('Terms');
  };

  validate = () => {
    let {name, age, email, password, terms_consent, errors} = this.state;
    let valid = true;
    if (Utils.validateName(name)) {
      errors.name = false;
    } else {
      errors.name = true;
      valid = false;
    }

    /** Age is optional, only validate it when provided */
    if (age) {
      if (Utils.validateAge(age)) {
        errors.age = false;
      } else {
        errors.age = true;
        valid = false;
      }
    }

    if (Utils.validateEmail(email)) {
      errors.email = false;
    } else {
      errors.email = true;
      valid = false;
    }

    if (Utils.validatePassword(password)) {
      errors.password = false;
      delete errors.passwordMsg;
    } else {
      errors.password = true;
      errors.passwordMsg = t('password_des');
      valid = false;
    }

    if (terms_consent) {
      errors.terms_consent = false;
    } else {
      errors.terms_consent = true;
      valid = false;
    }

    this.updateState({errors});
    return valid;
  };

  /**
   * Validate and signs the user up for the app
   */
  signup = async (next) => {
    let valid = this.validate();
    if (valid) {
      /** Proceed to create the user */
      let {name, age, email, password} = this.state;
      try {
        await auth().createUserWithEmailAndPassword(email, password);
        await auth().currentUser.updateProfile({displayName: name});
        await auth().currentUser.reload();
        let {uid} = auth().currentUser;
        await this.userColl.doc(uid).set(
          {
            uid: uid,
            age: age,
            displayName: name,
          },
          {merge: true},
        );
        //next();
      } catch (error) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.toastError(t('email_in_use'));
            break;
          case 'auth/invalid-email':
            this.toastError(t('invalid_email'));
            break;
          case 'auth/weak-password':
            this.toastError(t('weak_password'));
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

  onSocialLoginError = (error) => {
    this.toastError(error.message);
  };

  render() {
    let {name, age, email, password, terms_consent, errors} = this.state;
    let showTermsError = errors.terms_consent;
    return (
      <Container style={[s.bgWhite]}>
        <View style={[s.flex1, s.p5p, s.pt0]}>
          <View style={[s.flex0, s.mt10]}>
            <Text fontWeight="700" style={[s.f24]}>
              {t('signup')}
            </Text>
            <Text style={[s.textGray, s.mt5]}>{t('create_new_account')}</Text>
          </View>
          <View style={[s.flex1, s.mt10]}>
            <View style={[s.mt20]}>
              <Input
                value={name}
                placeholder={`${t('name')} *`}
                invalid={errors.name}
                onChangeText={this.onValueChange.bind(this, 'name')}
              />
            </View>
            <View style={[s.mt20]}>
              <Input
                value={age}
                maxLength={2}
                keyboardType="number-pad"
                placeholder={`${t('age')}`}
                invalid={errors.age}
                onChangeText={this.onValueChange.bind(this, 'age')}
              />
            </View>
            <View style={[s.mt20]}>
              <Input
                value={email}
                keyboardType="email-address"
                placeholder={`${t('email_address')} *`}
                invalid={errors.email}
                onChangeText={this.onValueChange.bind(this, 'email')}
              />
            </View>
            <View style={[s.mt20]}>
              <Input
                secureTextEntry={true}
                placeholder={`${t('password')} *`}
                value={password}
                invalid={errors.password}
                message={errors.passwordMsg}
                onChangeText={this.onValueChange.bind(this, 'password')}
              />
            </View>
            <View style={[s.mt20]}>
              <View style={[s.flexRow, s.ac]}>
                <View style={[s.flex0, s.w50, s.ac]}>
                  <CheckBox
                    tintColors={{true: s.textPrimary.color, false: s.textGrayLight.color}}
                    tintColor={s.textGrayLight.color}
                    onCheckColor={s.textPrimary.color}
                    onTintColor={s.textPrimary.color}
                    value={terms_consent}
                    onValueChange={this.onValueChange.bind(
                      this,
                      'terms_consent',
                    )}
                  />
                </View>
                <View style={[s.flex1]}>
                  <Text
                    style={[
                      s.f14,
                      s.textCenter,
                      showTermsError ? s.textDanger : s.textGray,
                    ]}>
                    By registering you agree to our{' '}
                    <Text
                      onPress={this.loadPrivacy}
                      style={[s.f14, s.textPrimary]}>
                      Privacy Policy{' '}
                    </Text>
                    and{' '}
                    <Text
                      onPress={this.loadTerms}
                      style={[s.f14, s.textPrimary]}>
                      Terms & Conditions
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={[s.mt30, s.mb30]}>
              <Button stretch={true} progress={true} onPress={this.signup}>
                <ButtonText>{t('register')}</ButtonText>
              </Button>
            </View>
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
            <SocialLogin onError={this.onSocialLoginError} />
          </View>
        </View>
      </Container>
    );
  }
}

export default SignUp;
