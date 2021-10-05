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

class FillInTheBlanks extends Component {
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
    };
    this.audioService = new AudioService(options, language.code);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audioService.destroy();
  }

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

  getQuestionPhrase = (replace) => {
    let {language} = this.props;
    const delimeter = '__';
    let {phrase} = this.state;
    if (replace) {
      return (
        <Text lang={language} fontWeight="700" style={[s.textGray, s.f22]}>
          {phrase.replace(delimeter, replace)}
        </Text>
      );
    } else {
      let phrases = phrase.split(/\s/g);
      return phrases.map((p, i) => {
        if (p === delimeter) {
          return (
            <React.Fragment key={`delim_${i}`} >
              <View style={[s.unline]}>
                <Text
                  lang={language}
                  fontWeight="700"
                  style={[s.textGray, s.f22]}>
                  {'          '}
                </Text>
              </View>
              <Text
                lang={language}
                fontWeight="700"
                style={[s.textGray, s.f22]}>
                {' '}
              </Text>
            </React.Fragment>
          );
        } else {
          return (
            <Text
              lang={language}
              key={`phrase_${i}`}
              fontWeight="700"
              style={[s.textGray, s.f22, s.mb5]}>
              {p}{' '}
            </Text>
          );
        }
      });
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
    let {options} = this.state;
    let toLearnCode = language.code;
    return options.map((option, i) => (
      <View key={`option_${i}`} style={[s.mt20]}>
        <ImageQuestionOption
          primaryText={option.name[toLearnCode] || option.defaultText}
          clickable={true}
          selected={i === this.state.playing}
          onPress={this.playAudio.bind(this, i)}
        />
      </View>
    ));
  };

  /** Fill in the blanks is in target lang */
  renderQuestionTitle = () => {
    let {language} = this.props;
    let {title, playing, options} = this.state;
    let phrase;
    if (playing >= 0) {
      phrase = this.getQuestionPhrase(options[playing].name[language.code]);
    } else {
      phrase = this.getQuestionPhrase();
    }
    return (
      <View style={[s.mb20]}>
        <Text style={[s.textGray]}>{title}</Text>
        <View style={[s.mt10, s.ac, s.flexWrap]}>{phrase}</View>
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

FillInTheBlanks.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default FillInTheBlanks;
