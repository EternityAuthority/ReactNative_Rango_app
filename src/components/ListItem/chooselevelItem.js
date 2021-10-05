/** A list item specifically designed for the choose level list item */
import React, {PureComponent} from 'react';
import {View} from 'native-base';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Text from '../Text';
import Image from '../Image';
import {TouchableOpacity} from 'react-native';

class ChooseLevelItem extends PureComponent {
  render() {
    let {title, description, selected = false, imageURL, onPress = () => {}} = this.props;
    return (
      <TouchableOpacity
        style={[s.br15, selected ? s.bgIceDark : s.bgIce]}
        activeOpacity={0.5}
        onPress={onPress}>
        <View style={[s.flexRow, s.mb3, s.br15, s.bgIceLight]}>
          <View style={[s.p15, s.flex0]}>
            <Image style={[s.hw80]} source={imageURL} />
          </View>
          <View style={[s.p10, s.flexColumn, s.flex1, s.jcac]}>
            <Text fontWeight="700" style={[s.textGrayDark, s.f18]}>
              {title}
            </Text>
            <Text style={[s.textGray, s.mt10, s.f14]}>{description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ChooseLevelItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageURL: PropTypes.string,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

export default ChooseLevelItem;
