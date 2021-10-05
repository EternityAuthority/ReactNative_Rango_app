import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import AwesomeButton from 'react-native-really-awesome-button';
import LinearGradient from 'react-native-linear-gradient';
import s from '../../assets/styles';
import {TouchableOpacity} from 'react-native';

class Button extends PureComponent {
  onPress = (next) => {
    let {onPress} = this.props;
    if (typeof onPress === 'function') {
      onPress(next);
    }
  };

  /** Renders the button with the given parameters */
  renderButton = (startColor, endColor, bottomColor) => {
    let {
      stretch = false,
      progress = false,
      disabled = false,
      style,
      height = s.h60.height,
      width,
      borderRadius = s.br15.borderRadius,
    } = this.props;
    return (
      <AwesomeButton
        disabled={disabled}
        stretch={stretch}
        progress={progress}
        height={height}
        width={width}
        borderRadius={borderRadius}
        backgroundDarker={bottomColor}
        backgroundShadow={null}
        onPress={this.onPress}
        style={style}
        ExtraContent={
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[startColor, endColor]}
            style={[s.absoluteFillObject]}
          />
        }>
        {this.props.children}
      </AwesomeButton>
    );
  };

  renderPrimary = () => {
    let {badge = false} = this.props;
    if (badge) {
      return this.renderButton(
        s.bgPrimaryDark.backgroundColor,
        s.bgPrimaryDark.backgroundColor,
        s.bgPrimaryDarker.backgroundColor,
      );
    } else {
      return this.renderButton(
        s.bgPrimary.backgroundColor,
        s.bgPrimaryDark.backgroundColor,
        s.bgPrimaryDarker.backgroundColor,
      );
    }
  };

  renderDanger = () => {
    return this.renderButton(
      s.bgDanger.backgroundColor,
      s.bgDangerDark.backgroundColor,
      s.bgDangerDarker.backgroundColor,
    );
  };

  renderWarning = () => {
    return this.renderButton(
      s.bgWarning.backgroundColor,
      s.bgWarningDark.backgroundColor,
      s.bgWarningDarker.backgroundColor,
    );
  };

  renderSuccess = () => {
    return this.renderButton(
      s.bgSuccess.backgroundColor,
      s.bgSuccessDark.backgroundColor,
      s.bgSuccessDarker.backgroundColor,
    );
  };

  renderInfo = () => {
    return this.renderButton(
      s.bgInfo.backgroundColor,
      s.bgInfoDark.backgroundColor,
      s.bgInfoDarker.backgroundColor,
    );
  };

  renderFacebook = () => {
    return this.renderButton(
      s.bgPurple.backgroundColor,
      s.bgPurple.backgroundColor,
      s.bgPurpleDark.backgroundColor,
    );
  };

  renderGmail = () => {
    return this.renderButton(
      s.bgOrange.backgroundColor,
      s.bgOrange.backgroundColor,
      s.bgOrangeDark.backgroundColor,
    );
  };

  renderApple = () => {
    return this.renderButton(
      s.bgBlack.backgroundColor,
      s.bgBlack.backgroundColor,
      s.bgBlack5.backgroundColor,
    );
  };

  renderWhite = () => {
    return this.renderButton(
      s.bgWhite.backgroundColor,
      s.bgWhite.backgroundColor,
      s.bgLight.backgroundColor,
    );
  };

  renderGray = () => {
    return this.renderButton(
      s.bgLight.backgroundColor,
      s.textGrayLight.color,
      s.bgGray.backgroundColor,
    );
  };

  /** This is special case button, which is not 3d and background is transparent */
  renderIce = () => {
    let {disabled, style = [], onPress} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={disabled}
        onPress={onPress}
        style={[s.h60, s.flexRow, s.jcac, s.bice, s.b2, s.br15, ...style]}>
        {this.props.children}
      </TouchableOpacity>
    );
  };

  render() {
    let {type} = this.props;
    switch (type) {
      case 'danger':
        return this.renderDanger();
      case 'warning':
        return this.renderWarning();
      case 'success':
        return this.renderSuccess();
      case 'info':
        return this.renderInfo();
      case 'facebook':
        return this.renderFacebook();
      case 'google':
        return this.renderGmail();
      case 'apple':
        return this.renderApple();
      case 'ice':
        return this.renderIce();
      case 'white':
        return this.renderWhite();
      case 'gray':
        return this.renderGray();
      default:
        return this.renderPrimary();
    }
  }
}

Button.propTypes = {
  stretch: PropTypes.bool,
  progress: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.array,
  type: PropTypes.oneOf([
    'primary',
    'success',
    'danger',
    'info',
    'warning',
    'facebook',
    'google',
    'apple',
    'ice',
    'white',
    'gray',
  ]),
};

export default Button;
