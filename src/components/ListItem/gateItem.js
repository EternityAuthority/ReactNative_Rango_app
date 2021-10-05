import React, {PureComponent} from 'react';
import {ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {View} from 'native-base';
import Text from '../Text';
import Iconmoon from '../Icon/moon';
import s from '../../assets/styles';
import PropTypes from 'prop-types';
import Utils from '../../lib/Utils';
import FastImage from '../../components/Image';
import TintedImage from '../../components/TintedImage';

const emptyStar = require('../../assets/images/stargray.png');
const fullStar = require('../../assets/images/starcolor.png');
const minHeight = 5;
const width = 5;
const maxHeight = 14;

class GateItem extends PureComponent {
  constructor(props) {
    super(props);
    let {level, gate, unit} = props;
    // eslint-disable-next-line prettier/prettier
    let c_lug_no = `${Utils.padStart(level.no)}-${Utils.padStart(unit.no)}-${Utils.padStart(gate.no)}`;
    this.state = {
      downloading: false,
      lessons: [],
      c_lug_no,
    };
  }

  fetchLessons = async () => {
    let {gate} = this.props;
    let snaps = await firestore()
      .doc(gate.path)
      .collection('lessons')
      .where('published', '==', true)
      .orderBy('no')
      .get();
    let lessons = [];
    if (snaps && !snaps.empty) {
      snaps.docs.forEach((docSnap) => {
        let d = docSnap.data();
        d.path = docSnap.ref.path;
        lessons.push(d);
      });
    }
    return lessons;
  };

  /** Creates vertical towers to show the count of lesson */
  createTowers = () => {
    let {count, completedCount, gate} = this.props;
    if (count > 0) {
      let distributedHeight = (maxHeight - minHeight) / count;
      let views = [];
      let previousHeight = minHeight;
      for (var i = 0; i < count; i++) {
        previousHeight = previousHeight + distributedHeight;
        views.push(
          <View
            key={`${gate.key}_${i}`}
            style={[
              s.me3,
              s.br5,
              completedCount > 0 ? s.bgPrimaryDark : s.bgLight,
              {height: previousHeight, width: width},
            ]}
          />,
        );
        completedCount--;
      }
      return views;
    } else {
      return null;
    }
  };

  renderStories = () => {
    let {gate, unit, lug_no, completedCount, count} = this.props;
    let {c_lug_no, downloading} = this.state;
    let {bgcolor, textcolor} = unit;
    let {defaultText} = gate;
    let title = defaultText;
    let retakable = c_lug_no < lug_no || completedCount > 0;
    let completed = completedCount === 1; //because there can be only one stories
    return (
      <View>
        <View style={[s.flexRow, s.ac]}>
          <View
            style={[
              s.flex0,
              s.hw40,
              s.jcac,
              s.br10,
              {backgroundColor: bgcolor},
            ]}>
            {!completed && (
              <TintedImage
                imageURL={unit.imageURL}
                style={[s.hw20]}
                tintColor={s.bgGray.backgroundColor}
              />
            )}
            {completed && <FastImage source={unit.imageURL} style={[s.hw20]} />}
          </View>
          <View style={[s.flex1, s.ps15]}>
            <View style={[s.flexRow, s.js]}>
              <Text
                fontWeight="700"
                style={[{color: textcolor}]}
                numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>
          {retakable && (
            <View style={[s.flex0]}>
              {!downloading && (
                <TouchableOpacity activeOpacity={0.5} onPress={this.onRepeat}>
                  <Iconmoon
                    name="go-back-arrow"
                    style={[s.f16, s.p10, {color: textcolor}]}
                  />
                </TouchableOpacity>
              )}
              {downloading && (
                <ActivityIndicator
                  size="small"
                  color={textcolor}
                  style={[s.p10]}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  renderUnitTestGate = () => {
    let {gate, unit, lug_no, completedCount, count} = this.props;
    let {c_lug_no, downloading} = this.state;
    let {bgcolor, textcolor} = unit;
    let {defaultText} = gate;
    let title = defaultText;
    let retakable = c_lug_no < lug_no || completedCount > 0;
    let completed = completedCount === 1; //because there is only one test
    return (
      <View>
        <View style={[s.flexRow, s.ac]}>
          <View
            style={[
              s.flex0,
              s.hw40,
              s.jcac,
              s.br10,
              {backgroundColor: bgcolor},
            ]}>
            <Iconmoon
              name="approval"
              style={[s.f20, completed ? {color: textcolor} : s.textGray]}
            />
          </View>
          <View style={[s.flex1, s.ps15]}>
            <View style={[s.flexRow, s.js]}>
              <Text
                fontWeight="700"
                style={[{color: textcolor}]}
                numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>
          {retakable && (
            <View style={[s.flex0]}>
              {!downloading && (
                <TouchableOpacity activeOpacity={0.5} onPress={this.onRepeat}>
                  <Iconmoon
                    name="go-back-arrow"
                    style={[s.f16, s.p10, {color: textcolor}]}
                  />
                </TouchableOpacity>
              )}
              {downloading && (
                <ActivityIndicator
                  size="small"
                  color={textcolor}
                  style={[s.p10]}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  onRepeat = async () => {
    let {onRepeat, gate} = this.props;
    let {c_lug_no, lessons} = this.state;
    if (lessons.length > 0 && onRepeat) {
      onRepeat(gate, lessons, c_lug_no);
    } else if (onRepeat) {
      this.setState({downloading: true});
      lessons = await this.fetchLessons();
      this.setState({lessons, downloading: false});
      onRepeat(gate, lessons, c_lug_no);
    }
  };

  renderNormalGate = () => {
    let {gate, unit, lug_no, completedCount, count} = this.props;
    let {c_lug_no, downloading} = this.state;
    let {bgcolor, textcolor} = unit;
    let {defaultText} = gate;
    let title = defaultText;
    let retakable = c_lug_no < lug_no || completedCount > 0;
    let completed = completedCount === count;
    return (
      <View>
        <View style={[s.flexRow, s.ac]}>
          <View style={[s.flex0, s.p10, s.br10, {backgroundColor: bgcolor}]}>
            {!completed && (
              <Image source={emptyStar} style={[s.hw20]} resizeMode="contain" />
            )}
            {completed && (
              <Image source={fullStar} style={[s.hw20]} resizeMode="contain" />
            )}
          </View>
          <View style={[s.flex1, s.ps15]}>
            <View style={[s.flexRow, s.ae]}>{this.createTowers()}</View>
            <View style={[s.flexRow, s.js, s.mt5]}>
              <Text
                fontWeight="700"
                style={[s.f14, s.mt2, {color: textcolor}]}
                numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>
          {retakable && (
            <View style={[s.flex0]}>
              {!downloading && (
                <TouchableOpacity activeOpacity={0.5} onPress={this.onRepeat}>
                  <Iconmoon
                    name="go-back-arrow"
                    style={[s.f16, s.p10, {color: textcolor}]}
                  />
                </TouchableOpacity>
              )}
              {downloading && (
                <ActivityIndicator
                  size="small"
                  color={textcolor}
                  style={[s.p10]}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  render() {
    let {gate} = this.props;
    if (gate.type === 'unit_test') {
      return this.renderUnitTestGate();
    } else if (gate.type === 'stories') {
      return this.renderStories();
    } else {
      return this.renderNormalGate();
    }
  }
}

GateItem.propTypes = {
  gate: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  completedCount: PropTypes.number,
  onRepeat: PropTypes.func.isRequired,
};

export default GateItem;
