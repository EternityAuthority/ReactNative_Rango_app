import React, {PureComponent} from 'react';
import {ImageBackground} from 'react-native';
import Button from '../../components/Button';
import Text from '../../components/Text';
import {withContext} from '../../lib/AppContext';
import firestore from '@react-native-firebase/firestore';
import ButtonText from '../../components/Text/buttonText';
import s from '../../assets/styles';
import {t} from '../../locale';
import {View} from 'native-base';
import {QUIZ_MODE} from '../../lib/Constants';

class GatesSplash extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {params = {}} = this.props.route;
    let {splash} = params;
    this.splash = splash;
  }

  /**
   * Udated the visited in the db and navigate to quiz
   */
  startQuiz = () => {
    let {navigation, context} = this.props;
    let {user, curTargetLanguage} = context;
    let {gatekey} = this.splash;
    firestore()
      .doc(`users/${user.uid}`)
      .collection('visitedgates')
      .doc(gatekey)
      .set({visited: true});
    navigation.replace('Quiz', {
      mode: QUIZ_MODE.TEST,
      lessonPath: curTargetLanguage.lesson.path,
    });
  };

  render() {
    let {url, title, description} = this.splash;
    return (
      <ImageBackground source={{uri: url}} style={[s.flex1]} resizeMode="cover">
        <View style={[s.flex1, s.flexColumn, s.jb, s.bgBlack4]}>
          <View style={[s.m10p]}>
            {!!title && (
              <Text fontWeight="700" style={[s.f30, s.textCenter, s.textWhite]}>
                {title}
              </Text>
            )}
            {!!description && (
              <Text style={[s.mt5, s.mb10p, s.f18, s.textCenter, s.textWhite]}>
                {description}
              </Text>
            )}
            <Button
              stretch={true}
              progress={false}
              style={[s.mb15p, s.mt10p]}
              onPress={this.startQuiz}>
              <ButtonText>{t('start')}</ButtonText>
            </Button>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default withContext(GatesSplash);
