/** A list item specifically designed for the language list item */
import React, {PureComponent} from 'react';
import {Flag} from 'react-native-svg-flagkit';
import {View} from 'native-base';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Text from '../Text';
import {TouchableOpacity, Image} from 'react-native';
import Avatar from '../Avatar';

class UserItem extends PureComponent {
  onPress = () => {
    let {user, onPress} = this.props;
    if (onPress) {
      onPress(user);
    }
  };

  render() {
    let {user, rank = 0} = this.props;
    let {photoURL, cc, displayName, trophy = 0} = user;
    displayName = displayName ? displayName : 'User';
    let textSt = s.textGray;
    let bgColor = {};
    if ([1, 2, 3].includes(rank)) {
      textSt = s.textWhite;
      bgColor = s.bgPrimary;
    }
    cc = cc ? cc.toUpperCase() : '';
    return (
      <TouchableOpacity
        style={[s.flexRow, s.ac]}
        activeOpacity={0.5}
        onPress={this.onPress}>
        <View style={[s.flex0, s.minw35]}>
          <View style={[s.flex1, s.jcac, bgColor, s.brLeft10]}>
            <Text style={[s.montserrat500, textSt]}>{rank}</Text>
          </View>
        </View>
        <View style={[s.flex0, s.me15, s.p5, s.ps10]}>
          <Avatar source={photoURL} displayName={displayName} />
        </View>
        <View style={[s.flex1, s.js, s.me15]}>
          <Text
            fontWeight="500"
            numberOfLines={1}
            style={[s.textGrayDark, s.textLeft, s.f15, s.ccase, s.mb3, s.flex0, s.ass]}>
            {displayName}
          </Text>
          <Flag id={cc} width={s.w25.width} height={s.h15.height} />
        </View>
        <View style={[s.flex0, s.me15]}>
          <View style={[s.flexRow, s.bgYellow3, s.p2, s.pe5, s.br8, s.js]}>
            <Text
              style={[
                s.textWarnDark,
                s.ps30,
                s.montserrat700,
              ]}>{`${trophy}`}</Text>
            <Image
              source={require('../../assets/images/trophy.png')}
              style={[s.absolute, s.hw25]}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

UserItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserItem;
