import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Pressable} from 'react-native';

class PressableOpacity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1,
    };
  }

  onPressIn = () => {
    this.setState({opacity: 0.5});
    let {onPressIn} = this.props;
    if (onPressIn && typeof onPressIn === 'function') {
      onPressIn();
    }
  };

  onPressOut = () => {
    this.setState({opacity: 1});
    let {onPressOut} = this.props;
    if (onPressOut && typeof onPressOut === 'function') {
      onPressOut();
    }
  };

  onPress = () => {
    let {onPress} = this.props;
    if (onPress && typeof onPress === 'function') {
      onPress();
    }
  };

  render() {
    let {opacity} = this.state;
    let {style = [], children} = this.props;
    return (
      <Pressable
        onPressOut={this.onPressOut}
        onPressIn={this.onPressIn}
        onPress={this.onPress}
        style={[...style, {opacity: opacity}]}>
        {children}
      </Pressable>
    );
  }
}

PressableOpacity.propTypes = {
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
};

export default PressableOpacity;
