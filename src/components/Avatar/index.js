import React, {PureComponent} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Utils from '../../lib/Utils';
import Text from '../Text';

class Avatar extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {source, displayName} = props;
    this.state = {
      bgcolor: Utils.randDarkColor(),
      source: source,
      displayName: displayName,
      error: source ? false : true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {source, displayName} = nextProps;
    if (source !== prevState.source || displayName !== prevState.displayName) {
      return {
        source: source,
        displayName: displayName,
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onError = (e) => {
    this.updateState({error: true});
  };

  renderInitials = () => {
    let {displayName, bgcolor} = this.state;
    displayName = displayName ? displayName : 'User';
    let initials = Utils.getInitialsOfName(displayName);
    return (
      <View style={[s.flex1, s.jcac, {backgroundColor: bgcolor}]}>
        <Text style={[s.textWhite, s.textCenter, s.montserrat500]}>
          {initials}
        </Text>
      </View>
    );
  };

  render() {
    let {source, error} = this.state;
    let {style = [s.hw40, s.br20]} = this.props;
    return (
      <View style={[s.ofh, ...style]}>
        {!error && (
          <FastImage
            onError={this.onError}
            style={[s.flex1]}
            source={{
              uri: source,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
          />
        )}
        {error && this.renderInitials()}
      </View>
    );
  }
}

Avatar.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string]),
  displayName: PropTypes.string,
  style: PropTypes.array,
};

export default Avatar;
