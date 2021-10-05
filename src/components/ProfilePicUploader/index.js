import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import s from '../../assets/styles';
import {Icon, View} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import Avatar from '../Avatar';

class ProfilePicUploader extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      photoURL: props.photoURL,
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  openPicker = () => {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
      useFrontCamera: true,
      mediaType: 'photo',
      forceJpg: true,
    })
      .then((image) => {
        this.updateState({photoURL: image.path});
        let {onSelect} = this.props;
        if (onSelect) {
          onSelect(image);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    let {photoURL} = this.state;
    let {uploading, displayName, style = []} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={uploading}
        onPress={this.openPicker}
        style={style}>
        <Avatar
          displayName={displayName}
          source={photoURL}
          style={[s.hw100, s.br50, s.b4, s.bWhite]}
        />
        <View
          style={[s.absolute, s.hw30, s.br15, s.backBlack5, s.flex, s.jcac]}>
          {!uploading && (
            <Icon
              type="FontAwesome5"
              name="camera"
              style={[s.textYellow, s.f14]}
            />
          )}
          {uploading && (
            <ActivityIndicator size="small" color={s.textYellow.color} />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

ProfilePicUploader.propTypes = {
  photoURL: PropTypes.string,
  uploading: PropTypes.bool,
  displayName: PropTypes.string.isRequired,
  style: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

export default ProfilePicUploader;
