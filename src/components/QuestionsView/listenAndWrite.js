import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, Keyboard, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import Button from '../Button';
import TextArea from '../TextArea';
import ButtonText from '../Text/buttonText';
import {Player} from '@react-native-community/audio-toolkit';
import PlayButton from '../Button/playButton';

class ListenAndWrite extends Component {
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
      value: '',
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

  shouldComponentUpdate(nextProps, nextState) {
    let {activeScreen} = nextProps;
    let {audioPrepared} = this.state;
    if (activeScreen || audioPrepared !== nextState.audioPrepared) {
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

  updateValue = (val) => {
    this.updateState({value: val});
  };

  onPress = () => {
    let {onContinue} = this.props;
    if (onContinue) {
      this.audioPlayer.stop();
      let {value, phrase} = this.state;
      Keyboard.dismiss();
      onContinue(value, phrase);
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
    let {language} = this.props;
    let {value} = this.state;
    let isOptionSelected = value && value.length > 0;
    return (
      <View style={[s.flex1]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[s.p30, s.pt10, s.flexGrow]}>
          {this.renderQuestionTitle()}
          <View style={[s.bgIce, s.br10, s.p10, s.mt20]}>
            <TextArea
              value={value}
              onChangeText={this.updateValue}
              language={language}
              placeholder={t('write_here')}
            />
          </View>
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

ListenAndWrite.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ListenAndWrite;
