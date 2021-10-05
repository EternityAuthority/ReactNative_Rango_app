/** A list item specifically designed for the language list item */
import React, {PureComponent} from 'react';
import {Flag} from 'react-native-svg-flagkit';
import {View} from 'native-base';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Text from '../Text';
import Icon from '../Icon';
import {TouchableOpacity} from 'react-native';

class LanguageListItem extends PureComponent {
  onPress = () => {
    let {onPress, languagekey} = this.props;
    if (onPress) {
      onPress(languagekey);
    }
  };

  render() {
    let {code, name, selected = false} = this.props;
    if (code) {
      code = code.toUpperCase();
    }
    return (
      <TouchableOpacity
        style={[s.flexRow, s.p15, s.ac, selected ? s.bgIce : null]}
        activeOpacity={0.5}
        onPress={this.onPress}>
        <View style={[s.flex0, s.me15]}>
          <View style={[s.flag]}>
            <Flag id={code} width={s.flag.width} height={s.flag.height} />
          </View>
        </View>
        <View style={[s.flex1, s.flexRow, s.js]}>
          <Text style={[s.semibold]}>{name}</Text>
        </View>
        {selected && (
          <View style={[s.flex0]}>
            <Icon
              name="check-circle"
              type="FontAwesome"
              style={[s.textPrimary, s.f24]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

LanguageListItem.propTypes = {
  code: PropTypes.string,
  name: PropTypes.string,
  languagekey: PropTypes.string,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
};

export default LanguageListItem;
