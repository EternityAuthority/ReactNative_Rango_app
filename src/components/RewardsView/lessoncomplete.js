import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Icon from '../../components/Icon/moon';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {View} from 'native-base';
import LottieView from 'lottie-react-native';
import s from '../../assets/styles';
import {t} from '../../locale';
import {Player} from '@react-native-community/audio-toolkit';
import GenericRewardCount from './genericRewardCount';

class LessonComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {rewardsconfig, useranswers} = props;
    let {correctcount} = useranswers;
    let {lesson} = rewardsconfig;
    let parvalues = lesson.data.filter((d) => correctcount <= d.qsize);
    if (parvalues.length > 0) {
      parvalues.sort((a, b) => a.qsize - b.qsize);
    }
    this.lessonreward = parvalues[0];
    /** Based on the lesson reward prepare which sound to play */
    let {chest_type} = this.lessonreward;
    if (chest_type === 'platinum') {
      this.lessonaudio = 'platinum.mp3';
      this.chestname = t('platinum_chest');
      this.lessonchest = require('../../assets/animations/platinumchest.json');
      this.lessonstyle = s.textPlatinum;
    } else if (chest_type === 'gold') {
      this.lessonaudio = 'gold.mp3';
      this.chestname = t('gold_chest');
      this.lessonchest = require('../../assets/animations/goldchest.json');
      this.lessonstyle = s.textGolden;
    } else {
      this.chestname = t('silver_chest');
      this.lessonaudio = 'silver.mp3';
      this.lessonchest = require('../../assets/animations/silverchest.json');
      this.lessonstyle = s.textPrimaryDark;
    }
    this.lessonPlayer = new Player(this.lessonaudio);
    this.state = {
      multiplier: 1,
      loaded: !global.adsService.isLoading(),
    };
  }

  componentDidMount() {
    this.lessonPlayer.prepare(() => {
      this.playCelebration();
    });
    global.adsService.addListener(this.onAdEvent);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.lessonPlayer.destroy();
    global.adsService.removeListener(this.onAdEvent);
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

  onAdEvent = (status) => {
    if (status === 'finished') {
      this.updateState({multiplier: 2, loaded: false});
      let {updateMultiplier} = this.props;
      if (updateMultiplier) {
        updateMultiplier(2);
      }
    } else if (status === 'loaded') {
      this.updateState({loaded: true});
    } else if (status === 'loading') {
      this.updateState({loaded: false});
    }
  };

  /**
   * Based on hanys feedback, when user is pro dont show them ad, just multiply
   */
  showGlobalAd = () => {
    let {isPro} = this.props;
    if (isPro) {
      this.onAdEvent('finished');
    } else {
      global.adsService.show();
    }
  };

  /** As of now not in use because adsense is deactivated */
  renderDoubleRewardButton = () => {
    let {onContinue, isPro, cangoback} = this.props;
    let {multiplier, loaded} = this.state;
    return (
      <View>
        {multiplier === 2 && (
          <Button disabled={true} type="ice" stretch={true} progress={false}>
            <ButtonText style={[s.textPrimary]}>
              {t('reward_doubled')}
            </ButtonText>
          </Button>
        )}
        {multiplier === 1 && (
          <Button
            disabled={!loaded}
            stretch={true}
            progress={false}
            onPress={this.showGlobalAd}>
            <ButtonText>{t('double_reward')}</ButtonText>
            {!isPro && !loaded && (
              <ActivityIndicator
                size="small"
                color="white"
                style={[s.mHor10]}
              />
            )}
            {!isPro && loaded && (
              <Icon name="play" style={[s.mHor10, s.f16, s.textWhite]} />
            )}
          </Button>
        )}
        <TouchableOpacity
          disabled={!cangoback}
          activeOpacity={0.5}
          onPress={onContinue}>
          {cangoback && (
            <Text
              fontWeight="700"
              style={[s.textCenter, s.textPrimaryDark, s.mt20, s.mb20]}>
              {t('continue')}
            </Text>
          )}
          {!cangoback && (
            <ActivityIndicator
              color={s.textPrimary.color}
              size="small"
              style={[s.mt20, s.mb20]}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    let {useranswers} = this.props;
    let {correctcount} = useranswers;
    let {gems, gold, trophyperanswer = 1} = this.lessonreward;
    let {multiplier} = this.state;
    gems = gems * multiplier;
    gold = gold * multiplier;
    /** Based on the new update from hany, trophy should not be doubled */
    let trophy = correctcount * trophyperanswer;
    return (
      <View style={[s.flex1, s.jc]}>
        <LottieView
          style={[s.img300, s.as]}
          resizeMode="contain"
          source={this.lessonchest}
          autoPlay={true}
          loop={false}
        />
        <Text
          fontWeight="700"
          style={[s.ucase, s.f25, s.textCenter, this.lessonstyle]}>
          {this.chestname}
        </Text>
        <View style={[s.mt20]}>
          <GenericRewardCount gold={gold} gems={gems} trophy={trophy} />
        </View>
        <Text
          fontWeight="700"
          style={[s.ms30, s.me30, s.mt20, s.textGray, s.textCenter]}>
          {t('nice_job_you_passed_lesson')}
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
        <View style={[s.ms30, s.me30, s.mt20]}>
          {this.renderDoubleRewardButton()}
        </View>
      </View>
    );
  }
}

LessonComplete.propTypes = {
  useranswers: PropTypes.object.isRequired,
  rewardsconfig: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
  updateMultiplier: PropTypes.func,
  saving: PropTypes.bool,
  activeScreen: PropTypes.bool,
  isPro: PropTypes.bool,
  cangoback: PropTypes.bool,
};

export default LessonComplete;
