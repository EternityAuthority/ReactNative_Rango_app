import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextInput, View} from 'react-native';
import s from '../../assets/styles';
import {Icon} from 'native-base';
import Text from '../Text';

class Input extends PureComponent {
  onChangeText = (e, v) => {
    let {onChangeText} = this.props;
    if (onChangeText && typeof onChangeText === 'function') {
      onChangeText(e, v);
    }
  };

  /**
   * Valid can be null, false and true
   */
  renderTextInput = () => {
    let {
      invalid,
      containerStyle = [s.flexRow, s.ac, s.h60, s.br15, s.b2],
      inputStyle = [s.hw100p, s.flex1, s.f16, s.ps15],
      placeholder = '',
      disabled,
      message,
      defaultValue,
      value,
      secureTextEntry = false,
      keyboardType = 'default',
      maxLength,
      autoCapitalize = 'none',
    } = this.props;

    /** Set the border color accordingly based on in the input valid or invalid */
    let iconName = null;
    let borderStyle = s.blight;
    if (typeof invalid !== 'undefined' && invalid !== null) {
      if (invalid) {
        iconName = 'times';
        borderStyle = s.bdanger;
      } else {
        iconName = 'check';
        borderStyle = s.bice;
      }
    }

    return (
      <>
        <View style={[...containerStyle, borderStyle]}>
          <TextInput
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            value={value}
            defaultValue={defaultValue}
            editable={!disabled}
            style={[s.montserrat, ...inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={s.textGrayLight.color}
            onChangeText={this.onChangeText}
          />
          {!!iconName && (
            <Icon
              name={iconName}
              type="FontAwesome"
              style={[s.flex0, s.me15, {color: borderStyle.borderColor}]}
            />
          )}
        </View>
        {!!message && (
          <Text style={[{color: borderStyle.borderColor}, s.f14, s.mt5]}>
            {message}
          </Text>
        )}
      </>
    );
  };

  render() {
    return this.renderTextInput();
  }
}

Input.propTypes = {
  autoCapitalize: PropTypes.string,
  maxLength: PropTypes.number,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  containerStyle: PropTypes.array,
  inputStyle: PropTypes.array,
  placeholder: PropTypes.string,
  message: PropTypes.string,
  onChangeText: PropTypes.func,
};

export default Input;
