import React from 'react';
import {View} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native';
import s from '../../assets/styles';
import Wordbank from '../../components/ListItem/wordbank';
import Text from '../../components/Text';
import {t} from '../../locale';
import ParentComponent from '../../components/ParentComponent';

const LIMIT = 40;

class ToLearn extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {curTargetLanguage} = props;
    this.state = {
      data: [],
      loading: true,
    };
    this.userWordbankPath = `${curTargetLanguage.path}/wordbank`;
    this.wordsColl = firestore().collection(this.userWordbankPath);
    this.iknowcount = 0;
  }

  async componentDidMount() {
    let {data} = this.state;
    let {words, after} = await this.fetchNextDataSet();
    data.push(...words);
    this.updateState({data, after, loading: false});

    //Also subscribe for the total iknow value i have in my account
    this.wordsTotalUnsubs = this.wordsColl.doc('total').onSnapshot((snap) => {
      let total = snap.data();
      this.iknowcount = total.iknow || 0;
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.wordsTotalUnsubs) {
      this.wordsTotalUnsubs();
    }
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  /** Fetches the next list of data set of the word bank */
  fetchNextDataSet = async (after) => {
    let query = this.wordsColl
      .where('iknow', '==', false)
      .orderBy('defaultText');
    if (after) {
      query = query.startAfter(after);
    }
    let lastRef = null;
    let data = [];
    let wordsSnaps = await query.limit(LIMIT).get();
    if (wordsSnaps && !wordsSnaps.empty) {
      wordsSnaps.docs.forEach((wordSnap, i) => {
        if (wordsSnaps.size === LIMIT && i === wordsSnaps.size - 1) {
          lastRef = wordSnap;
        }
        let word = wordSnap.data();
        word.path = wordSnap.ref.path;
        data.push(word);
      });
    }
    return {words: data, after: lastRef};
  };

  onRefresh = async () => {
    this.updateState({after: null, loading: true});
    let data = [];
    let {words, after} = await this.fetchNextDataSet();
    data.push(...words);
    this.updateState({data, after, loading: false});
  };

  onEndReached = async () => {
    let {user} = this.props;
    if (user.isPro) {
      let {data, after} = this.state;
      if (after) {
        let res = await this.fetchNextDataSet(after);
        data.push(...res.words);
        after = res.after;
      }
      this.updateState({data, after});
    }
  };

  /**
   * If you are not pro then there is limit of how many words can be added
   */
  onCheckChange = (item) => {
    let {key} = item;
    let {data} = this.state;
    let {user} = this.props;
    if (this.iknowcount < LIMIT || user.isPro) {
      let index = data.findIndex((d) => d.key === key);
      data.splice(index, 1);
      this.updateState({data});
      let batch = firestore().batch();
      batch.update(this.wordsColl.doc(key), {iknow: true});
      batch.set(
        this.wordsColl.doc('total'),
        {iknow: firestore.FieldValue.increment(1)},
        {merge: true},
      );
      batch.commit();
    } else {
      this.toastError(t('upgrade_now_to_access'));
    }
  };

  renderItem = ({item}) => {
    let {language, langCode} = this.props;
    let {name, audioURL, key} = item;
    let text = name[language.code];
    let nativeText = name[langCode];
    let audio = audioURL[language.code];
    return (
      <Wordbank
        text={text}
        nativeText={nativeText}
        audioURL={audio}
        language={language}
        idkey={key}
        tooltiptext={t('difficulty_level')}
        onCheckChange={this.onCheckChange.bind(this, item)}
      />
    );
  };

  renderGap = () => {
    return <View style={[s.mb15]} />;
  };

  renderEmpty = () => {
    let {loading} = this.state;
    if (loading) {
      return null;
    }
    return (
      <View style={[s.mb15]}>
        <Text style={[s.textGray, s.textCenter, s.f14]}>
          {t('wordbank_empty_message')}
        </Text>
      </View>
    );
  };

  footerComponent = () => {
    let {loading, data} = this.state;
    let {user, upgradeToPro} = this.props;
    if (!user.isPro && !loading && data.length !== 0) {
      return (
        <View style={[s.p5p]}>
          <Text
            onPress={upgradeToPro}
            fontWeight="500"
            style={[s.textGrayLight, s.textCenter]}>
            {t('upgrade_now_to_access')}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    let {data, loading} = this.state;
    return (
      <FlatList
        contentContainerStyle={[s.flexGrow, s.p20]}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.key}
        refreshing={loading}
        onRefresh={this.onRefresh}
        ListEmptyComponent={this.renderEmpty}
        ItemSeparatorComponent={this.renderGap}
        onEndReachedThreshold={0.7}
        onEndReached={this.onEndReached}
        ListFooterComponent={this.footerComponent}
      />
    );
  }
}

export default ToLearn;
