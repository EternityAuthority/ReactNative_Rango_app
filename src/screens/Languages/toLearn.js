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
import {t} from '../../locale';
class ToLearn extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {user} = props.context;
    this.state = {
      language: user.curtargetlanguage || {},
      languages: [],
      loading: true,
    };
    this.languageRef = firestore()
      .collection('languages')
      .where('published', '==', true)
      .where('tolearn', '==', true);
    this.userRef = firestore().collection('users').doc(user.uid);
    this.userTargetLangRef = this.userRef.collection('targetlanguage');
  }

  /** Fetches the to learn languages for the flatlist */
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
   * The target language is the first target language. Altough user can multiple taget languages.
   */
  saveLanguage = async (next) => {
    let {language} = this.state;
    if (language && language.key) {
      try {
        const langDocPath = `languages/${language.key}`;
        let langDoc = firestore().doc(langDocPath);
        await this.userRef.set(
          {curtargetlanguage: langDoc, curtargetlanguagekey: language.key},
          {merge: true},
        );
        let targetLangDoc = this.userTargetLangRef.doc(language.key);
        let existingSnap = await targetLangDoc.get();
        if (!existingSnap || !existingSnap.exists) {
          await targetLangDoc.set({
            language: langDoc,
            key: language.key,
          });
        }
        next();
        let {navigation} = this.props;
        navigation.navigate('NativeLanguage');
      } catch (error) {
        console.error(error);
        next();
      }
    } else {
      next();
    }
  };

  selectLanguage = (item) => {
    this.updateState({language: item});
  };

  renderItem = ({item}) => {
    let {language} = this.state;
    let {cc, name} = item;
    let selected = item.key === language.key;
    return (
      <LanguageListItem
        code={cc}
        name={name}
        selected={selected}
        onPress={this.selectLanguage.bind(this, item)}
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
        <Header noHeader={true} menu={false} hasTabs={false} />
        <SafeAreaView style={[s.flex1]}>
          <View style={[s.flex0, s.p5p, s.pt0]}>
            <Text fontWeight="700" style={[s.textGrayDark, s.f22]}>
              {t('language_want_to_learn')}
            </Text>
          </View>
          <FlatList
            data={languages}
            refreshing={loading}
            onRefresh={() => {}}
            keyExtractor={(item, i) => `listl${i}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.itemSeparatorComponent}
            contentContainerStyle={[s.flexGrow, s.pt20]}
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

export default withContext(ToLearn);
