import React, {PureComponent} from 'react';
import {Platform} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import firestore from '@react-native-firebase/firestore';
import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import ButtonText from '../../components/Text/buttonText';
import s from '../../assets/styles';
import {t} from '../../locale';
GoogleSignin.configure({
  webClientId:
    '463710619404-0o40drh2gbdn8ur0gh0f9b1tv3k3itm1.apps.googleusercontent.com',
});

class SocialLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.userColl = firestore().collection('users');
  }

  /**
   * Will be called when user canceles the social login
   * @param {*} next
   */
  onCancel = (next) => {
    next();
    let {onCancel} = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  /**
   * Will be called when there is error in social login
   * @param {*} next
   * @param {*} error
   */
  onError = (next, error) => {
    next();
    let {onError} = this.props;
    console.error(error);
    if (typeof onError === 'function') {
      onError(error);
    }
  };

  /**
   * Will be called when social login is success
   * @param {*} next
   * @param {*} credential
   */
  onSuccess = async (next, credential) => {
    try {
      await auth().signInWithCredential(credential);
      await auth().currentUser.reload();
      let {uid, displayName} = auth().currentUser;
      displayName = displayName ? displayName : 'User';
      await this.userColl.doc(uid).set(
        {
          uid: uid,
          displayName: displayName,
        },
        {merge: true},
      );
      //next();
      let {onSuccess} = this.props;
      if (typeof onSuccess === 'function') {
        onSuccess(credential);
      }
    } catch (error) {
      this.onError(next, error);
    }
  };

  loginGoogle = async (next) => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      this.onSuccess(next, credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.onCancel(next);
      } else {
        this.onError(next, error);
      }
    }
  };

  loginFacebook = (next) => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      async (result) => {
        if (result.isCancelled) {
          this.onCancel(next);
        } else {
          let data = await AccessToken.getCurrentAccessToken();
          const credential = auth.FacebookAuthProvider.credential(
            data.accessToken,
          );
          this.onSuccess(next, credential);
        }
      },
      (error) => {
        this.onError(next, error);
      },
    );
  };

  /** Login using apple */
  loginApple = async (next) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const {identityToken, nonce} = appleAuthRequestResponse;
      if (identityToken) {
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );
        this.onSuccess(next, appleCredential);
      } else {
        throw new Error('Auth state is cancelled or some error exist');
      }
    } catch (error) {
      //1000 and 1001 are bogus errors generated when user cancels the login
      if (
        error.code === 1000 ||
        error.code === '1000' ||
        error.code === 1001 ||
        error.code === '1001'
      ) {
        this.onCancel(next);
      } else {
        this.onError(next, error);
      }
    }
  };

  render() {
    return (
      <>
        <Button
          type="google"
          stretch={true}
          progress={true}
          style={[s.mt15]}
          onPress={this.loginGoogle}>
          <Icon
            name="google"
            type="FontAwesome"
            style={[s.textWhite, s.me15]}
          />
          <ButtonText>{t('google')}</ButtonText>
        </Button>
        <Button
          type="facebook"
          stretch={true}
          progress={true}
          style={[s.mt15]}
          onPress={this.loginFacebook}>
          <Icon
            name="facebook"
            type="FontAwesome"
            style={[s.textWhite, s.me15]}
          />
          <ButtonText>{t('facebook')}</ButtonText>
        </Button>
        {Platform.OS === 'ios' && appleAuth.isSupported && (
          <Button
            type="apple"
            stretch={true}
            progress={true}
            style={[s.mt15]}
            onPress={this.loginApple}>
            <Icon
              name="apple"
              type="FontAwesome"
              style={[s.textWhite, s.me15]}
            />
            <ButtonText>{t('apple')}</ButtonText>
          </Button>
        )}
      </>
    );
  }
}

export default SocialLogin;
