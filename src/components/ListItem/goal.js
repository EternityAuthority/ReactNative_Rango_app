/** A list item specifically designed for the language list item */
import React, {PureComponent} from 'react';
import {View} from 'native-base';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Text from '../Text';
import {TouchableOpacity} from 'react-native';
import {t} from '../../locale';

class GoalListItem extends PureComponent {
  render() {
    let {mins, name, selected = false, onPress = () => {}} = this.props;
    let rowStyle = [s.p15, s.ms15, s.me15, s.bgIceLight];
    let textStyle = [s.textPrimary];
    let textPrimary = [s.textGray];
    if (selected) {
      rowStyle = [s.p20, s.ms10, s.me10, s.bgPrimary];
      textStyle = [s.textWhite];
      textPrimary = [s.textWhite];
    }
    return (
      <TouchableOpacity
        style={[s.flexRow, s.br15, s.ac, ...rowStyle]}
        activeOpacity={0.5}
        onPress={onPress}>
        <View style={[s.flex1]}>
          <Text style={[s.semibold, s.textCenter, ...textPrimary]}>{name}</Text>
        </View>
        <View style={[s.flex1]}>
          <Text style={[s.semibold, s.textCenter, ...textStyle]}>{`${mins} ${t(
            'mins',
          )}/${t('day')}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

GoalListItem.propTypes = {
  mins: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
};

export default GoalListItem;
