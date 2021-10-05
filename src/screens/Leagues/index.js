import React from 'react';
import {Image, StatusBar, TouchableOpacity, Dimensions} from 'react-native';
import {Spinner, View} from 'native-base';
import ParentComponent from '../../components/ParentComponent';
import Icon from '../../components/Icon';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import Text from '../../components/Text';
import FastImage from '../../components/Image';
import s from '../../assets/styles';
import LinearGradient from 'react-native-linear-gradient';

class Leagues extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let screenWidth = Dimensions.get('window').width;
    let itemWidth = 220;
    let leagues = props.context.leagues
      ? [...props.context.leagues].reverse()
      : [];
    let margin = (screenWidth - itemWidth) / leagues.length;
    this.state = {
      screenWidth: screenWidth,
      itemWidth: itemWidth,
      loading: false,
      leagues: leagues,
      margin: margin,
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

  goBack = () => {
    let {navigation} = this.props;
    navigation.goBack();
  };

  renderLeagueTile = (league, i) => {
    let {language, curTargetLanguage} = this.props.context;
    let {itemWidth, margin} = this.state;
    let calcMargin = i * margin;
    let {imageURL, name, key, trophies} = league;
    let displayName = name[language.code] || name.defaultText;
    let bgcolors = [
      s.bgNoColor.backgroundColor,
      s.bgNoColor.backgroundColor,
      s.bgNoColor.backgroundColor,
    ];
    if (
      curTargetLanguage.league &&
      curTargetLanguage.league.path === league.path
    ) {
      bgcolors = [
        s.bgNoColor.backgroundColor,
        s.bgWarningT.backgroundColor,
        s.bgNoColor.backgroundColor,
      ];
    }
    return (
      <LinearGradient
        key={key}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={bgcolors}
        style={[s.mb10, {width: itemWidth, marginEnd: calcMargin}]}>
        <View style={[s.flexRow, s.jcac]}>
          <FastImage
            source={{uri: imageURL}}
            style={[s.hw80, s.m10]}
            resizeMode="contain"
          />
          <View>
            <Text style={[s.textWhite, s.ucase, s.montserrat700]}>
              {displayName}
            </Text>
            <View style={[s.flexRow, s.jcac]}>
              <Text
                style={[
                  s.textWhite,
                  s.ucase,
                  s.montserrat700,
                ]}>{`${trophies}+`}</Text>
              <View style={[s.ps5]} />
              <Image
                source={require('../../assets/images/trophy.png')}
                style={[s.hw20]}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  renderLeagues = () => {
    let {leagues} = this.state;
    return leagues.map((league, i) => this.renderLeagueTile(league, i));
  };

  render() {
    let {loading} = this.state;
    return (
      <Container header="none" style={[s.bgPurpleDarker]}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.goBack}
          style={[s.br5, s.bgDanger, s.hw30, s.flex, s.jcac, s.topleft20]}>
          <Icon type="FontAwesome" name="times" style={[s.textWhite]} />
        </TouchableOpacity>
        {loading && (
          <View style={[s.flex1, s.jcac]}>
            <Spinner color="white" />
          </View>
        )}
        {!loading && (
          <View style={[s.flex1, s.jc, s.ae, s.p10]}>
            {this.renderLeagues()}
          </View>
        )}
      </Container>
    );
  }
}

export default withContext(Leagues);
