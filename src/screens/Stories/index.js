import React, {PureComponent} from 'react';
import {withContext} from '../../lib/AppContext';
import {View} from 'native-base';
import Container from '../../components/Container';
import Image from '../../components/Image';
import Text from '../../components/Text';
import {SafeAreaView, ScrollView} from 'react-native';
import s from '../../assets/styles';
import {t} from '../../locale';
import StoryParagraph from '../../components/StoryParagraph';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {QUIZ_MODE} from '../../lib/Constants';

class Stories extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {params = {}} = props.route;
    let {lesson} = params;
    this.lesson = lesson;
    let {paragraph = []} = lesson;
    this.state = {
      autoplay: true,
      playIndex: 0,
      maxIndex: paragraph.length,
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  playNext = () => {
    let {playIndex, maxIndex, autoplay} = this.state;
    if (playIndex < maxIndex && autoplay) {
      this.updateState({playIndex: ++playIndex});
    } else {
      this.updateState({playIndex: -1});
    }
  };

  onPlay = (index) => {
    let {playIndex} = this.state;
    if (playIndex === index) {
      //this is already playing
      this.updateState({autoplay: false, playIndex: -1});
    } else {
      this.updateState({autoplay: false, playIndex: index});
    }
  };

  stopAutoplay = () => {
    this.updateState({autoplay: false});
  };

  getLesson = () => {
    let {params = {}} = this.props.route;
    let {lesson} = params;
    return lesson;
  };

  loadStoryQuestion = (next) => {
    let {navigation} = this.props;
    let lesson = this.getLesson();
    navigation.replace('Quiz', {
      lessonPath: lesson.path,
      mode: QUIZ_MODE.TEST,
    });
  };

  render() {
    let lesson = this.getLesson();
    let {context} = this.props;
    let {language} = context;
    let {storyimage, storytitle, paragraph} = lesson;
    let {playIndex} = this.state;
    return (
      <Container header="none" style={[s.bgWhite]}>
        <ScrollView style={[s.flexGrow]}>
          <Image
            source={storyimage}
            style={[s.w100p, s.aspect_4_3]}
            resizeMode="cover"
          />
          <Text
            fontWeight="700"
            style={[s.textCenter, s.textPrimaryDark, s.mt20, s.f18]}>
            {storytitle}
          </Text>
          <View style={[s.m5p]}>
            {paragraph.map((p, i) => {
              let {defaultText, name, audioURL} = p;
              let playing = i === playIndex;
              return (
                <StoryParagraph
                  key={`story_${i}`}
                  index={i}
                  defaultText={defaultText}
                  name={name}
                  audioURL={audioURL}
                  language={language}
                  playing={playing}
                  onPlay={this.onPlay}
                  playNext={this.playNext}
                />
              );
            })}
          </View>
        </ScrollView>
        <SafeAreaView style={[s.flex0]}>
          <View style={[s.m5p]}>
            <Button
              stretch={true}
              progress={true}
              onPress={this.loadStoryQuestion}>
              <ButtonText>{t('practice')}</ButtonText>
            </Button>
          </View>
        </SafeAreaView>
      </Container>
    );
  }
}

export default withContext(Stories);
