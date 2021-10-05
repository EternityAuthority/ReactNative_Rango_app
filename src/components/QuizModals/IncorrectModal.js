import React, {PureComponent} from 'react';
import {View} from 'native-base';
import Text from '../Text';
import {t} from '../../locale';
import s from '../../assets/styles';
import PropTypes from 'prop-types';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import ReportIssue from '../ReportIssue';

class IncorrectModal extends PureComponent {
  onContinue = () => {
    let {onContinue} = this.props;
    if (onContinue) {
      onContinue(true);
    }
  };

  render() {
    let {failedText, user, path} = this.props;
    return (
      <View style={[s.bgDangerLight]}>
        <View style={[s.p10p]}>
          <Text fontWeight="700" style={[s.mt20, s.f25, s.textWhite]}>
            {t('right_answer')}
          </Text>
          <Text style={[s.mt10, s.textWhite]}>{failedText}</Text>
          <Button
            stretch={true}
            style={[s.mt30]}
            type="danger"
            onPress={this.onContinue}>
            <ButtonText>{t('continue')}</ButtonText>
          </Button>
        </View>
        <ReportIssue type="danger" user={user} path={path} />
      </View>
    );
  }
}

IncorrectModal.propTypes = {
  onContinue: PropTypes.func.isRequired,
  failedText: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default IncorrectModal;
