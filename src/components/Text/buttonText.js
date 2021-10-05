import React, {PureComponent} from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import {getFontstyle} from '../../locale';
import s from '../../assets/styles';

class ButtonText extends PureComponent {
  render() {
    let {style = [], children, fontWeight = ''} = this.props;
    let fontStyle = `${getFontstyle()}${fontWeight}`;
    let fontSize = s.f16;
    if (fontStyle === 'tajawal') {
      fontSize = s.f18;
    }
    return (
      <Text
        {...this.props}
        style={[fontSize, s.ucase, s[fontStyle], s.textWhite, ...style]}>
        {children}
      </Text>
    );
  }
}

ButtonText.propTypes = {
  style: PropTypes.array,
  children: PropTypes.any,
  fontWeight: PropTypes.oneOf(['500', '700']),
};

export default ButtonText;
