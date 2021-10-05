import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';

export const HICONS = {
  gems: require('../../assets/images/gems.png'),
  gold: require('../../assets/images/gold.png'),
  trophy: require('../../assets/images/trophy.png'),
};

class GenericRewardCount extends PureComponent {
  render() {
    let {gold, gems, trophy} = this.props;
    return (
      <View style={[s.ms10p, s.me10p, s.flexRow, s.ac, s.jsa]}>
        <View style={[s.br10, s.flexRow, s.ac, s.p10, s.bgPurpleLight]}>
          <Text style={[s.f22, s.me15, s.textGolden, s.montserrat700]}>
            {gold}
          </Text>
          <Image source={HICONS.gold} style={[s.hw30]} resizeMode="contain" />
        </View>
        <View style={[s.br10, s.flexRow, s.ac, s.p10, s.bgPurpleLight]}>
          <Text style={[s.f22, s.me15, s.textPurple, s.montserrat700]}>
            {gems}
          </Text>
          <Image source={HICONS.gems} style={[s.hw30]} resizeMode="contain" />
        </View>
        <View style={[s.br10, s.flexRow, s.ac, s.p10, s.bgPurpleLight]}>
          <Text style={[s.f22, s.me15, s.textOrange, s.montserrat700]}>
            {trophy}
          </Text>
          <Image source={HICONS.trophy} style={[s.hw30]} resizeMode="contain" />
        </View>
      </View>
    );
  }
}

GenericRewardCount.propTypes = {
  gold: PropTypes.number.isRequired,
  trophy: PropTypes.number.isRequired,
  gems: PropTypes.number.isRequired,
};

export default GenericRewardCount;
