import React, {PureComponent} from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import {getFontstyle, isRTL} from '../../locale';
import s from '../../assets/styles';

class CustomText extends PureComponent {
  render() {
    let {style = [], children, fontWeight = '', lang} = this.props;
    let flexStyle = isRTL() ? s.textRight : {};
    if (lang) {
      //If language is specified then override the style based on the language
      flexStyle = lang.isRTL ? s.textRight : s.textLeft;
    }
    let fontStyle = `${getFontstyle()}${fontWeight}`;
    return (
      <Text {...this.props} style={[flexStyle, s.f16, s[fontStyle], ...style]}>
        {children}
      </Text>
    );
  }
}

CustomText.propTypes = {
  style: PropTypes.array,
  children: PropTypes.any,
  lang: PropTypes.object,
  fontWeight: PropTypes.oneOf(['500', '700']),
};

export default CustomText;
