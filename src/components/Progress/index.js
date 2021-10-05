import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Triangle from 'react-native-triangle';
import {View} from 'native-base';
import s from '../../assets/styles';
import Text from '../Text';
import LinearGradient from 'react-native-linear-gradient';

class Progress extends PureComponent {
  renderPercentage = (value) => {
    return (
      <View
        style={[
          s.absolute,
          s.p5,
          s.br15,
          s.bgWhite,
          s.shadow,
          s.w50,
          s.mt_40,
          {marginStart: -25},
          {left: `${value}%`},
        ]}>
        <Text style={[s.textCenter, s.f12, s.textPrimaryDark, s.montserrat700]}>
          {`${value.toFixed(0)}%`}
        </Text>
        <Triangle
          width={10}
          height={8}
          color={'#FFF'}
          direction={'down'}
          style={[s.absolute, s.as, {top: 22}]}
        />
      </View>
    );
  };

  render() {
    let {
      value,
      hidepercent,
      height = 10,
      trackcolor = s.bgIce.backgroundColor,
    } = this.props;
    let borderRadius = height / 2;
    return (
      <View style={[s.flex1, s.jc]}>
        <View
          style={[
            s.w100p,
            {borderRadius: borderRadius, backgroundColor: trackcolor},
          ]}>
          {!hidepercent && this.renderPercentage(value)}
          <View
            style={[
              s.w100p,
              s.ofh,
              {borderRadius: borderRadius, backgroundColor: trackcolor},
            ]}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[
                s.bgPrimary.backgroundColor,
                s.bgPrimaryDarker.backgroundColor,
              ]}
              style={[
                {
                  width: `${value}%`,
                  height: height,
                  borderRadius: borderRadius,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
}

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  height: PropTypes.number,
  hidepercent: PropTypes.bool,
  trackcolor: PropTypes.string,
};

export default Progress;
