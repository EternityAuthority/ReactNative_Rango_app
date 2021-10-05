import React from 'react';
import {StatusBar} from 'react-native';
import {withContext} from '../../lib/AppContext';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container';
import Loading from '../../components/Loading';
import QuestionService from '../../lib/QuestionService';

class QuizLoad extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
  }

  componentDidMount() {
    this.fetchQuestion();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  /**
   * Instead of curTargetLanguage fetch the question from params this will be helpful to
   * restart any previus lessons.
   */
  fetchQuestion = async () => {
    let {navigation, context, route} = this.props;
    let {curTargetLanguage} = context;
    let {params} = route;
    let {lessonPath, mode} = params;
    let {user, language} = context;
    let qService = new QuestionService(lessonPath, language);
    let dPromise = [
      firestore().doc(lessonPath).get(),
      firestore().doc('rewards/settings').get(),
      firestore().doc('funnymoves/moves').get(),
      qService.get(),
    ];

    let dProRes = await Promise.all(dPromise);
    let lesson = dProRes[0].data();
    lesson.path = lessonPath;
    let rewardsconfig = dProRes[1].data();
    let successwords = dProRes[2].data().options;
    let questions = dProRes[3];
    let unitPath = dProRes[0].ref.parent.parent.parent.parent.path;
    let unit = (await firestore().doc(unitPath).get()).data();
    navigation.replace('QuizStart', {
      questions,
      language,
      successwords,
      rewardsconfig,
      lesson,
      unit,
      mode: mode,
      user: {
        uid: user.uid,
        isPro: user.isPro,
        health: user.health,
        displayName: user.displayName,
      },
      gems: curTargetLanguage.gems,
    });
  };

  render() {
    return (
      <Container>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Loading />
      </Container>
    );
  }
}

export default withContext(QuizLoad);
