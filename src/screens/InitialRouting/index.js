import React from 'react';
import {View} from 'native-base';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import Button from '../../components/Button';
import Text from '../../components/Text';
import ButtonText from '../../components/Text/buttonText';
import s from '../../assets/styles';
import {t} from '../../locale';
import {Image} from 'react-native';

class InitialRouting extends ParentComponent {
  constructor(props) {
    super(props);
  }

  loadLogin = () => {
    let {navigation} = this.props;
    navigation.navigate('Login');
  };

  loadSignup = () => {
    let {navigation} = this.props;
    navigation.navigate('Signup');
  };

  renderContent = () => {
    return (
      <>
        <Image
          source={require('../../assets/images/langoostart.png')}
          resizeMode="contain"
          style={[s.img200]}
        />
        <Text style={[s.textGray, s.mt20, s.f18]}>{t('learn_as_a_game')}</Text>
      </>
    );
  };

  renderActionButtons = () => {
    return (
      <>
        <Button stretch={true} onPress={this.loadSignup}>
          <ButtonText>{t('get_started')}</ButtonText>
        </Button>
        <Button
          type="ice"
          stretch={true}
          style={[s.mt20]}
          onPress={this.loadLogin}>
          <ButtonText style={[s.textPrimary]}>
            {t('i_have_an_account')}
          </ButtonText>
        </Button>
      </>
    );
  };

  render() {
    return (
      <Container noHeader={true}>
        <View style={[s.flex1, s.p10p]}>
          <View style={[s.flex1, s.jcac]}>{this.renderContent()}</View>
          <View style={[s.flex0]}>{this.renderActionButtons()}</View>
        </View>
      </Container>
    );
  }
}

export default InitialRouting;
