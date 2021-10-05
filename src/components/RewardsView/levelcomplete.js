import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-native';
import Text from '../../components/Text';
import Button from '../../components/Button';
import LottieView from 'lottie-react-native';
import ButtonText from '../../components/Text/buttonText';
import {View} from 'native-base';
import s from '../../assets/styles';
import {t} from '../../locale';
import {Player} from '@react-native-community/audio-toolkit';
const ANIM = {
  level1: require('../../assets/animations/level1.json'),
  level2: require('../../assets/animations/level2.json'),
  level3: require('../../assets/animations/level3.json'),
  level4: require('../../assets/animations/level4.json'),
  level5: require('../../assets/animations/level5.json'),
  level6: require('../../assets/animations/level6.json'),
  level7: require('../../assets/animations/level7.json'),
};

class LevelComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.player = new Player('levelup.mp3');
    this.player.prepare();
  }

  componentDidUpdate(prevProps) {
    let {activeScreen} = this.props;
    if (!prevProps.activeScreen && activeScreen) {
      this.playCelebration();
    }
  }

  componentDidMount() {
    this.playCelebration();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.player.destroy();
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
    if (this.player) {
      this.player.play();
    }
  };

  /**
   * Level is the next level in which i shift to
   * @returns
   */
  render() {
    let {onContinue, level = {}} = this.props;
    let {no} = level;
    let source = ANIM[`level${no}`];
    return (
      <View style={[s.flex1, s.jc]}>
        {!!source && (
          <LottieView
            style={[s.img200, s.as]}
            resizeMode="contain"
            source={source}
            autoPlay={true}
            loop={true}
          />
        )}
        <Text
          fontWeight="700"
          style={[s.ucase, s.mt40, s.f20, s.textCenter, s.textDark]}>
          {t('level_up')}
        </Text>
        <Text style={[s.m5, s.textGrayDark, s.textCenter]}>
          {t('level_up_des')}
        </Text>
        <Text
          fontWeight="700"
          style={[s.ucase, s.mt30, s.f25, s.textCenter, s.textPrimary]}>
          {level.defaultText}
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

LevelComplete.propTypes = {
  onContinue: PropTypes.func.isRequired,
  activeScreen: PropTypes.bool,
  level: PropTypes.object.isRequired,
};

export default LevelComplete;
