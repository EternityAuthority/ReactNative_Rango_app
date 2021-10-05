import React, {PureComponent} from 'react';
import {Image, TouchableOpacity, Platform} from 'react-native';
import {View} from 'native-base';
import StarRating from 'react-native-star-rating';
import Text from '../Text';
import Icon from '../Icon';
import FastImage from '../Image';
import {getLangCode, isRTL, t} from '../../locale';
import s from '../../assets/styles';
import PropTypes from 'prop-types';

const lightray = require('../../assets/images/lightray.png');
const imgStyle = {height: 128, width: 256};

class UnitItemView extends PureComponent {
  render() {
    let {unit, active, downloadable, count, completedCount = 0} = this.props;
    let langCode = getLangCode();
    let {bgcolor, imageURL, no, defaultText} = unit;
    let {grammer, textcolor, name} = unit;
    let title = name[langCode] || defaultText;
    let textColor = {color: textcolor} || s.textBlack5;
    let starContainerWidth = count * 18; // 15+5 margin
    let iosMar = Platform.OS === 'ios' ? s.mt10 : s.mt5;
    return (
      <View style={[s.br10, {backgroundColor: bgcolor}]}>
        <View style={[s.flexRow, s.minh128]}>
          <Image
            style={[s.abs, imgStyle, {right: 0}]}
            source={lightray}
            resizeMode="contain"
          />
          <View style={[s.flex1, s.p15]}>
            <Text style={[s.f12, textColor]}>
              {t('unit')} {no}
            </Text>
            <Text
              fontWeight="700"
              numberOfLines={1}
              style={[s.f20, iosMar, s.ccase, textColor]}>
              {title}
            </Text>
            <Text style={[s.f12, iosMar, textColor]}>{grammer}</Text>
            <View style={[s.mt5, isRTL() ? s.ae : s.js]}>
              <View style={[{width: starContainerWidth}]}>
                <StarRating
                  disabled={true}
                  emptyStar={require('../../assets/images/stargray.png')}
                  fullStar={require('../../assets/images/starcolor.png')}
                  halfStar={'ios-star-half'}
                  iconSet={'Ionicons'}
                  rating={completedCount}
                  maxStars={count}
                  reversed={isRTL()}
                  starSize={15}
                />
              </View>
            </View>
          </View>
          <View style={[s.flex0, s.w150]}>
            <FastImage
              source={{uri: imageURL}}
              style={[s.abs, s.img150, {bottom: 0}]}
              resizeMode="contain"
            />
          </View>
        </View>
        {!active && (
          <Icon
            name="lock"
            type="FontAwesome"
            style={[s.f16, s.p10, textColor, s.abs, {right: 0}]}
          />
        )}
        {active && downloadable && (
          <TouchableOpacity style={[s.abs, {right: 0}]}>
            <Icon
              name="download"
              type="FontAwesome"
              style={[s.f16, s.p10, textColor]}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

UnitItemView.propTypes = {
  unit: PropTypes.object.isRequired,
  downloadable: PropTypes.bool,
  active: PropTypes.bool,
  count: PropTypes.number.isRequired,
  completedCount: PropTypes.number,
};

export default UnitItemView;
