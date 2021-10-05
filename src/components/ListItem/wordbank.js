import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import Icon from '../Icon';
import PlayButton from '../Button/playButton';
import Tooltip from 'rn-tooltip';
import RNFS from 'react-native-fs';
import {Player} from '@react-native-community/audio-toolkit';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {DOWNLOAD_PATH} from '../../lib/QuestionService';

class Wordbank extends PureComponent {
  constructor(props) {
    super(props);
    let {idkey} = this.props;
    this.mounted = true;
    this.to = `file://${DOWNLOAD_PATH}/w${idkey}.mp3`;
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    let {audioURL} = this.props;
    let exists = await RNFS.exists(this.to);
    if (!exists) {
      await this.download(audioURL, this.to);
    }
    this.player = new Player(this.to, {autoDestroy: false});
    this.player.prepare(() => {
      if (this.mounted) {
        this.setState({loading: false});
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.player) {
      this.player.destroy();
    }
  }

  download = (from, to) => {
    return RNFS.downloadFile({
      fromUrl: from,
      toFile: to,
      cacheable: true,
      connectionTimeout: 20000,
      readTimeout: 20000,
    }).promise;
  };

  onPlay = () => {
    if (this.player.isPlaying) {
      this.player.stop();
    }
    this.player.play();
  };

  getDifficultyView = (text) => {
    let length = text.length;
    let difficulty = 0;
    if (length > 4) {
      difficulty = 1;
    } else if (length > 7) {
      difficulty = 2;
    }
    let views = [];
    for (var i = 0; i < 3; i++) {
      let bgStyle = s.bgLight;
      if (i <= difficulty) {
        bgStyle = s.bgSuccessLight;
      }
      views.push(
        <View key={`padd_${i}`} style={[s.h15, s.ps5, bgStyle, s.br5]} />,
      );
    }
    return views;
  };

  render() {
    let {
      text,
      nativeText,
      language,
      checked,
      tooltiptext = '',
      onCheckChange,
    } = this.props;
    let textStyle = s[`${language.font}700`];
    let {loading} = this.state;
    return (
      <View style={[s.bgLight, s.br15]}>
        <View style={[s.p10, s.br15, s.bgWhite, s.mb3]}>
          <View style={[s.flexRow, s.ac]}>
            <View style={[s.flex0]}>
              <PlayButton
                size={40}
                onPlay={this.onPlay}
                style={[s.bgTransparent]}>
                {loading && <ActivityIndicator size="small" color="white" />}
              </PlayButton>
            </View>
            <View style={[s.flex1, s.mHor20]}>
              <Text style={[textStyle, s.textGray, s.textLeft]}>{text}</Text>
              <Text style={[s.mt5, s.f12, s.textGray, s.textLeft]}>
                {nativeText}
              </Text>
            </View>
            <View style={[s.flex0, s.mHor10]}>
              <Tooltip
                overlayColor="rgba(0, 0, 0, 0.50)"
                backgroundColor="white"
                popover={<Text>{tooltiptext}</Text>}>
                <View style={[s.w25, s.flexRow, s.jsb]}>
                  {this.getDifficultyView(text)}
                </View>
              </Tooltip>
            </View>
            <View style={[s.flex0, s.mHor10]}>
              <TouchableOpacity activeOpacity={0.5} onPress={onCheckChange}>
                {checked && (
                  <Icon
                    type="FontAwesome5"
                    name="check-circle"
                    style={[s.f30, s.textPrimary]}
                  />
                )}
                {!checked && (
                  <Icon
                    type="FontAwesome"
                    name="circle-thin"
                    style={[s.f30, s.textLight]}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Wordbank.propTypes = {
  text: PropTypes.string,
  nativeText: PropTypes.string,
  audioURL: PropTypes.string,
  idkey: PropTypes.string.isRequired,
  language: PropTypes.object,
  checked: PropTypes.bool,
  tooltiptext: PropTypes.string,
  onCheckChange: PropTypes.func.isRequired,
};

export default Wordbank;
