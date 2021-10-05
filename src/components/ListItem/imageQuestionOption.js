import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import FastImage from '../Image';
import {TouchableWithoutFeedback} from 'react-native';

class ImageQuestionOption extends PureComponent {
  render() {
    let {
      primaryText,
      secondaryText,
      imageURL,
      wide,
      clickable,
      selected,
      onPress = () => {},
    } = this.props;
    let aspect = wide ? s.aspect_16_9 : s.aspect_4_3;
    return (
      <TouchableWithoutFeedback
        disabled={!clickable}
        onPress={onPress}
        style={[s.flex1]}>
        <View style={[s.bgIceLight, s.br15]}>
          <View style={[s.br15, s.ofh, s.bgWhite]}>
            {!!imageURL && (
              <FastImage
                source={{uri: imageURL}}
                resizeMode="cover"
                style={[aspect, s.br15]}
              />
            )}
            {!!primaryText && (
              <View style={[s.br15, selected ? s.bgIceDark : s.bgIce]}>
                <View style={[s.brBottom15, s.p13, s.mb6, s.w100p, s.bgWhite]}>
                  <Text
                    style={[
                      s.textCenter,
                      selected ? s.textPrimaryDark : s.textGray,
                    ]}>
                    {primaryText}
                  </Text>
                </View>
              </View>
            )}
          </View>
          {!!secondaryText && (
            <Text style={[s.textCenter, s.textGrayLight, s.p13, s.pb15]}>
              {secondaryText}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ImageQuestionOption.propTypes = {
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  imageURL: PropTypes.string,
  wide: PropTypes.bool,
  clickable: PropTypes.bool,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
};

export default ImageQuestionOption;
