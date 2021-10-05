import React from 'react';
import {View} from 'native-base';
import {FlatList, SafeAreaView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container';
import Header from '../../components/Header/secondary';
import Text from '../../components/Text';
import LanguageListItem from '../../components/ListItem/language';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {setLocale, t} from '../../locale';
import Utils from '../../lib/Utils';

const ENGLISH_KEY = 'wMBgRkoAjlnq1mmI1mYP';

class NativeLanguage extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {user} = props.context;
    this.state = {
      languagekey: user.nativelanguage ? user.nativelanguage.id : null,
      languages: [],
      loading: true,
    };
    this.languageRef = firestore()
      .collection('languages')
      .where('published', '==', true)
      .where('nativelanguage', '==', true);
    this.userRef = firestore().collection('users').doc(user.uid);
    this.targetlangRef = firestore().doc(`languages/${ENGLISH_KEY}`);
    this.userTargetLang = this.userRef
      .collection('targetlanguage')
      .doc(ENGLISH_KEY);
  }

  /**
   * Fetches the native languages for the flatlist.
   */
  componentDidMount() {
    this.languageRef.get().then((snap) => {
      if (!snap.empty) {
        let languages = [];
        snap.forEach((data, i) => {
          languages.push(data.data());
        });
        this.updateState({languages, loading: false});
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  /** Saves the user preferred language in the db
   * we are hard coding here the the enlish language as target language,
   * remove this when we have multple to learn languages.
   */
  saveLanguage = async (next) => {
    let {languagekey} = this.state;
    let {user} = this.props.context;
    if (languagekey) {
      try {
        const nativeLangDoc = firestore().doc(`languages/${languagekey}`);
        const nativeLanguage = (await nativeLangDoc.get()).data();
        let dataToUpdate = {
          curtargetlanguage: this.targetlangRef,
          curtargetlanguagekey: ENGLISH_KEY,
          nativelanguage: nativeLangDoc,
        };
        if (!user.cc) {
          dataToUpdate.cc = nativeLanguage.cc;
          try {
            let locationData = await Utils.get('https://ipapi.co/json');
            if (locationData) {
              dataToUpdate.cc = locationData.country_code;
            }
          } catch (error) {}
        }
        await this.userRef.set(dataToUpdate, {merge: true});
        setLocale(nativeLanguage);
        next();
        let {navigation} = this.props;
        navigation.navigate('LearningGoals', {nativelanguage: nativeLanguage});
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  };

  selectLanguage = (languagekey) => {
    this.updateState({languagekey: languagekey});
  };

  renderItem = ({item}) => {
    let {languagekey} = this.state;
    let {cc, name} = item;
    let selected = item.key === languagekey;
    return (
      <LanguageListItem
        code={cc}
        name={name}
        languagekey={item.key}
        selected={selected}
        onPress={this.selectLanguage}
      />
    );
  };

  itemSeparatorComponent = () => {
    return <View style={s.hr} />;
  };

  render() {
    let {languages, loading} = this.state;
    return (
      <Container style={[s.bgWhite]}>
        <Header menu={false} noHeader={true} hasTabs={false} />
        <SafeAreaView style={[s.flex1]}>
          <View style={[s.flex0, s.p5p, s.pt0]}>
            <Text fontWeight="700" style={[s.textGrayDark, s.f22]}>
              {t('your_native_language')}
            </Text>
          </View>
          <FlatList
            data={languages}
            refreshing={loading}
            keyExtractor={(item) => `listl${item.key}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.itemSeparatorComponent}
            contentContainerStyle={[s.flexGrow]}
          />
          <View style={[s.flex0, s.p5p]}>
            <Button stretch={true} progress={true} onPress={this.saveLanguage}>
              <ButtonText>{t('continue')}</ButtonText>
            </Button>
          </View>
        </SafeAreaView>
      </Container>
    );
  }
}

export default withContext(NativeLanguage);
