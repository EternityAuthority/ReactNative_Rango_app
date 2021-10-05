import React, {PureComponent} from 'react';
import {Image, View} from 'react-native';
import FastImage from '../Image';
import PropTypes from 'prop-types';

class TintedImage extends PureComponent {
  render() {
    let {imageURL, style = [], tintColor} = this.props;
    return (
      <View style={style}>
        <FastImage
          source={{uri: imageURL}}
          style={style}
          resizeMode="contain"
        />
        {!!tintColor && (
          <Image
            source={{uri: imageURL}}
            style={[style, {tintColor: tintColor}, {position: 'absolute'}]}
            resizeMode="contain"
          />
        )}
      </View>
    );
  }
}

TintedImage.propTypes = {
  style: PropTypes.array,
  imageURL: PropTypes.string.isRequired,
  tintColor: PropTypes.string,
};

export default TintedImage;
