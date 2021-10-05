import React from 'react';
import {View} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t} from '../../locale';
import Text from '../../components/Text';
import Textarea from '../../components/TextArea';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {ScrollView} from 'react-native';
import ParentComponent from '../../components/ParentComponent';

class Feedback extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      feedback: '',
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

  updateFeeback = (text) => {
    this.updateState({feedback: text});
  };

  save = async (next) => {
    let {feedback} = this.state;
    if (feedback) {
      this.updateState({feedback: ''});
      let {user} = this.props.context;
      await firestore()
        .collection('feedbacks')
        .doc()
        .set({
          user: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          },
          feedback: feedback,
          createdAt: firestore.FieldValue.serverTimestamp(),
          resolved: false,
        });
      this.toastSuccess(t('feedback_sent'));
    }
    next();
  };

  customFooter = () => {
    return (
      <View style={[s.p10p]}>
        <Button stretch={true} progress={true} onPress={this.save}>
          <ButtonText>{t('send')}</ButtonText>
        </Button>
      </View>
    );
  };

  render() {
    let {feedback} = this.state;
    return (
      <Container
        header="blue"
        title={t('contact_support')}
        style={[s.bgWhite]}
        avoidScrollView={true}
        customFooter={this.customFooter}>
        <ScrollView
          contentContainerStyle={[s.flexGrow, s.p10p, s.pt10, s.pb10, s.jcac]}>
          <LottieView
            style={[s.img150, s.mt10]}
            resizeMode="contain"
            source={require('../../assets/animations/feedback.json')}
            autoPlay
            loop
          />
          <Text fontWeight="700" style={[s.textGray, s.f22, s.mt10p]}>
            {t('your_feedback_des')}
          </Text>
          <View style={[s.mt10p, s.w100p, s.bgIceLight, s.p10, s.br10]}>
            <Textarea
              style={[s.h150]}
              value={feedback}
              onChangeText={this.updateFeeback}
            />
          </View>
        </ScrollView>
      </Container>
    );
  }
}

export default withContext(Feedback);
