import React, {PureComponent} from 'react';
import {View} from 'native-base';
import Text from '../Text';
import {t} from '../../locale';
import s from '../../assets/styles';
import PropTypes from 'prop-types';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import ReportIssue from '../ReportIssue';

class CorrectModal extends PureComponent {
  onContinue = () => {
    let {onContinue} = this.props;
    if (onContinue) {
      onContinue();
    }
  };

  render() {
    let {language, successText, user, path, tryagain} = this.props;
    return (
      <View style={[s.bgSuccessLight]}>
        <View style={[s.p10p]}>
          <Text
            lang={language}
            fontWeight="700"
            style={[s.mt20, s.f25, s.textWhite]}>
            {successText}
          </Text>
          <Button
            stretch={true}
            style={[s.mt30]}
            type="success"
            onPress={this.onContinue}>
            <ButtonText>{t('continue')}</ButtonText>
          </Button>
          {!!tryagain && typeof tryagain === 'function' && (
            <Text
              fontWeight="700"
              onPress={tryagain}
              style={[s.textCenter, s.p10, s.mt15, s.textSuccessDarker]}>
              {t('try_again')}
            </Text>
          )}
        </View>
        <ReportIssue user={user} path={path} />
      </View>
    );
  }
}

CorrectModal.propTypes = {
  onContinue: PropTypes.func.isRequired,
  tryagain: PropTypes.func,
  language: PropTypes.any.isRequired,
  successText: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default CorrectModal;
