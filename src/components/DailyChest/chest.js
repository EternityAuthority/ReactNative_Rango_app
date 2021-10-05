import React, {PureComponent} from 'react';
import {View} from 'native-base';
import s from '../../assets/styles';
import {ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import FastImage from '../../components/Image';
import {showMessage} from 'react-native-flash-message';
import CountdownTimer from '../../components/CountdownTimer';
import PropTypes from 'prop-types';
import Text from '../Text';
import {t} from '../../locale';
import Utils from '../../lib/Utils';
import Icon from '../Icon';
import {claimDailyChest} from '../../lib/Constants';

/** Will define the current state of the chest box */
const STATE = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  READYTOOPEN: 'readytoopen',
  CLAIMED: 'claimed',
};

const costPerSec = 80 / 3600;

class DailyChest extends PureComponent {
  constructor(props) {
    super(props);
    let {unlockedAt, unlockTime} = props;
    let remaining = unlockTime;
    if (unlockedAt) {
      let elaspsedFromUnlockAt = Utils.elapsedSeconds(unlockedAt.seconds);
      remaining = parseInt(unlockTime - elaspsedFromUnlockAt, 10);
      if (remaining < 0) {
        remaining = 0;
      }
    }
    this.state = {
      expired: false,
      cost: Math.ceil(remaining * costPerSec),
      claiming: false,
    };
  }

  onExpire = () => {
    this.setState({expired: true});
  };

  onTick = (remainingSeconds) => {
    let cost = Math.ceil(remainingSeconds * costPerSec);
    this.setState({cost});
  };

  showError = (msg) => {
    showMessage({
      message: msg,
      duration: 3000,
      floating: true,
      titleStyle: {
        fontSize: s.textSizeBase.fontSize,
        textAlign: 'center',
        color: 'white',
      },
      type: 'danger',
    });
  };

  unlockWithGems = () => {
    let {gems} = this.props;
    let {cost} = this.state;
    let chestState = this.getChestState();
    if (gems >= cost || chestState === STATE.READYTOOPEN) {
      //Make a request to claim deal instantly
      this.setState({claiming: true});
      Utils.request(claimDailyChest, {})
        .then(() => {
          this.setState({claiming: false});
        })
        .catch((error) => {
          this.showError(error.message);
          this.setState({claiming: false});
        });
    } else {
      this.showError(t('not_enough_gems'));
    }
  };

  /** Returns the current state of the chest */
  getChestState = () => {
    let {unlockedAt, unlockTime, claimed} = this.props;
    let chestState = STATE.LOCKED;
    if (claimed) {
      chestState = STATE.CLAIMED;
    } else if (unlockedAt && unlockedAt.seconds) {
      chestState = STATE.UNLOCKED;
      let elaspsedFromUnlockAt = Utils.elapsedSeconds(unlockedAt.seconds);
      if (elaspsedFromUnlockAt >= unlockTime) {
        chestState = STATE.READYTOOPEN;
      }
    }
    return chestState;
  };

  /** The view os the chest when it is in locked state */
  getLockedState = () => {
    let {unlockable} = this.props;
    let {imageURL, unlockTime, onPress} = this.props;
    let unlockInHrs = Utils.secondsToHOURM(unlockTime);
    return (
      <TouchableOpacity
        disabled={!unlockable}
        activeOpacity={0.5}
        onPress={onPress}
        style={[s.br10, s.ofh, s.bgSilver]}>
        <View
          style={[
            s.p5p,
            s.flex1,
            s.b2,
            s.br10,
            s.h130,
            {borderColor: s.bgSilverDarker.backgroundColor},
          ]}>
          <Text
            fontWeight="700"
            style={[s.textCenter, s.mt5p, s.f14, s.textGolden]}>
            {t('locked')}
          </Text>
          <Text
            fontWeight="700"
            style={[s.textCenter, s.mt5, s.mb5, s.f14, s.textWhite]}>
            {unlockInHrs}
          </Text>
          <FastImage
            source={{uri: imageURL}}
            style={[s.hw60, s.as]}
            resizeMode="contain"
          />
        </View>
        {!unlockable && <View style={[s.abs, s.hw100p, s.bgBlack4]} />}
      </TouchableOpacity>
    );
  };

