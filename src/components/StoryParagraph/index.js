import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Text from '../../components/Text';
import IconMoon from '../Icon/moon';
import {Icon, View} from 'native-base';
import s from '../../assets/styles';
import {Player} from '@react-native-community/audio-toolkit';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import { getLangCode } from '../../locale';

class StoryParagraph extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      expanded: false,
      init: false,
    };
    let {audioURL} = props;
    this.audio = new Player(audioURL, {autoDestroy: false});
  }

  componentDidMount() {
    this.audio.prepare(() => {
      this.updateState({init: true});
    });
    this.audio.on('ended', () => {
      let {playNext} = this.props;
      if (playNext) {
        playNext();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let {playing} = this.props;
    let {init} = this.state;
    if (playing && init) {
      this.playAudio();
    } else {
      this.stopAudio();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.audio.destroy();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  playAudio = () => {
    this.audio.play();
  };

  stopAudio = () => {
    this.audio.stop();
  };

  toggleLocal = () => {
    let {expanded} = this.state;
    this.updateState({expanded: !expanded});
  };

  render() {
    let {defaultText, name, language, playing, index, onPlay} = this.props;
    let rowStyle = language.isRTL ? s.flexRowRev : s.flexRow;
    let localtext = name[getLangCode()] || defaultText;
    let {expanded, init} = this.state;
    return (
      <View style={[s.mb5p]}>
        <View style={[rowStyle]}>
          <View style={[s.flex0]}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[s.w30, s.jcac]}
              disabled={!init}
              onPress={onPlay.bind(this, index)}>
              {!init && <ActivityIndicator style={[s.textGrayLight]} />}
              {init && playing && (
                <IconMoon name="pause" style={[s.textPrimaryDark, s.f18]} />
              )}
              {init && !playing && (
                <IconMoon name="play" style={[s.textPrimaryDark, s.f18]} />
              )}
            </TouchableOpacity>
          </View>
          <View style={[s.flex0, s.mHor5]} />
          <View style={[s.flex1]}>
            <Text lang={language} style={[s.textGrayDark]}>
              {defaultText}
            </Text>
            {expanded && (
              <View style={[s.mt10]}>
                <Text style={[s.textGrayDark]}>{localtext}</Text>
              </View>
            )}
          </View>
          <View style={[s.flex0, s.mHor5]} />
          <View style={[s.flex0]}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[s.ps10, s.pe10]}
              onPress={this.toggleLocal}>
              <Icon
                type="FontAwesome"
                name="language"
                style={[s.f20, s.textGrayDark]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

StoryParagraph.propTypes = {
  defaultText: PropTypes.string.isRequired,
  audioURL: PropTypes.string.isRequired,
  name: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
  playNext: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default StoryParagraph;
