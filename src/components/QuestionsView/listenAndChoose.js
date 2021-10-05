import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import ImageQuestionOption from '../ListItem/imageQuestionOption';
import {Player} from '@react-native-community/audio-toolkit';
import PlayButton from '../Button/playButton';

class ListenAndChoose extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    let langCode = getLangCode();
    let {question, language} = props;
    let {
      options,
      defaultText,
      questionText,
      name,
      questionsName,
      audioURL,
    } = question;
    let title = name[langCode] || defaultText;
    let phrase = questionsName[language.code] || questionText;
    this.state = {
      options: options,
      title: title,
      phrase: phrase,
      audioPrepared: false,
    };
    this.audioPlayer = new Player(audioURL[language.code], {
      autoDestroy: false,
    });
    this.audioPlayer.prepare(this.allAudioPrepared);
    this.autoPlayed = false;
  }

  componentDidUpdate(prevProps) {
    let {activeScreen} = this.props;
    let {audioPrepared} = this.state;
    if (activeScreen && audioPrepared && !this.autoPlayed) {
      this.autoPlayed = true;
      this.playAudio();
    }
  }

  /** Rerender is only required when it becomes active or currently playing in the state changes */
  shouldComponentUpdate(nextProps, nextState) {
    let {activeScreen} = nextProps;
    let {playing, audioPrepared} = this.state;
    if (
      activeScreen ||
      playing !== nextState.playing ||
      audioPrepared !== nextState.audioPrepared
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audioPlayer.destroy();
  }

  allAudioPrepared = () => {
    this.updateState({audioPrepared: true});
  };

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onPress = () => {
    let {onContinue, language} = this.props;
    if (onContinue) {
      this.audioPlayer.stop();
      let {playing, options} = this.state;
      let valueSelected = options[playing].name[language.code];
      let actualOption = options.filter((o) => o.answer)[0];
      let actualValue = actualOption.name[language.code];
      onContinue(valueSelected, actualValue);
    }
  };

  onSkip = () => {
    let {onContinue} = this.props;
    if (onContinue) {
      this.audioPlayer.stop();
      onContinue();
    }
  };

  playAudio = () => {
    if (this.audioPlayer.isPrepared) {
      this.audioPlayer.speed = 1;
      this.audioPlayer.play();
    }
  };

  playAudioSlowly = () => {
    if (this.audioPlayer.isPrepared) {
      this.audioPlayer.speed = 0.5;
      this.audioPlayer.play();
    }
  };

  selectOption = (optionIndex) => {
    this.updateState({playing: optionIndex});
  };

  renderOptions = () => {
    let {language} = this.props;
    let {options} = this.state;
    let toLearnCode = language.code;
    return options.map((option, i) => (
      <View key={`option_${i}`} style={[s.mt20]}>
        <ImageQuestionOption
          primaryText={option.name[toLearnCode] || option.defaultText}
          clickable={true}
          selected={i === this.state.playing}
          onPress={this.selectOption.bind(this, i)}
        />
      </View>
    ));
  };

  renderQuestionTitle = () => {
    let {title, audioPrepared} = this.state;
    return (
      <View style={[s.mb20]}>
        <Text fontWeight="700" style={[s.textGray, s.f22]}>
          {title}
        </Text>
        <View style={[s.mt30, s.jcac]}>
          <PlayButton
            size={110}
            onPlay={this.playAudio}
            onSlowPlay={this.playAudioSlowly}>
            {!audioPrepared && <ActivityIndicator color="white" />}
          </PlayButton>
        </View>
      </View>
    );
  };

  render() {
    let {playing} = this.state;
    let isOptionSelected = playing >= 0;
    return (
      <View style={[s.flex1]}>
        <ScrollView contentContainerStyle={[s.p30, s.pt10, s.flexGrow]}>
          {this.renderQuestionTitle()}
          {this.renderOptions()}
        </ScrollView>
        <View style={[s.flex0, s.ps30, s.pe30, s.pb20, s.pt10]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[s.mb15]}
            onPress={this.onSkip}>
            <Text style={[s.textCenter, s.textGray, s.f14]}>
              {t('cant_listen_now')}
            </Text>
          </TouchableOpacity>
          <Button
            disabled={!isOptionSelected}
            stretch={true}
            progress={false}
            onPress={this.onPress}>
            <ButtonText style={[s.lcase]}>{t('check')}</ButtonText>
          </Button>
        </View>
      </View>
    );
  }
}

ListenAndChoose.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ListenAndChoose;
