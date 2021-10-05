import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import AudioService from '../../lib/AudioService';
import PlayButton from '../Button/playButton';

class ChooseAudio extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    let langCode = getLangCode();
    let {question, language} = props;
    let {options, defaultText, questionText, name, questionsName} = question;
    let title = name[langCode] || defaultText;
    let phrase = questionsName[language.code] || questionText;
    this.state = {
      options: options,
      title: title,
      phrase: phrase,
      audioPrepared: false,
    };
    this.audioService = new AudioService(options, language.code);
  }

  componentDidMount() {
    this.audioService.addAllPreparedListener(this.allAudioPrepared);
  }

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

  onPress = () => {
    let {onContinue, language} = this.props;
    if (onContinue) {
      this.audioService.stopPlaying();
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
      this.audioService.stopPlaying();
      onContinue();
    }
  };

  playAudio = (optionIndex) => {
    this.updateState({playing: optionIndex});
    this.audioService.playIndex(optionIndex);
  };

  playAudioSlowly = (optionIndex) => {
    this.updateState({playing: optionIndex});
    this.audioService.playIndexSlow(optionIndex);
  };

  renderOptions = () => {
    let {playing, audioPrepared} = this.state;
    return (
      <View>
        <View style={[s.flexRow, s.jsa]}>
          <PlayButton
            size={110}
            selected={playing === 0}
            onPlay={this.playAudio.bind(this, 0)}
            onSlowPlay={this.playAudioSlowly.bind(this, 0)}>
            {!audioPrepared && <ActivityIndicator color="white" />}
          </PlayButton>
        </View>
        <View style={[s.flexRow, s.jsa]}>
          <PlayButton
            size={110}
            selected={playing === 1}
            onPlay={this.playAudio.bind(this, 1)}
            onSlowPlay={this.playAudioSlowly.bind(this, 1)}>
            {!audioPrepared && <ActivityIndicator color="white" />}
          </PlayButton>
          <PlayButton
            size={110}
            selected={playing === 2}
            onPlay={this.playAudio.bind(this, 2)}
            onSlowPlay={this.playAudioSlowly.bind(this, 2)}>
            {!audioPrepared && <ActivityIndicator color="white" />}
          </PlayButton>
        </View>
      </View>
    );
  };

  renderQuestionTitle = () => {
    let {title, phrase} = this.state;
    return (
      <View style={[s.mb20]}>
        <Text style={[s.textGray]}>{title}</Text>
        <Text fontWeight="700" style={[s.textGray, s.f22, s.mt10]}>
          {phrase}
        </Text>
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
          <View style={[s.flex1, s.jc]}>{this.renderOptions()}</View>
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

ChooseAudio.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ChooseAudio;
