import React from 'react';
import {Header, View} from 'native-base';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  BackHandler,
} from 'react-native';
import Icon from '../../components/Icon';
import s from '../../assets/styles';
import Progress from '../../components/Progress';
import {QUESTION_TYPES} from '../../lib/Constants';
import Modal from 'react-native-modal';
import Text from '../../components/Text';
import ToKnow from '../../components/QuestionsView/toKnow';
import firestore from '@react-native-firebase/firestore';
import ChooseCorrectOne from '../../components/QuestionsView/chooseCorrectOne';
import TranslateThisWord from '../../components/QuestionsView/translateThisWord';
import FillinTheBlanks from '../../components/QuestionsView/fillinTheBlanks';
import ArrangeSentence from '../../components/QuestionsView/arrangeSentence';
import ListenAndChoose from '../../components/QuestionsView/listenAndChoose';
import ListenAndArrange from '../../components/QuestionsView/listenAndArrange';
import ListenAndWrite from '../../components/QuestionsView/listenAndWrite';
import ListenAndRecord from '../../components/QuestionsView/listenAndRecord';
import ChooseAudio from '../../components/QuestionsView/chooseAudio';
import Utils from '../../lib/Utils';
import QuitModal from '../../components/QuizModals/QuitModal';
import CorrectModal from '../../components/QuizModals/CorrectModal';
import IncorrectModal from '../../components/QuizModals/IncorrectModal';
import HealthOutModal from '../../components/QuizModals/HealthOutModal';
import {Player} from '@react-native-community/audio-toolkit';

const MODAL_CONTENT = {
  QUIT: 'quit',
  CORRECT: 'correct',
  CORRECT_TRY_AGAIN: 'correct_try',
  INCORRECT: 'incorrect',
  NOHEALTH: 'nohealth',
};

const REPEAT_LIMIT = __DEV__ ? 0 : 3;

