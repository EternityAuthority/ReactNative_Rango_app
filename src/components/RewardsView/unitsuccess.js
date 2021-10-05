import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Text from '../../components/Text';
import Button from '../../components/Button';
import FastImage from '../../components/Image';
import LottieView from 'lottie-react-native';
import ButtonText from '../../components/Text/buttonText';
import {View} from 'native-base';
import s from '../../assets/styles';
import {t} from '../../locale';
import {Player} from '@react-native-community/audio-toolkit';

class UnitSuccess extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.lessonPlayer = new Player('passedunitreward.mp3');
    this.lessonPlayer.prepare();
  }

  componentDidUpdate(prevProps) {
    let {activeScreen} = this.props;
    if (!prevProps.activeScreen && activeScreen) {
      this.playCelebration();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.lessonPlayer.destroy();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  playCelebration = () => {
    if (this.celebration) {
      this.celebration.play();
    }
    if (this.lessonPlayer) {
      this.lessonPlayer.play();
    }
  };

  render() {
    let {onContinue, unit} = this.props;
    return (
      <View style={[s.flex1, s.jc]}>
        <View style={[s.flex0, s.as, s.ac]}>
          <View style={[s.img200, s.br100, {backgroundColor: unit.bgcolor}]}>
            <FastImage
              source={{uri: unit.imageURL}}
              style={[s.abs, s.as, s.img200, s.br100, s.ofh, s.bottom0]}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text
          fontWeight="700"
          style={[s.ucase, s.mt40, s.f25, s.textCenter, s.textPrimaryDark]}>
          {t('passed')}
        </Text>
        <Text fontWeight="700" style={[s.m30, s.textGray, s.textCenter]}>
          {t('passed_unit')}
        </Text>
        <View style={[s.abs, s.hw100p]}>
          <LottieView
            ref={(e) => {
              this.celebration = e;
            }}
            style={[s.flex1]}
            resizeMode="cover"
            source={require('../../assets/animations/celebration.json')}
            speed={0.8}
            autoPlay={false}
            loop={false}
          />
        </View>
        <View style={[s.m30]}>
          <Button stretch={true} progress={false} onPress={onContinue}>
            <ButtonText>{t('continue')}</ButtonText>
          </Button>
        </View>
      </View>
    );
  }
}

UnitSuccess.propTypes = {
  onContinue: PropTypes.func.isRequired,
  activeScreen: PropTypes.bool,
  unit: PropTypes.object.isRequired,
};

export default UnitSuccess;
