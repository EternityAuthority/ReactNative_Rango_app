/** A screen that shows the got it values */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {View} from 'native-base';
import s from '../../assets/styles';
import Carousel from 'react-native-snap-carousel';
import {getLangCode, t} from '../../locale';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import ImageQuestionOption from '../ListItem/imageQuestionOption';
import DeviceInfo from 'react-native-device-info';
import Progress from '../../components/Progress';
import AudioService from '../../lib/AudioService';
import IconMoon from '../Icon/moon';
import PlayButton from '../Button/playButton';

class ToKnow extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {language, question} = props;
    let {options} = question;
    let currentIndex = 0;
    this.state = {
      options: options,
      currentIndex: currentIndex,
      audioPrepared: false,
    };
    let windowWidth = Dimensions.get('window').width;
    this.width = DeviceInfo.isTablet() ? windowWidth / 1.8 : windowWidth;
    this.itemWidth = this.width - 60; //padding around
    //If i am the active screen then prepare the first index for callback
    this.state.progress = this.getProgress(currentIndex);
    this.audioService = new AudioService(
      options,
      language.code,
      this.playComplete,
    );
    this.autoPlayed = false;
  }

  /** Since the carousel is reversed for android, it needs to handled accordingly in progress */
  getProgress = (currentIndex) => {
    let {options} = this.state;
    let lastIndex = options.length;
    let progress = ((currentIndex + 1) / lastIndex) * 100;
    return progress;
  };

  componentDidMount() {
    this.audioService.addAllPreparedListener(this.allAudioPrepared);
  }

  componentDidUpdate(prevProps) {
    let {activeScreen} = this.props;
    let {audioPrepared} = this.state;
    if (activeScreen && audioPrepared && !this.autoPlayed) {
      this.autoPlayed = true;
      this.playAudio();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let {activeScreen} = nextProps;
    let {playing, currentIndex, audioPrepared} = this.state;
    if (
      activeScreen ||
      playing !== nextState.playing ||
      audioPrepared !== nextState.audioPrepared ||
      currentIndex !== nextState.currentIndex
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audioService.removeAllPreparedListener(this.allAudioPrepared);
    this.audioService.destroy();
  }

  allAudioPrepared = () => {
    this.updateState({audioPrepared: true});
  };

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onLayout = (event) => {
    let {width} = event.nativeEvent.layout;
    let itemWidth = DeviceInfo.isTablet() ? width / 1.8 : width - 60; //d0 padding each side
    this.width = width;
    this.itemWidth = itemWidth;
  };

  onPress = () => {
    let {onContinue} = this.props;
    if (onContinue) {
      this.audioService.stopPlaying();
      onContinue();
    }
  };

  /** Needs to be reversed on android */
  moveNext = () => {
    this.carousel.snapToNext();
  };

  /** Needs to be reversed on android */
  movePrev = () => {
    this.carousel.snapToPrev();
  };

  playComplete = () => {
    this.updateState({playing: null});
  };

  playAudio = () => {
    let {currentIndex} = this.state;
    this.audioService.playIndex(currentIndex, () => {
      this.updateState({playing: currentIndex});
    });
  };

  playAudioSlowly = () => {
    let {currentIndex} = this.state;
    this.audioService.playIndexSlow(currentIndex, () => {
      this.updateState({playing: currentIndex});
    });
  };

  /** Based on client required audio will play everytime item is sanped */
  onSnapToItem = (optionIndex) => {
    let progress = this.getProgress(optionIndex);
    //this.updateState({currentIndex: optionIndex, progress}, this.playAudio);
    this.updateState({
      currentIndex: optionIndex,
      playing: optionIndex,
      progress,
    });
    this.audioService.playIndex(optionIndex);
  };

  renderItem = ({item, index}) => {
    let {language} = this.props;
    return (
      <View style={[s.mt30]}>
        <ImageQuestionOption
          primaryText={item.name[language.code] || item.defaultText}
          secondaryText={item.name[getLangCode()] || item.defaultText}
          imageURL={item.imageURL}
          clickable={true}
          selected={index === this.state.playing}
          onPress={this.playAudio}
        />
      </View>
    );
  };

  render() {
    //console.log('To know');
    let {currentIndex, progress, options, audioPrepared} = this.state;
    let disableRight = currentIndex === options.length - 1;
    let disableLeft = currentIndex === 0;
    let isOnLastSlide = currentIndex === options.length - 1;
    return (
      <View style={[s.flex1]}>
        <View style={[s.flex1]}>
          <ScrollView>
            <View>
              <Carousel
                ref={(c) => {
                  this.carousel = c;
                }}
                firstItem={currentIndex}
                initialNumToRender={3}
                layout="tinder"
                data={options}
                renderItem={this.renderItem}
                onSnapToItem={this.onSnapToItem}
                sliderWidth={this.width}
                itemWidth={this.itemWidth}
                layoutCardOffset={-15}
                extraData={this.state}
              />
              <View style={[s.ms30, s.me30, s.mt15]}>
                <View style={[s.ac]}>
                  <PlayButton
                    stretch={false}
                    progress={false}
                    onPlay={this.playAudio}
                    onSlowPlay={this.playAudioSlowly}>
                    {!audioPrepared && <ActivityIndicator color="white" />}
                  </PlayButton>
                </View>
                <View style={[s.flexRow, s.ac]}>
                  <TouchableOpacity
                    disabled={disableLeft}
                    activeOpacity={0.5}
                    onPress={this.movePrev}
                    style={[
                      s.hw40,
                      s.jcac,
                      s.br20,
                      s.b1,
                      disableLeft ? s.bDisabled : s.bColor,
                    ]}>
                    <IconMoon
                      name="left-arrow"
                      style={[
                        s.f20,
                        {
                          color: disableLeft
                            ? s.bDisabled.borderColor
                            : s.bColor.borderColor,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  <View style={[s.flex1, s.ms20, s.me20]}>
                    <Progress height={3} value={progress} hidepercent={true} />
                  </View>
                  <TouchableOpacity
                    disabled={disableRight}
                    activeOpacity={0.5}
                    onPress={this.moveNext}
                    style={[
                      s.hw40,
                      s.jcac,
                      s.br20,
                      s.b1,
                      disableRight ? s.bDisabled : s.bColor,
                    ]}>
                    <IconMoon
                      name="right-arrow"
                      style={[
                        s.f20,
                        {
                          color: disableRight
                            ? s.bDisabled.borderColor
                            : s.bColor.borderColor,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        {isOnLastSlide && (
          <View style={[s.flex0, s.ps30, s.pe30, s.pb20, s.pt10]}>
            <Button stretch={true} progress={false} onPress={this.onPress}>
              <ButtonText>{t('got_it')}</ButtonText>
            </Button>
          </View>
        )}
      </View>
    );
  }
}

ToKnow.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ToKnow;
