import React from 'react';
import {View} from 'native-base';
import {ScrollView} from 'react-native';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t} from '../../locale';
import User from '../../components/User';

class UserDetails extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {route} = props;
    let {user} = route.params;
    this.state = {
      language: {},
      user: user,
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
    let {displayName, photoURL, uid, cc, trophy = 0} = this.state.user;
    return (
      <Container header="blue" title={t('profile')} avoidScrollView={true}>
        <View style={[s.bgPrimaryDark, s.abs, s.w100p, s.h100]} />
        <ScrollView contentContainerStyle={[s.flexGrow, s.pb20]}>
          <User
            invitecode={user.invitecode}
            displayName={displayName}
            photoURL={photoURL}
            loggeduid={user.uid}
            uid={uid}
            cc={cc}
            navigation={navigation}
            languagekey={curTargetLanguage.key}
            trophy={trophy}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default withContext(UserDetails);
