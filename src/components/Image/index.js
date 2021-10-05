import React from 'react';
import FastImage from 'react-native-fast-image';

const Image = (props) => {
  let {source, style = [], resizeMode = 'contain'} = props;
  let url = source;
  if (typeof source === 'object') {
    url = source.uri;
  }
  return (
    <FastImage
      style={style}
      source={{
        uri: url,
        priority: FastImage.priority.high,
      }}
      resizeMode={resizeMode}
    />
  );
};

export default Image;
