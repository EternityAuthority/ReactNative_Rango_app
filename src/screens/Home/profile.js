import React from 'react';
import {View} from 'native-base';
import {ScrollView} from 'react-native';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t} from '../../locale';
import User from '../../components/User';

class Profile extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      language: {},
      loading: true,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  render() {
    let {navigation, context} = this.props;
    let {user, curTargetLanguage} = context;
    let {displayName, photoURL, uid, cc} = user;
    return (
      <Container
        header="blue"
        menu={true}
        title={t('profile')}
        avoidScrollView={true}>
        <View style={[s.bgPrimaryDark, s.abs, s.w100p, s.h100]} />
        <ScrollView contentContainerStyle={[s.flexGrow, s.pb20]}>
          <User
            invitecode={user.invitecode}
            displayName={displayName}
            photoURL={photoURL}
            loggeduid={uid}
            uid={uid}
            cc={cc}
            navigation={navigation}
            languagekey={curTargetLanguage.key}
            trophy={curTargetLanguage.trophy}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default withContext(Profile);