class QuizStart extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {params = {}} = props.route;
    let {
      questions,
      language,
      rewardsconfig,
      successwords,
      user,
      lesson,
      unit,
      mode,
      gems,
    } = params;
    let width = Dimensions.get('window').width;
    this.state = {
      user: user,
      gems: gems,
      health: user.health,
      mode: mode,
      language: language,
      lesson: lesson,
      unit: unit,
      itemWidth: width,
      successwords: successwords,
      questions: [questions[0], questions[1]],
      page: -1,
      isModalVisible: false,
      modalcontent: MODAL_CONTENT.QUIT,
      useranswers: {
        languagekey: language.key,
        qsize: questions.length,
        correctcount: 0,
        answers: {},
      },
      rewardsconfig: rewardsconfig,
      adloaded: !global.adsService.isLoading(),
    };
    this.questions = questions;
    this.userRef = firestore().doc(`users/${user.uid}`);
    this.curTargetLangRef = firestore().doc(
      `users/${user.uid}/targetlanguage/${language.key}`,
    );
  }

  componentDidMount() {
    this.successAudio = new Player('correctanswer.mp3', {autoDestroy: false});
    this.failedAudio = new Player('wronganswer.mp3', {autoDestroy: false});
    this.successAudio.prepare();
    this.failedAudio.prepare();
    BackHandler.addEventListener('hardwareBackPress', this.toggleModal);
    global.adsService.addListener(this.onAdEvent);
    this.updateState({page: 0});
  }

  componentWillUnmount() {
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.toggleModal);
    global.adsService.removeListener(this.onAdEvent);
    this.successAudio.destroy();
    this.failedAudio.destroy();
  }

  onAdEvent = (status) => {
    if (status === 'finished') {
      this.onAdWatched();
    } else if (status === 'closed') {
      this.onAdClosed();
    } else if (status === 'loaded') {
      this.updateState({adloaded: true});
    } else if (status === 'loading') {
      this.updateState({adloaded: false});
    }
  };

  onShowAd = () => {
    this.updateState({isModalVisible: false}, () => {
      setTimeout(() => {
        global.adsService.show();
      }, 500);
    });
  };

  onAdWatched = () => {
    this.incrementHealth();
    this.loadNext();
  };

  onAdClosed = () => {
    this.updateState({
      modalcontent: MODAL_CONTENT.NOHEALTH,
      isModalVisible: true,
    });
  };

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onModalHide = () => {
    this.updateState({modalcontent: MODAL_CONTENT.QUIT});
  };

  toggleModal = () => {
    let {isModalVisible} = this.state;
    this.updateState({isModalVisible: !isModalVisible});
  };

  goToPro = () => {
    let {navigation} = this.props;
    this.updateState({isModalVisible: false}, () => {
      navigation.replace('UpgradeToPro');
    });
  };

  goScreenBack = () => {
    let {navigation} = this.props;
    this.updateState({isModalVisible: false}, () => {
      navigation.goBack();
    });
  };

  /**
   * Based on hanys feedback success word should be in target language
   * @returns
   */
  getRandomSuccessWord = () => {
    let {successwords, language} = this.state;
    const word = successwords[Math.floor(Math.random() * successwords.length)];
    let langCode = language.code; //getLangCode();
    let text = word.name[langCode] || word.defaultText;
    return text;
  };

  onValueChange = (key, value) => {
    this.updateState({[key]: value});
  };

  renderProgress = () => {
    let {page, user, health} = this.state;
    let progress = ((page + 1) / this.questions.length) * 100;
    return (
      <View style={[s.flexRow, s.ac]}>
        <View style={[s.flex0, s.pe10, s.ps10]}>
          <ImageBackground
            source={require('../../assets/images/health.png')}
            style={[s.hw30, s.jcac]}
            resizeMode="contain">
            {user.isPro && (
              <Icon
                name="infinity"
                type="FontAwesome5"
                style={[s.textWhite, s.f12]}
              />
            )}
            {!user.isPro && (
              <Text
                fontWeight="700"
                style={[s.textWhite, s.textShadow, s.montserrat]}>
                {health >= 0 ? health : 0}
              </Text>
            )}
          </ImageBackground>
        </View>
        <View style={[s.flex1]}>
          <Progress height={15} value={progress} hidepercent={true} />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[s.flex0, s.ps10, s.pe10]}
          onPress={this.toggleModal}>
          <Icon name="times" type="FontAwesome5" style={[s.textLight, s.f24]} />
        </TouchableOpacity>
      </View>
    );
  };

  incrementHealth = () => {
    let {health} = this.state;
    this.updateState({health: health + 1});
  };

  purchaseHealthByGems = () => {
    let {gems} = this.state;
    gems -= 50;
    this.updateState({gems, isModalVisible: false});
    this.curTargetLangRef.update({gems});
    this.loadNext();
  };

  /**
   * From incorrect will be true then its comming from failed modal continue press,
   * We have to check here for the health before moving forward
   * @param {*} fromIncorrect
   */
  loadNext = (fromIncorrect) => {
    let {page, questions, health, user} = this.state;
    if (fromIncorrect && !user.isPro && health <= 0) {
      this.updateState({
        isModalVisible: true,
        modalcontent: MODAL_CONTENT.NOHEALTH,
      });
    } else {
      ++page;
      let nextPage = page + 1;
      if (page < questions.length) {
        let stateObject = {page, isModalVisible: false};
        if (nextPage < this.questions.length) {
          questions.push(this.questions[nextPage]);
          stateObject.questions = questions;
        }
        this.updateState(stateObject);
        this.scrollRef.scrollToIndex({index: page});
      } else {
        //Quiz is complete, calculate score and redirect user to completion page
        this.updateState({isModalVisible: false});
        let {rewardsconfig, useranswers, lesson, unit, mode} = this.state;
        this.props.navigation.replace('QuizFinish', {
          rewardsconfig,
          useranswers,
          lesson,
          unit,
          mode,
        });
      }
    }
  };

  /**
   * If correctanswer is provided that means user has answerd to questions, else user wanted to skip this
   * Get current question and ansewer and feed it in the user answer column
   */
  onContinue = (selectedAnswer, correctAnswer) => {
    let {useranswers, user, page, questions, lesson, health} = this.state;
    let q = questions[page];
    if (correctAnswer) {
      let userAnswerObj = {};
      userAnswerObj.questionkey = q.key;
      userAnswerObj.questionpath = q.path;
      userAnswerObj.answer = correctAnswer;
      userAnswerObj.useranswer = selectedAnswer;
      useranswers.answers[q.key] = userAnswerObj;
      let mPercent = Utils.matchAnswer(selectedAnswer, correctAnswer, q.type);
      if (
        q.type === QUESTION_TYPES.listen_and_record &&
        mPercent > 20 &&
        mPercent < 100
      ) {
        //based on the new feedback from hany, record questions are always right if greater than 0
        useranswers.correctcount++;
        let randomSuccessText = `The answer is ${mPercent}% correct`;
        this.updateState({
          isModalVisible: true,
          modalcontent: MODAL_CONTENT.CORRECT_TRY_AGAIN,
          successText: randomSuccessText,
          useranswers: useranswers,
        });
        this.successAudio.play();
      } else if (mPercent === 100) {
        useranswers.correctcount++;
        let randomSuccessText = this.getRandomSuccessWord();
        this.updateState({
          isModalVisible: true,
          modalcontent: MODAL_CONTENT.CORRECT,
          successText: randomSuccessText,
          useranswers: useranswers,
        });
        this.successAudio.play();
      } else {
        /**
         * If user answer is wrong and its not unit test we have to repeat the question 3 times.
         * Clone this question and add it to the last
         */
        if (lesson.type !== 'unit_test' && q.repeat_count < REPEAT_LIMIT) {
          q.repeat_count++;
          this.questions.push({...q});
        }
        //Also decrease the health of the user, decrease on server when it is only greater that 0
        if (!user.isPro) {
          this.userRef.get().then((ussnap) => {
            let _user = ussnap.data();
            if (_user.health > 0) {
              this.userRef.update({health: firestore.FieldValue.increment(-1)});
            }
          });
          health--;
        }
        this.updateState({
          isModalVisible: true,
          modalcontent: MODAL_CONTENT.INCORRECT,
          failedText: correctAnswer, //+ ` (${selectedAnswer})`,
          useranswers: useranswers,
          health: health,
        });
        this.failedAudio.play();
      }
    } else {
      this.loadNext();
    }
  };

  renderQuestion = (question, language, page, index) => {
    let {type} = question;
    let activeScreen = page === index;
    switch (type) {
      case QUESTION_TYPES.to_know:
        return (
          <ToKnow
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.choose_correct_one:
        return (
          <ChooseCorrectOne
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.translate_this_word:
        return (
          <TranslateThisWord
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.fill_in_the_blanks:
        return (
          <FillinTheBlanks
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.arrange_sentence:
        return (
          <ArrangeSentence
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.listen_and_choose:
        return (
          <ListenAndChoose
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.listen_and_arrange:
        return (
          <ListenAndArrange
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.listen_and_write:
        return (
          <ListenAndWrite
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.listen_and_record:
        return (
          <ListenAndRecord
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      case QUESTION_TYPES.choose_audio:
        return (
          <ChooseAudio
            index={index}
            activeScreen={activeScreen}
            question={question}
            language={language}
            onContinue={this.onContinue}
          />
        );
      default:
        return null;
    }
  };

  renderItem = ({item, index}) => {
    let {itemWidth, language, page} = this.state;
    return (
      <View style={[s.flex1, {width: itemWidth}]}>
        {this.renderQuestion(item, language, page, index)}
      </View>
    );
  };

  renderModalContent = () => {
    let {
      modalcontent,
      questions,
      page,
      successText,
      failedText,
      language,
      user,
      adloaded,
      gems,
    } = this.state;
    let curQuestion = questions[page];
    switch (modalcontent) {
      case MODAL_CONTENT.QUIT:
        return (
          <QuitModal
            onContinue={this.goScreenBack}
            onCancel={this.toggleModal}
          />
        );
      case MODAL_CONTENT.CORRECT:
        return (
          <CorrectModal
            onContinue={this.loadNext}
            language={language}
            successText={successText}
            user={user}
            path={curQuestion.path}
          />
        );
      case MODAL_CONTENT.CORRECT_TRY_AGAIN:
        return (
          <CorrectModal
            onContinue={this.loadNext}
            language={language}
            successText={successText}
            user={user}
            path={curQuestion.path}
            tryagain={this.toggleModal}
          />
        );
      case MODAL_CONTENT.INCORRECT:
        return (
          <IncorrectModal
            onContinue={this.loadNext}
            failedText={failedText}
            user={user}
            path={curQuestion.path}
          />
        );
      case MODAL_CONTENT.NOHEALTH:
        return (
          <HealthOutModal
            onCancel={this.goScreenBack}
            onShowAd={this.onShowAd}
            onPro={this.goToPro}
            adloaded={adloaded}
            purchaseHealthByGems={this.purchaseHealthByGems}
            gems={gems}
          />
        );
    }
  };

  render() {
    let {questions, itemWidth, isModalVisible} = this.state;
    return (
      <Container header="none" avoidScrollView={true}>
        <Header transparent hasTabs={false} noShadow style={[s.flexColumn]}>
          <StatusBar
            hidden={false}
            translucent={true}
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <View style={[s.flex0]}>{this.renderProgress()}</View>
        </Header>
        <FlatList
          ref={(node) => (this.scrollRef = node)}
          initialNumToRender={2}
          //maxToRenderPerBatch={2}
          //updateCellsBatchingPeriod={100}
          data={questions}
          renderItem={this.renderItem}
          horizontal={true}
          scrollEnabled={false}
          contentContainerStyle={[s.flexGrow]}
          keyExtractor={(item, i) => `${item.key}_${i}`}
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemWidth}
          decelerationRate="fast"
        />
        <Modal
          isVisible={isModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          onModalHide={this.onModalHide}
          style={[s.m0, s.jb]}>
          <View style={[s.bgWhite, s.brTop15]}>
            {this.renderModalContent()}
          </View>
        </Modal>
      </Container>
    );
  }
}

export default QuizStart;
