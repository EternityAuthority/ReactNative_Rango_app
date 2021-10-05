import React, {Component} from 'react';
import {
  DeviceEventEmitter,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import {Player} from '@react-native-community/audio-toolkit';
import VoiceService from '../../lib/VoiceService';
import PlayButton from '../Button/playButton';
import IconMoon from '../Icon/moon';

class ListenAndRecord extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    let langCode = getLangCode();
    let {question, language} = props;
    let {defaultText, questionText, name, questionsName, audioURL} = question;
    let title = name[langCode] || defaultText;
    let phrase = questionsName[language.code] || questionText;
    this.state = {
      title: title,
      phrase: phrase,
      recording: false,
      audioPrepared: false,
    };
    this.audioPlayer = new Player(audioURL[language.code], {
      autoDestroy: false,
    });
    this.audioPlayer.prepare(this.allAudioPrepared);
    this.autoPlayed = false;
    this.voiceService = new VoiceService();
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    let {activeScreen} = this.props;
    let {audioPrepared} = this.state;
    if (activeScreen && audioPrepared && !this.autoPlayed) {
      this.autoPlayed = true;
      this.playAudio();
      this.speechListener = DeviceEventEmitter.addListener(
        'voiceCommandEmitter',
        this.onSpeechResults,
      );
    }
    if (prevProps.activeScreen && !activeScreen) {
      if (this.speechListener) {
        this.speechListener.remove();
        this.speechListener = null;
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audioPlayer.destroy();
    this.stopRecording();
    this.voiceService.destroy();
    if (this.speechListener) {
      this.speechListener.remove();
    }
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  allAudioPrepared = () => {
    this.updateState({audioPrepared: true});
  };

  onSpeechResults = ({value}) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.stopRecording();
      let {onContinue} = this.props;
      if (onContinue) {
        this.audioPlayer.stop();
        let {phrase} = this.state;
        onContinue(value, phrase);
      }
    }, 500);
  };

  playAudio = () => {
    this.stopRecording();
    let {audioPrepared} = this.state;
    if (audioPrepared) {
      this.audioPlayer.speed = 1;
      this.audioPlayer.play();
    }
  };

  playAudioSlowly = () => {
    this.stopRecording();
    let {audioPrepared} = this.state;
    if (audioPrepared) {
      this.audioPlayer.speed = 0.5;
      this.audioPlayer.play();
    }
  };

  startRecording = async () => {
    try {
      let {language} = this.props;
      let langCCCode = `${language.code}_${language.cc.toUpperCase()}`;
      await this.voiceService.start(langCCCode);
      this.updateState({recording: true});
    } catch (e) {
      console.log(e);
    }
  };

  stopRecording = async () => {
    this.updateState({recording: false});
    try {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      await this.voiceService.stop();
    } catch (e) {
      console.log(e);
    }
  };

  toggleRecording = () => {
    let {recording} = this.state;
    if (recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  onSkip = () => {
    let {onContinue} = this.props;
    if (onContinue) {
      this.audioPlayer.stop();
      this.stopRecording();
      onContinue();
    }
  };

  renderQuestionTitle = () => {
    let {title} = this.state;
    return (
      <View style={[s.mb20]}>
        <Text style={[s.textGray, s.bold, s.f22]}>{title}</Text>
      </View>
    );
  };

  render() {
    let {recording, audioPrepared} = this.state;
    return (
      <View style={[s.flex1]}>
        <ScrollView contentContainerStyle={[s.p30, s.pt10, s.flexGrow]}>
          {this.renderQuestionTitle()}
          <View style={[s.jcac, s.flex1, s.mt20]}>
            <PlayButton
              size={110}
              onPlay={this.playAudio}
              onSlowPlay={this.playAudioSlowly}>
              {!audioPrepared && <ActivityIndicator color="white" />}
            </PlayButton>
            <PlayButton
              size={150}
              iconName="microphone-black-shape"
              shadowHeight={5}
              style={[s.mt40]}
              onPlay={this.toggleRecording}>
              {recording && (
                <LottieView
                  style={[s.hw70]}
                  resizeMode="contain"
                  source={require('../../assets/animations/audio.json')}
                  autoPlay
                  loop
                />
              )}
              {!recording && (
                <IconMoon
                  name="microphone-black-shape"
                  style={[s.textWhite, s.f35]}
                />
              )}
            </PlayButton>
          </View>
        </ScrollView>
        <View style={[s.flex0, s.ps30, s.pe30, s.pb20, s.pt10]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[s.mb15]}
            onPress={this.onSkip}>
            <Text style={[s.textCenter, s.textGray, s.f14]}>
              {t('cant_record_now')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

ListenAndRecord.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ListenAndRecord;
