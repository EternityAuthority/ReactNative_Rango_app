import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import ImageQuestionOption from '../ListItem/imageQuestionOption';
import AudioService from '../../lib/AudioService';

class ChooseCorrectOne extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    let langCode = getLangCode();
    let {question, language} = props;
    let {options, defaultText, questionText, name, questionsName} = question;
    let title = name[langCode] || defaultText;
    let phrase = questionsName[langCode] || questionText;
    this.state = {
      options: options,
      title: title,
      phrase: phrase,
    };
    this.audioService = new AudioService(options, language.code);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audioService.destroy();
  }

  /** Rerender is only required when it becomes active or currently playing in the state changes */
  shouldComponentUpdate(nextProps, nextState) {
    let {activeScreen} = nextProps;
    let {playing} = this.state;
    if (activeScreen || playing !== nextState.playing) {
      return true;
    }
    return false;
  }

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

  playAudio = (optionIndex) => {
    this.updateState({playing: optionIndex});
    this.audioService.playIndex(optionIndex);
  };

  renderOptions = () => {
    let {language} = this.props;
    let {options, playing} = this.state;
    let toLearnCode = language.code;
    let views = [];
    for (var i = 0; i < options.length; i += 2) {
      let option1 = options[i];
      let option2 = options[i + 1];
      views.push(
        <View key={`option_${i}`} style={[s.flexRow, s.mt20]}>
          <View style={s.flex1}>
            <ImageQuestionOption
              primaryText={option1.name[toLearnCode] || option1.defaultText}
              imageURL={option1.imageURL}
              clickable={true}
              selected={i === playing}
              onPress={this.playAudio.bind(this, i)}
            />
          </View>
          <View style={[s.p10]} />
          <View style={s.flex1}>
            <ImageQuestionOption
              primaryText={option2.name[toLearnCode] || option2.defaultText}
              imageURL={option2.imageURL}
              clickable={true}
              selected={i + 1 === playing}
              onPress={this.playAudio.bind(this, i + 1)}
            />
          </View>
        </View>,
      );
    }
    return views;
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
          {this.renderOptions()}
        </ScrollView>
        <View style={[s.flex0, s.ps30, s.pe30, s.pb20, s.pt10]}>
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

ChooseCorrectOne.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ChooseCorrectOne;
