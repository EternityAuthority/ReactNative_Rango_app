import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import {TouchableOpacity} from 'react-native';

class Word extends PureComponent {
  onPress = () => {
    let {onPress} = this.props;
    if (onPress) {
      onPress();
    }
  };

  onLayout = (event) => {
    let {onLayout} = this.props;
    if (onLayout) {
      onLayout(event);
    }
  };

  render() {
    let {text, hidden, textStyle = []} = this.props;
    let hiddenStyle = hidden ? {opacity: 0, marginTop: -1} : {opacity: 1};
    return (
      <TouchableOpacity
        disabled={hidden}
        activeOpacity={0.9}
        onPress={this.onPress}
        onLayout={this.onLayout}
        style={[s.p5]}>
        <View style={[s.bgLight, s.br15]}>
          <View style={[s.bgLighter, s.br15, hidden ? s.mt1 : {}]}>
            <View style={[s.shadow, s.br15, s.bgIceLight, hiddenStyle]}>
              <View
                style={[
                  s.br15,
                  s.ps15,
                  s.pe15,
                  s.h40,
                  s.mb5,
                  s.jcac,
                  s.bgWhite,
                ]}>
                <Text style={[s.textCenter, s.textGray, ...textStyle]}>
                  {text}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

Word.propTypes = {
  text: PropTypes.string,
  hidden: PropTypes.bool,
  onPress: PropTypes.func,
};

export default Word;
