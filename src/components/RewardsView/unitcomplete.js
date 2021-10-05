import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Image, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {View} from 'native-base';
import LottieView from 'lottie-react-native';
import s from '../../assets/styles';
import {t} from '../../locale';
import {Player} from '@react-native-community/audio-toolkit';
import GenericRewardCount from './genericRewardCount';
import {UNIT_PASS_NO} from '../../lib/Constants';

class UnitComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {rewardsconfig, useranswers} = props;
    let {correctcount} = useranswers;
    let {unit} = rewardsconfig;
    let parvalues = unit.data.filter((d) => correctcount <= d.qsize);
    if (parvalues.length > 0) {
      parvalues.sort((a, b) => a.qsize - b.qsize);
    }
    this.unitreward = parvalues[0];
    const passed = correctcount > UNIT_PASS_NO;
    if (passed) {
      this.player = new Player('passedunitreward.mp3');
    } else {
      this.player = new Player('unitfailed.mp3');
    }
    this.state = {
      passed: passed,
    };
  }

  componentDidMount() {
    this.player.prepare(() => {
      let {passed} = this.state;
      if (passed) {
        this.playCelebration();
      }
    });
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

  renderHeading = () => {
    let source = null;
    let {passed} = this.state;
    let textStyle = null;
    let heading = null;
    let description = null;
    if (passed) {
      source = require('../../assets/images/happylangoo.png');
      textStyle = s.textPrimary;
      heading = t('unit_complete');
      description = t('unit_complete_des');
    } else {
      source = require('../../assets/images/sadlangoo.png');
      textStyle = s.textDanger;
      heading = t('try_again');
      description = t('try_again_des');
    }
    return (
      <>
        <Image
          style={[s.img300x177, s.as]}
          resizeMode="contain"
          source={source}
        />
        <Text fontWeight="700" style={[s.f25, s.mt10, s.textCenter, textStyle]}>
          {heading}
        </Text>
        <Text style={[s.mt10, s.ms10p, s.me10p, s.textCenter, s.textGray]}>
          {description}
        </Text>
      </>
    );
  };

  render() {
    let {passed} = this.state;
    let {useranswers, onContinue, onRepeat} = this.props;
    let {correctcount, qsize} = useranswers;
    let {gems, gold, trophyperanswer = 1} = this.unitreward;
    let trophy = correctcount * trophyperanswer;
    return (
      <View style={[s.flex1, s.jc]}>
        {this.renderHeading()}
        <View style={[s.mt20]}>
          <Text fontWeight="700" style={[s.textCenter, s.f30, s.textGray]}>
            {`${correctcount} / ${qsize}`}
          </Text>
          <Text style={[s.textCenter, s.textGray]}>{t('correct_answers')}</Text>
        </View>
        {passed && (
          <>
            <View style={[s.mt20]}>
              <GenericRewardCount gold={gold} gems={gems} trophy={trophy} />
            </View>
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
          </>
        )}
        {!passed && (
          <>
            <View style={[s.m30]}>
              <Button stretch={true} progress={false} onPress={onRepeat}>
                <ButtonText>{t('repeat_the_test')}</ButtonText>
              </Button>
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={onContinue}>
              <Text fontWeight="700" style={[s.textCenter, s.textPrimaryDark]}>
                {t('not_now')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

UnitComplete.propTypes = {
  onRepeat: PropTypes.func.isRequired,
  useranswers: PropTypes.object.isRequired,
  rewardsconfig: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  activeScreen: PropTypes.bool,
};

export default UnitComplete;
