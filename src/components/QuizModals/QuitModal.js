import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {View} from 'native-base';
import Text from '../Text';
import {t} from '../../locale';
import s from '../../assets/styles';
import PropTypes from 'prop-types';
import Button from '../Button';
import ButtonText from '../Text/buttonText';

class QuitModal extends PureComponent {
  render() {
    let {onCancel, onContinue} = this.props;
    let ohnoMarginTop = 0.7 * s.img250.height;
    let ohnoPaddingTop = 0.3 * s.img250.height;
    return (
      <View>
        <Image
          source={require('../../assets/images/ohno.png')}
          resizeMode="contain"
          style={[s.img250, s.as, s.abs, {top: -ohnoMarginTop}]}
        />
        <View style={[s.p10p, {paddingTop: ohnoPaddingTop}]}>
          <Text
            fontWeight="700"
            style={[s.mt20, s.f20, s.textCenter, s.textGrayDark]}>
            {t('quit_lesson')}
          </Text>
          <Text style={[s.mt5, s.textCenter, s.textGrayDark]}>
            {t('quit_lesson_msg')}
          </Text>
          <Button stretch={true} style={[s.mt30]} onPress={onContinue}>
            <ButtonText>{t('yes')}</ButtonText>
          </Button>
          <Button type="ice" stretch={true} style={[s.mt20]} onPress={onCancel}>
            <ButtonText style={[s.textPrimary]}>
              {t('no_continue_learning')}
            </ButtonText>
          </Button>
        </View>
      </View>
    );
  }
}

QuitModal.propTypes = {
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default QuitModal;
