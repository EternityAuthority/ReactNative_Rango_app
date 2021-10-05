import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import s from '../../assets/styles';
import IconMoon from '../Icon/moon';
import {View} from 'native-base';
import PressableOpacity from './pressableOpacity';

const Circle = (props) => {
  let {
    size,
    startColor,
    endColor,
    onPress,
    shadowColor = s.textPrimary.color,
    shadowHeight = 3,
  } = props;
  let innerCircle = [{width: size, height: size, borderRadius: size / 2}];
  let innerShaded = [
    {width: size, height: size - shadowHeight, borderRadius: size / 2},
  ];
  return (
    <PressableOpacity
      style={[...innerCircle, {backgroundColor: shadowColor}]}
      onPress={onPress}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[startColor, endColor]}
        style={[s.jcac, ...innerShaded]}>
        {props.children}
      </LinearGradient>
    </PressableOpacity>
  );
};

class PlayButton extends PureComponent {
  renderPrimary = () => {
    let {
      style = [],
      size = 90,
      onPlay,
      onSlowPlay,
      shadowHeight = 3,
      children,
      selected = false, //when true then it will change the bgIce to bgSuccess
    } = this.props;
    let circleStyle = [
      s.jcac,
      {width: size, height: size, borderRadius: size / 2},
      selected ? s.bgSuccessLight : s.bgIce,
      ...style,
    ];
    let innerSize = size - 0.18 * size;
    let playSlowSize = size / 3;
    let iconSize = 0.27 * size;
    if (!children) {
      children = (
        <IconMoon
          name="medium-volume"
          style={[s.textWhite, {fontSize: iconSize}]}
        />
      );
    }
    return (
      <View style={[...circleStyle]}>
        <Circle
          size={innerSize}
          startColor={s.bgInfo.backgroundColor}
          endColor={s.bgInfoDark.backgroundColor}
          shadowHeight={shadowHeight}
          dropBlur={true}
          onPress={onPlay}>
          {children}
        </Circle>
        {typeof onSlowPlay === 'function' && (
          <View
            style={[
              s.abs,
              s.absStart,
              {
                height: playSlowSize,
                width: playSlowSize,
              },
            ]}>
            <Circle
              size={playSlowSize}
              startColor={s.bgPrimaryDark.backgroundColor}
              endColor={s.bgPurple.backgroundColor}
              shadowColor={s.bgPrimaryDarker.backgroundColor}
              shadowHeight={2}
              onPress={onSlowPlay}>
              <IconMoon name="snail" style={[s.f16, s.textWhite]} />
            </Circle>
          </View>
        )}
      </View>
    );
  };

  render() {
    let {type} = this.props;
    switch (type) {
      default:
        return this.renderPrimary();
    }
  }
}

PlayButton.propTypes = {
  onPlay: PropTypes.func,
  onSlowPlay: PropTypes.func,
  style: PropTypes.array,
  size: PropTypes.number,
  selected: PropTypes.bool,
};

export default PlayButton;
