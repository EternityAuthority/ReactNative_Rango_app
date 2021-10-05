import React, {PureComponent} from 'react';
import {View} from 'native-base';
import LottieView from 'lottie-react-native';
import Text from '../../components/Text';
import s from '../../assets/styles';
import {t} from '../../locale';

class Loading extends PureComponent {
  render() {
    return (
      <View style={[s.flex1, s.jcac]}>
        <LottieView
          style={[s.img200]}
          resizeMode="contain"
          source={require('../../assets/animations/loading.json')}
          autoPlay
          loop
        />
        <View style={[s.mt10p]}>
          <Text fontWeight="700" style={[s.textGrayDark, s.textCenter, s.f22]}>
            {t('loading')}
          </Text>
          <Text style={[s.mt10, s.textGray, s.textCenter]}>
            {t('please_wait')}
          </Text>
        </View>
      </View>
    );
  }
}

export default Loading;
