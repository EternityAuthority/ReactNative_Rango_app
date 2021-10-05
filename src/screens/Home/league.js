import React from 'react';
import {Spinner, View} from 'native-base';
import {Dimensions, Image, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Container from '../../components/Container/secondary';
import ParentComponent from '../../components/ParentComponent';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t} from '../../locale';
import Text from '../../components/Text';
import Carousel from 'react-native-snap-carousel';
import UserItem from '../../components/ListItem/userItem';
import TintedImage from '../../components/TintedImage';

class League extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.windowWidth = Dimensions.get('window').width;
    this.itemWidth = this.windowWidth / 3;
    this.state = {
      active: 0,
      users: [],
      category: 'league',
      subcategory: 'global',
      leagueRange: {from: -1, to: 200},
      loading: true,
    };
  }

  componentDidMount() {
    this.calculateIndexAndRange();
  }

  async componentDidUpdate(prevProps, prevState) {
    let {category, subcategory, leagueRange} = this.state;
    let {user, curTargetLanguage} = this.props.context;
    let _user = prevProps.context.user;
    let _curTargetLanguage = prevProps.context.curTargetLanguage;
    let _leagueRange = prevState.leagueRange;
    let _category = prevState.category;
    let _subcategory = prevState.subcategory;

    let isCountryChange = user.cc !== _user.cc;
    let isCatChange = category !== _category || subcategory !== _subcategory;
    let isLangChange = user.curtargetlanguagekey !== _user.curtargetlanguagekey;
    let leagueChange = leagueRange.from !== _leagueRange.from;
    let isTrophyChange = curTargetLanguage.trophy !== _curTargetLanguage.trophy;

    if (isCountryChange || isCatChange || leagueChange || isLangChange || isTrophyChange) {
      this.calculateIndexAndRange();
      this.unsubscribeToLeaderboards();
      this.subscribeToLeaderboards(category, subcategory);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribeToLeaderboards();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  calculateIndexAndRange = () => {
    let {leagues, curTargetLanguage} = this.props.context;
    let leagueRange = {from: 0};
    const mytrophy = curTargetLanguage.trophy;
    let firstIndex = 0;
    leagues.forEach((l, ind) => {
      if (curTargetLanguage.league && curTargetLanguage.league.id === l.key) {
        firstIndex = ind;
      }
      /** calculate my league range, the lueagues are arrange in increasing order */
      if (mytrophy >= l.trophies) {
        leagueRange.from = l.trophies;
      } else if (!leagueRange.to) {
        leagueRange.to = l.trophies;
      }
    });
    this.updateState({firstIndex, leagueRange});
    return {firstIndex, leagueRange};
  };

  unsubscribeToLeaderboards = () => {
    if (this.leaderboardUnsubscribe) {
      this.leaderboardUnsubscribe();
    }
  };

  /** The league exactly does not mean the user in that league,
   * it means users points closest to the next league of logged in user.
   */
  subscribeToLeaderboards = (category, subcategory) => {
    let {leagueRange} = this.state;
    let {user, curTargetLanguage} = this.props.context;
    let langRef = firestore().doc(`languages/${curTargetLanguage.key}`);
    let leaderboardRef = langRef.collection('leaderboard');
    if (category === 'league') {
      leaderboardRef = leaderboardRef
        .where('trophy', '>=', leagueRange.from)
        .where('trophy', '<', leagueRange.to);
    }
    if (subcategory === 'local') {
      leaderboardRef = leaderboardRef.where('cc', '==', user.cc);
    }
    this.leaderboardUnsubscribe = leaderboardRef
      .orderBy('trophy', 'desc')
      .limit(30)
      .onSnapshot(
        (snaps) => {
          let users = [];
          if (snaps && !snaps.empty) {
            snaps.docs.forEach((userSnap) => {
              users.push(userSnap.data());
            });
          }
          this.updateState({users, loading: false});
        },
        (error) => {
          console.log(error);
        },
      );
  };

  onSnapToItem = (slideIndex) => {
    this.updateState({active: slideIndex});
  };

  changeCategory = (category) => {
    this.updateState({category: category});
  };

  changeSubCategory = (subcategory) => {
    this.updateState({subcategory: subcategory});
  };

  redirectToLeagues = () => {
    this.props.navigation.navigate('Leagues');
  };

  loadUser = (user) => {
    this.props.navigation.navigate('UserDetails', {user});
  };

  renderLeague = ({item, index}) => {
    let {curTargetLanguage} = this.props.context;
    let {active} = this.state;
    let isActive = index === active;
    let {defaultText, trophies, color} = item;
    let fontStyle = {color: color};
    if (!isActive) {
      fontStyle = s.textGray;
    }
    let isMyleague = item.trophies <= curTargetLanguage.trophy;
    //curTargetLanguage.league && curTargetLanguage.league.id === item.key;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!isActive}
        onPress={this.redirectToLeagues}>
        <TintedImage
          imageURL={item.imageURL}
          style={[s.w100p, s.h80]}
          tintColor={isMyleague ? null : s.bgBlack5.backgroundColor}
        />
        <View style={[s.mt5]}>
          <Text
            style={[s.ucase, s.f14, s.textCenter, fontStyle, s.montserrat700]}>
            {defaultText}
          </Text>
          <View style={[s.flexRow, s.jcac]}>
            <Text
              style={[
                s.ucase,
                s.f14,
                s.montserrat500,
                fontStyle,
              ]}>{`${trophies}+`}</Text>
            <View style={[s.ps5]} />
            <Image
              source={require('../../assets/images/trophy.png')}
              style={[s.hw20]}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  getTab = (text, cat) => {
    let {category} = this.state;
    let isActive = category === cat;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={isActive}
        onPress={this.changeCategory.bind(this, cat)}
        style={[s.w150, s.brTop10, s.p10, isActive ? s.bgWhite : s.bgLight]}>
        <Text
          fontWeight="700"
          style={[s.textCenter, isActive ? s.textPrimaryDark : s.textWhite]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  getPill = (text, subcat) => {
    let {subcategory} = this.state;
    let isActive = subcat === subcategory;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={this.changeSubCategory.bind(this, subcat)}
        style={[
          s.flex1,
          s.h34,
          s.br10,
          isActive ? s.bgPurpleLight : s.bgLight,
        ]}>
        <View
          style={[
            s.flex1,
            s.br5,
            s.jcac,
            s.mb3,
            isActive ? s.bgPurpleLight : s.bgPurpleVeryLight,
            s.br10,
          ]}>
          <Text
            fontWeight="700"
            style={[s.textCenter, {color: s.bgVoilet.backgroundColor}]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderComponent = () => {
    let {active} = this.state;
    let {leagues} = this.props.context;
    return (
      <View style={[s.mt10p]}>
        <Carousel
          firstItem={active}
          layout="default"
          data={leagues}
          renderItem={this.renderLeague}
          sliderWidth={this.windowWidth}
          itemWidth={this.itemWidth}
          inactiveSlideScale={0.8}
          initialNumToRender={6}
          onSnapToItem={this.onSnapToItem}
          extraData={this.state}
        />
        <View style={[s.mt10p, s.ms5p, s.me5p]}>
          <View style={[s.flexRow]}>
            {this.getTab(t('league'), 'league')}
            <View style={s.ps5} />
            {this.getTab(t('top_players'), 'top_players')}
          </View>
          <View style={[s.bgWhite]}>
            <View style={[s.flexRow, s.m5p]}>
              {this.getPill(t('global'), 'global')}
              <View style={s.ms5p} />
              {this.getPill(t('local'), 'local')}
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderUser = ({item, index}) => {
    return (
      <View style={[s.ms5p, s.me5p, s.bgWhite]}>
        <View style={[s.ms5, s.me5, s.br5, s.br10, s.ofh, s.bgYellow2]}>
          <UserItem user={item} rank={index + 1} onPress={this.loadUser} />
        </View>
      </View>
    );
  };

  renderGap = () => {
    return <View style={[s.pt5, s.ms5p, s.me5p, s.bgWhite]} />;
  };

  renderEmpty = () => {
    let {loading} = this.state;
    if (loading) {
      return (
        <View style={[s.flex1, s.jcac]}>
          <Spinner />
        </View>
      );
    } else {
      return (
        <View style={[s.p5p, s.ms5p, s.me5p, s.jcac, s.bgWhite]}>
          <Image
            source={require('../../assets/images/langooclosed.png')}
            resizeMode="contain"
            style={[s.flex0]}
          />
          <Text style={[s.textCenter, s.mt10p, s.textGray]}>
            {t('enter_in_league')}
          </Text>
        </View>
      );
    }
  };

  render() {
    let {users} = this.state;
    return (
      <Container header="primary" avoidScrollView={true}>
        <FlatList
          data={users}
          renderItem={this.renderUser}
          ListHeaderComponent={this.renderHeaderComponent}
          ItemSeparatorComponent={this.renderGap}
          contentContainerStyle={[s.flexGrow, s.pb20]}
          ListEmptyComponent={this.renderEmpty}
          style={[s.mt5]}
          keyExtractor={(item, i) => `${item.uid}_${i}`}
        />
      </Container>
    );
  }
}

export default withContext(League);
