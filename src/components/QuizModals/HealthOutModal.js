import React, {PureComponent} from 'react';
import {Icon, View} from 'native-base';
import Text from '../Text';
import {t} from '../../locale';
import s from '../../assets/styles';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

class HealthOutModal extends PureComponent {
  renderProTile = () => {
    let {onPro} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPro}
        style={[s.m5, s.br10, s.ofh, s.h150, s.bgIceLight, s.flex1]}>
        <View style={[s.p10, s.jcac, s.flex1]}>
          <ImageBackground
            source={require('../../assets/images/heart.png')}
            style={[s.hw46, s.jcac]}
            resizeMode="contain">
            <Icon
              name="infinity"
              type="FontAwesome5"
              style={[s.textWhite, s.f12]}
            />
          </ImageBackground>
          <Text
            fontWeight="700"
            style={[s.textCenter, s.textPrimary, s.mt10, s.f12]}>
            {t('unlimited_health')}
          </Text>
        </View>
        <View style={[s.bgPrimaryDarker, s.flex0]}>
          <View style={[s.bgPrimary, s.h40, s.mb3, s.jcac]}>
            <Text style={[s.textCenter, s.textWhite, s.montserrat700]}>
              PRO
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderGemTile = () => {
    let {gems, purchaseHealthByGems} = this.props;
    let isPurchasable = gems >= 50;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!isPurchasable}
        onPress={purchaseHealthByGems}
        style={[s.m5, s.br10, s.ofh, s.h130, s.bgIceLight, s.flex1]}>
        <View style={[s.p10, s.jcac, s.flex1]}>
          <ImageBackground
            source={require('../../assets/images/health.png')}
            style={[s.hw46, s.jcac]}
            resizeMode="contain">
            <Text
              style={[
                s.textWhite,
                s.textShadow,
                s.montserrat700, //for number the hardecoded monteserrat family
              ]}>
              1
            </Text>
          </ImageBackground>
          <Text
            fontWeight="700"
            style={[s.textCenter, s.textGray, s.mt10, s.f12]}>
            {t('one_health')}
          </Text>
        </View>
        <View style={[s.bgDanger, s.flex0]}>
          <View style={[s.bgDangerLight, s.h40, s.mb3]}>
            <View style={[s.flexRow, s.flex1, s.jcac]}>
              <Image
                source={require('../../assets/images/gems.png')}
                resizeMode="contain"
                style={[s.hw20]}
              />
              <Text style={[s.montserrat700, s.ms5, s.textWhite]}>{50}</Text>
            </View>
          </View>
        </View>
        {!isPurchasable && <View style={[s.abs, s.hw100p, s.bgBlack5]} />}
      </TouchableOpacity>
    );
  };

  renderAdTile = () => {
    let {onShowAd, adloaded} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!adloaded}
        onPress={onShowAd}
        style={[s.m5, s.br10, s.ofh, s.h130, s.bgIceLight, s.flex1]}>
        <View style={[s.p10, s.jcac, s.flex1]}>
          <ImageBackground
            source={require('../../assets/images/videoads.png')}
            style={[s.hw46, s.jcac]}
            resizeMode="contain"
          />
          <Text
            fontWeight="700"
            style={[s.textCenter, s.textGray, s.mt10, s.f12]}>
            {t('one_health')}
          </Text>
        </View>
        <View style={[s.bgDanger, s.flex0]}>
          <View style={[s.bgDangerLight, s.h40, s.mb3, s.jcac]}>
            {adloaded && (
              <Text style={[s.textCenter, s.textWhite, s.montserrat700]}>
                {t('play_video')}
              </Text>
            )}
            {!adloaded && <ActivityIndicator size="small" color="white" />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let {onCancel, gems} = this.props;
    let heartMarginTop = 0.5 * s.h150.height;
    return (
      <View>
        <Image
          source={require('../../assets/images/heartlarge.png')}
          resizeMode="contain"
          style={[s.img150, s.as, s.abs, {top: -heartMarginTop}]}
        />
        <View style={[s.abs, s.absStart, s.p20]}>
          <View style={[s.flexRow, s.ac]}>
            <Image
              source={require('../../assets/images/gems.png')}
              resizeMode="contain"
              style={[s.hw20]}
            />
            <Text style={[s.montserrat700, s.ms5, s.textPurple]}>{gems}</Text>
          </View>
        </View>
        <View style={[s.p10p, {paddingTop: heartMarginTop}]}>
          <Text
            fontWeight="700"
            style={[s.textDanger, s.textCenter, s.f20, s.mt5p]}>
            {t('health_out')}
          </Text>
          <Text style={[s.textGrayLight, s.textCenter, s.mt10]}>
            {t('health_out_des')}
          </Text>
          <View style={[s.flexRow, s.ae, s.mt5p]}>
            {this.renderProTile()}
            {this.renderGemTile()}
            {this.renderAdTile()}
          </View>
          <View style={[s.m10p, s.jcac]}>
            <TouchableOpacity activeOpacity={0.5} onPress={onCancel}>
              <Text
                fontWeight="700"
                style={[s.textPrimary, s.f20, s.textCenter]}>
                {t('no_thanks')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

HealthOutModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onShowAd: PropTypes.func.isRequired,
  onPro: PropTypes.func.isRequired,
  gems: PropTypes.number,
  adloaded: PropTypes.bool,
  purchaseHealthByGems: PropTypes.func.isRequired,
};

export default HealthOutModal;