  /** The view os the chest when it is in unlocked state */
  getUnLockedState = () => {
    let {cost, claiming} = this.state;
    let {imageURL, unlockTime, unlockedAt} = this.props;
    let elaspsedFromUnlockAt = Utils.elapsedSeconds(unlockedAt.seconds);
    let remaining = parseInt(unlockTime - elaspsedFromUnlockAt, 10);
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[s.br10, s.bgSilver]}
        onPress={this.unlockWithGems}>
        <View
          style={[
            s.p5p,
            s.flex1,
            s.jcac,
            s.b2,
            s.br10,
            {borderColor: s.bgSilverDarker.backgroundColor},
            s.h130,
          ]}>
          <FastImage
            source={imageURL}
            style={[s.hw60, s.as]}
            resizeMode="contain"
          />
          <Text
            fontWeight="700"
            style={[
              s.textCenter,
              s.mt5p,
              s.f12,
              s.textSuccessLight,
              s.textShadowGreen,
            ]}>
            {t('open_now')}
          </Text>
          <View style={[s.flexRow, s.mt5p, s.js, s.ac]}>
            <Text style={[s.f18, s.textWhite, s.montserrat700]}>{cost}</Text>
            <Image
              source={require('../../assets/images/gems.png')}
              style={[s.hw20]}
              resizeMode="contain"
            />
          </View>
        </View>
        {claiming && (
          <View style={[s.abs, s.br10, s.hw100p, s.flex, s.jcac, s.bgBlack4]}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
        <View
          style={[
            s.abs,
            s.h20,
            s.mt_10,
            s.flexRow,
            s.bgSilverDarker,
            s.br10,
            s.ac,
            s.as,
          ]}>
          <Icon
            name="clock-o"
            type="FontAwesome"
            style={[s.f20, s.me5, s.textYellow]}
          />
          <CountdownTimer
            remaining={remaining}
            onExpire={this.onExpire}
            onTick={this.onTick}
            textStyle={[
              s.textWhite,
              s.me5,
              s.montserrat700,
              s.f12,
              s.textCenter,
              s.minw30,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  /** The view os the chest when it is in ready to open state */
  getReadyToOpen = () => {
    let {claiming} = this.state;
    let {imageURL} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={this.unlockWithGems}
        style={[s.br10, s.ofh, s.bgSuccessVeryLight]}>
        <View
          style={[
            s.p5p,
            s.flex1,
            s.b2,
            s.br10,
            s.jcac,
            s.h130,
            {borderColor: s.bgSilverDarker.backgroundColor},
          ]}>
          <Text fontWeight="700" style={[s.textCenter, s.m5p, s.textWhite]}>
            {t('open')}
          </Text>
          <FastImage
            source={{uri: imageURL}}
            style={[s.hw70, s.as]}
            resizeMode="contain"
          />
        </View>
        {claiming && (
          <View style={[s.abs, s.br10, s.hw100p, s.flex, s.jcac, s.bgBlack4]}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  getClaimed = () => {
    let {imageURL} = this.props;
    return (
      <View style={[s.br10, s.ofh, s.bgSilver]}>
        <View
          style={[
            s.p5p,
            s.flex1,
            s.b2,
            s.br10,
            s.jcac,
            s.h130,
            {borderColor: s.bgSilverDarker.backgroundColor},
          ]}>
          <FastImage
            source={{uri: imageURL}}
            style={[s.hw70, s.as]}
            resizeMode="contain"
          />
        </View>
        <View style={[s.abs, s.hw100p, s.bgBlack4, s.jcac, s.flex]}>
          <Icon
            name="check-circle"
            type="FontAwesome"
            style={[s.textSuccessLight, s.f35]}
          />
        </View>
      </View>
    );
  };

  render() {
    let chestState = this.getChestState();
    switch (chestState) {
      case STATE.LOCKED:
        return this.getLockedState();
      case STATE.UNLOCKED:
        return this.getUnLockedState();
      case STATE.READYTOOPEN:
        return this.getReadyToOpen();
      case STATE.CLAIMED:
        return this.getClaimed();
    }
  }
}

DailyChest.propTypes = {
  unlockedAt: PropTypes.any,
  unlockTime: PropTypes.number.isRequired,
  imageURL: PropTypes.string.isRequired,
  claimed: PropTypes.bool,
  onPress: PropTypes.func,
};

export default DailyChest;
