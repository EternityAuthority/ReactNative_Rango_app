import React from 'react';
import {View} from 'native-base';
import {FlatList, Image, SafeAreaView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container';
import Header from '../../components/Header/secondary';
import Text from '../../components/Text';
import Triangle from 'react-native-triangle';
import GoalsListItem from '../../components/ListItem/goal';
import Button from '../../components/Button';
import ButtonText from '../../components/Text/buttonText';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t, getLangCode} from '../../locale';

class DailyGoals extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {params = {}} = props.route;
    let {user} = props.context;
    //here the goal is the key of the goal
    this.state = {
      goal: user.goal ? user.goal.id : null,
      goals: [],
      loading: true,
      nativelanguage: params.nativelanguage,
    };
    this.goalsRef = firestore().collection('goals');
    this.userRef = firestore().collection('users').doc(user.uid);
  }

  /** Fetches the to learn languages for the flatlist */
  componentDidMount() {
    let {goal} = this.state;
    this.goalsRef
      .orderBy('mins')
      .get()
      .then((snap) => {
        if (!snap.empty) {
          let goals = [];
          snap.forEach((data, i) => {
            let d = data.data();
            goals.push(d);
            if (!goal && i === 1) {
              goal = d.key;
            }
          });
          this.updateState({goals, goal, loading: false});
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

  /** Saves the user preferred goals in the db */
  saveGoals = async (next) => {
    let {goal} = this.state;
    if (goal) {
      try {
        await this.userRef.set(
          {goal: firestore().doc(`goals/${goal}`)},
          {merge: true},
        );
        next();
        let {navigation, route = {}} = this.props;
        let {params = {}} = route;
        if (params.redirectback) {
          navigation.goBack();
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
          navigation.navigate('Home');
        }
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  };

  selectItem = (item) => {
    this.updateState({goal: item.key});
  };

  renderItem = ({item}) => {
    let {goal} = this.state;
    let {mins, name, title} = item;
    let langCode = getLangCode();
    let displayName = title[langCode] || name;
    let selected = item.key === goal;
    return (
      <GoalsListItem
        mins={mins}
        name={displayName}
        selected={selected}
        onPress={this.selectItem.bind(this, item)}
      />
    );
  };

  itemSeparatorComponent = () => {
    return <View style={[s.hr, s.bgWhite]} />;
  };

  footerComponent = () => {
    return (
      <View style={[s.mt10p, s.flexRow]}>
        <Image
          source={require('../../assets/images/langoogoal.png')}
          resizeMode="contain"
          style={[s.img150, s.flex0]}
        />
        <View style={[s.flex1, s.me20]}>
          <View style={[s.bgLight, s.br10]}>
            <Text style={[s.textGrayDark, s.p5p, s.f14]}>
              {t('set_a_study')}
            </Text>
          </View>
          <Triangle
            width={20}
            height={15}
            color={s.bgLight.backgroundColor}
            direction={'left'}
            style={[s.absolute, {left: -19, top: 20}]}
          />
        </View>
      </View>
    );
  };

  render() {
    let {goals, loading} = this.state;
    return (
      <Container style={[s.bgWhite]}>
        <Header menu={false} hasTabs={false} />
        <SafeAreaView style={[s.flexGrow]}>
          <View style={[s.flex0, s.p5p, s.pt0]}>
            <Text fontWeight="700" style={[s.textGrayDark, s.f22]}>
              {t('choose_your_goal')}
            </Text>
            <Text style={[s.textGray, s.mt5]}>{t('you_can_change')}</Text>
          </View>
          <FlatList
            data={goals}
            refreshing={loading}
            onRefresh={() => {}}
            keyExtractor={(item, i) => `listl${i}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.itemSeparatorComponent}
            ListFooterComponent={this.footerComponent}
            contentContainerStyle={[s.flexGrow, s.p20]}
          />
          <View style={[s.flex0, s.p5p]}>
            <Button
              disabled={loading}
              stretch={true}
              progress={true}
              onPress={this.saveGoals}>
              <ButtonText>{t('continue')}</ButtonText>
            </Button>
          </View>
        </SafeAreaView>
      </Container>
    );
  }
}

export default withContext(DailyGoals);
