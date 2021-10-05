import React, {Component} from 'react';
import {ScrollView, Animated, View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import Button from '../Button';
import ButtonText from '../Text/buttonText';
import Word from '../ListItem/word';
import Utils from '../../lib/Utils';
import {Player} from '@react-native-community/audio-toolkit';
import PlayButton from '../Button/playButton';

const LINE = {
  borderBottomWidth: 1,
  borderBottomColor: '#DFDFDF',
};

class ListenAndArrange extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    let langCode = getLangCode();
    let {question, language} = this.props;
    let {questionsName, questionText, defaultText, name, audioURL} = question;
    let title = name[langCode] || defaultText;
    let phraseNative = (questionsName[langCode] || questionText).trim();
    let phrase = (questionsName[language.code] || questionText).trim();
    this.state = {
      title: title,
      phrase: phraseNative,
      phraseTarget: phrase,
      question: questionsName,
      allRendered: false,
      selected: [],
      animating: false,
    };
    /** Captures the count of prefetch word renders */
    this.wordRendered = new Set();
    this.wordBankLayout = null;
    this.activeoption = null;
    this.options = this.getOptions(phrase);
    this.audioPlayer = new Player(audioURL[language.code], {
      autoDestroy: false,
    });
    this.audioPlayer.prepare(this.allAudioPrepared);
    this.autoPlayed = false;
  }

  getOptions = (phrase) => {
    let options = phrase.split(/\s+/);
    let suffled = Utils.shuffle(options);
    let finaled = [];
    suffled.forEach((text, i) => {
      finaled.push({
        text: text,
        index: i,
        hidden: false,
      });
    });
    return finaled;
  };

  allAudioPrepared = () => {
    this.updateState({audioPrepared: true});
  };

  componentDidUpdate(prevProps) {
    let {activeScreen} = this.props;
    let {audioPrepared} = this.state;
    if (activeScreen && audioPrepared && !this.autoPlayed) {
      this.autoPlayed = true;
      this.playAudio();
    }
    let {animating} = this.state;
    let {activeoption} = this;
    if (animating && activeoption && activeoption.start && activeoption.end) {
      Animated.timing(activeoption.start, {
        toValue: activeoption.end,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        let {options} = this;
        let {selected} = this.state;
        let beingRemoved = true;
        selected.forEach((sl) => {
          sl.hidden = false;
          if (sl.index === activeoption.index) {
            beingRemoved = false;
          }
        });
        if (beingRemoved) {
          options[activeoption.index].hidden = false;
        }
        this.activeoption = null;
        this.updateState({animating: false, selected: selected});
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let {activeScreen} = nextProps;
    let {animating, allRendered, selected, audioPrepared} = this.state;
    if (
      activeScreen ||
      animating !== nextState.animating ||
      allRendered !== nextState.allRendered ||
      audioPrepared !== nextState.audioPrepared ||
      selected !== nextState.selected
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audioPlayer.destroy();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onPress = () => {
    let {onContinue} = this.props;
    let {selected, phraseTarget} = this.state;
    if (onContinue) {
      this.audioPlayer.stop();
      let selectedAnswer = selected.map((sel) => sel.text).join(' ');
      let correctAnswer = phraseTarget;
      onContinue(selectedAnswer, correctAnswer);
    }
  };

  playAudio = () => {
    if (this.audioPlayer.isPlaying) {
      this.audioPlayer.stop();
    }
    this.audioPlayer.speed = 1;
    this.audioPlayer.play();
  };

  playAudioSlowly = () => {
    if (this.audioPlayer.isPlaying) {
      this.audioPlayer.stop();
    }
    this.audioPlayer.speed = 0.5;
    this.audioPlayer.play();
  };

  wordBankLayoutCompute = (event) => {
    let {allRendered} = this.state;
    if (!allRendered) {
      let {x, y, width, height} = event.nativeEvent.layout;
      this.wordBankLayout = {x, y, width, height};
    }
  };

  onWordBankWordLayoutCompute = (index, event) => {
    let {allRendered} = this.state;
    if (!allRendered) {
      let {options} = this;
      let {x, y, width, height} = event.nativeEvent.layout;
      let option = options[index];
      option.sourceOffset = {x, y, width, height};
      this.wordRendered.add(index);
      if (this.wordRendered.size === options.length) {
        //Means all words has been rendered
        setTimeout(() => {
          this.wordBankLayout.wordHeight = height;
          this.wordBankLayout.height += height;
          this.wordBankLayout.lines = Math.floor(
            this.wordBankLayout.height / height,
          );
          //For all the options loop and set the top y offset
          options.forEach((o) => {
            o.sourceOffset.y += this.wordBankLayout.height + 20;
          });
          this.updateState({allRendered: true});
        }, 50);
      }
    }
  };

  onSelectedBankWordLayoutCompute = (index, event) => {
    let {x, y, width, height} = event.nativeEvent.layout;
    let {selected} = this.state;
    let {activeoption} = this;
    let selectionOption = selected[index];
    selectionOption.offset = {x, y, width, height};
    if (activeoption && activeoption.index === selectionOption.index) {
      activeoption.end = {x, y, width, height};
      this.updateState({animating: true, selected});
    }
  };

  moveOptionToSelected = (optionIndex) => {
    let {options} = this;
    let {selected} = this.state;
    let option = options[optionIndex];
    option.hidden = true;
    this.activeoption = {
      ...option,
      start: new Animated.ValueXY({
        x: option.sourceOffset.x,
        y: option.sourceOffset.y,
      }),
    };
    selected.push({...option});
    this.updateState({selected});
  };

  removeOptionFromSelected = (wordIndex) => {
    let {options} = this;
    let {selected, animating} = this.state;
    let selectedOption = selected[wordIndex];
    let option = options[selectedOption.index];
    if (animating) {
      option.hidden = false;
    }
    this.activeoption = {
      ...option,
      start: new Animated.ValueXY({
        x: selectedOption.offset.x,
        y: selectedOption.offset.y,
      }),
      end: option.sourceOffset,
    };
    selected.splice(wordIndex, 1);
    this.updateState({selected, animating: true});
  };

  renderOptions = () => {
    let {options} = this;
    return options.map((option) => {
      let {index, text, hidden} = option;
      return (
        <Word
          key={`option_${index}`}
          text={text}
          hidden={hidden}
          onLayout={this.onWordBankWordLayoutCompute.bind(this, index)}
          onPress={this.moveOptionToSelected.bind(this, index)}
        />
      );
    });
  };

  renderSelectedOptions = () => {
    let {selected} = this.state;
    return selected.map((option, index) => {
      return (
        <Word
          key={`r_option_${index}`}
          text={option.text}
          hidden={option.hidden}
          textStyle={[s.textPrimary]}
          onLayout={this.onSelectedBankWordLayoutCompute.bind(this, index)}
          onPress={this.removeOptionFromSelected.bind(this, index)}
        />
      );
    });
  };

  renderAnimatedWordTile = () => {
    let {activeoption} = this;
    let {animating} = this.state;
    if (animating && activeoption && activeoption.start && activeoption.end) {
      return (
        <Animated.View
          style={[
            s.abs,
            {
              transform: [
                {translateX: activeoption.start.x},
                {translateY: activeoption.start.y},
              ],
            },
          ]}>
          <Word text={activeoption.text} />
        </Animated.View>
      );
    } else {
      return null;
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

  renderBackgroundLines = () => {
    let {wordBankLayout} = this;
    let top = 0;
    let lines = wordBankLayout.lines;
    if (lines > 3) {
      lines = 3;
    }
    return Array.from(Array(lines)).map((_, i) => {
      if (i > 0) {
        top += wordBankLayout.wordHeight;
      }
      return (
        <View
          key={`arg${i}`}
          style={[
            s.abs,
            s.w100p,
            LINE,
            {top: top},
            {height: wordBankLayout.wordHeight},
          ]}
        />
      );
    });
  };

  render() {
    //console.log('listen and arrange');
    let {wordBankLayout} = this;
    let {allRendered, selected} = this.state;
    let isOptionSelected = selected.length > 0;
    return (
      <View style={[s.flex1]}>
        <ScrollView contentContainerStyle={[s.p30, s.pt10, s.flexGrow]}>
          {this.renderQuestionTitle()}
          <View>
            {allRendered && (
              <View style={[s.flexWrap, {height: wordBankLayout.height}]}>
                {this.renderBackgroundLines()}
                {this.renderSelectedOptions()}
              </View>
            )}
            <View
              style={[s.flexWrap, s.jc, s.mt20]}
              onLayout={this.wordBankLayoutCompute}>
              {this.renderOptions()}
            </View>
            {this.renderAnimatedWordTile()}
          </View>
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

ListenAndArrange.propTypes = {
  question: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ListenAndArrange;
