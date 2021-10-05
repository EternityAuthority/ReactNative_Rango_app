import React, {PureComponent} from 'react';
import s from '../../assets/styles';
import {Textarea} from 'native-base';
import {isRTL} from '../../locale';
import PropTypes from 'prop-types';

class TextArea extends PureComponent {
  render() {
    let {
      style = [],
      placeholder = '',
      value = '',
      language,
      onChangeText,
    } = this.props;
    let flexStyle = isRTL() ? s.textRight : {};
    if (language) {
      flexStyle = language.isRTL ? s.textRight : {};
    }
    return (
      <Textarea
        value={value}
        style={[flexStyle, s.w100p, s.h100, ...style]}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    );
  }
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  language: PropTypes.object,
  style: PropTypes.array,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
};

export default TextArea;
