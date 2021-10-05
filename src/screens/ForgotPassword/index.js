import React from 'react';
import {View} from 'native-base';
import auth from '@react-native-firebase/auth';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import ButtonText from '../../components/Text/buttonText';
import s from '../../assets/styles';
import Utils from '../../lib/Utils';
import {t} from '../../locale';

class ForgotPassword extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      email: null,
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

  validate = () => {
    let {email, errors} = this.state;
    let valid = true;
    if (Utils.validateEmail(email)) {
      errors.email = false;
    } else {
      errors.email = true;
      valid = false;
    }
    this.updateState({errors});
    return valid;
  };

  sendRecoveryEmail = async (next) => {
    let valid = this.validate();
    if (valid) {
      try {
        let {email} = this.state;
        await auth().sendPasswordResetEmail(email);
        this.updateState({email: null, errors: {}});
        this.toastSuccess(t('password_reset_link'));
        next();
      } catch (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            this.toastError(t('invalid_email'));
            break;
          case 'auth/user-not-found':
            this.toastError(t('user_not_found'));
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
    let {email, errors} = this.state;
    return (
      <Container style={[s.bgWhite]}>
        <View style={[s.flex1, s.p5p, s.pt0]}>
          <View style={[s.flex0, s.mt10]}>
            <Text fontWeight="700" style={[s.f24]}>
              {t('forgot_password')}
            </Text>
            <Text style={[s.textGray, s.mt5]}>{t('reset_your_password')}</Text>
          </View>
          <View style={[s.flex1, s.mt10, s.jc]}>
            <View style={[s.mt20]}>
              <Input
                invalid={errors.email}
                value={email}
                placeholder={t('email_address')}
                onChangeText={this.onValueChange.bind(this, 'email')}
              />
            </View>
            <View style={[s.mt30]}>
              <Button
                stretch={true}
                progress={true}
                onPress={this.sendRecoveryEmail}>
                <ButtonText>{t('reset')}</ButtonText>
              </Button>
            </View>
            <View style={[s.mt30]}>
              <Text style={[s.textGray, s.f14, s.textCenter]}>
                {t('forgot_des')}
              </Text>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default ForgotPassword;
