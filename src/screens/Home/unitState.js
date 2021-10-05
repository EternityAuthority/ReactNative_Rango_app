/** A list item specifically designed for the language list item */
import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import {View} from 'native-base';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import UnitItem from '../../components/ListItem/unitItem';
import GateItem from '../../components/ListItem/gateItem';
import Iconmoon from '../../components/Icon/moon';
import {TouchableOpacity} from 'react-native';
import s from '../../assets/styles';
import RepeatModalContent from '../../components/RepeatModalContent';
import {QUIZ_MODE} from '../../lib/Constants';

class UnitState extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      open: false,
      isModalVisible: false,
      gates: [],
    };
  }

  /**
   * Based on the new update from hany all units lessons can be seen regardless
   */
  componentDidMount() {
    // let {active} = this.props;
    // if (active) {
    //   this.subscribeToGates();
    // }
    this.subscribeToGates();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe && typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let {active, unitAnswerObject, lug_no} = this.props;
    let {open, isModalVisible} = this.state;
    return (
      lug_no !== nextProps.lug_no ||
      unitAnswerObject !== nextProps.unitAnswerObject ||
      active !== nextProps.active ||
      nextState.open !== open ||
      nextState.isModalVisible !== isModalVisible
    );
  }

  /**
   * Because of the new update since its always visible, we dont need this
   */
  // componentDidUpdate(prevProps) {
  //   let {active} = this.props;
  //   if (!prevProps.active && active) {
  //     this.unsubscribe();
  //     this.subscribeToGates();
  //   }
  // }

  /** To calculate how many gates are completed,
   * we will take unit answer object and for each of the gates answers we will check
   * whether we have 5 lessons keys available in gatesAnswer object or not, if yes then its complete */
  getCompleteness = () => {
    //console.log(this.props.unit.key);
    let {unitAnswerObject} = this.props;
    let gatesCompletedKeys = [];
    let gatesKeys = Object.keys(unitAnswerObject);
    gatesKeys.forEach((gateKey) => {
      let gateAnswerObject = unitAnswerObject[gateKey];
      if (gateAnswerObject) {
        //if gate answer object has more than or equal to 5 keys then unit is complete
        let lessonKeysLength = Object.keys(gateAnswerObject).length;
        if (lessonKeysLength >= 5) {
          gatesCompletedKeys.push(gateKey);
        }
      }
    });
    return gatesCompletedKeys;
  };

  subscribeToGates = () => {
    let {unit} = this.props;
    this.unsubscribe = firestore()
      .collection(`${unit.path}/gates`)
      .where('published', '==', true)
      .orderBy('no')
      .onSnapshot((snaps) => {
        let gates = [];
        if (snaps && !snaps.empty) {
          snaps.forEach((snap) => {
            let gate = snap.data();
            gate.path = snap.ref.path;
            gates.push(gate);
          });
        }
        this.updateState({gates});
      });
  };

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  toggleOpen = () => {
    let {open} = this.state;
    this.updateState({open: !open});
  };

  toggleModal = () => {
    let {isModalVisible} = this.state;
    this.updateState({isModalVisible: !isModalVisible});
  };

  onRepeat = (gate, lessons, c_lug_no) => {
    let {type} = gate;
    let {unitAnswerObject} = this.props;
    let gateAnswerObject = unitAnswerObject[gate.key];
    let lessonCompKeys = [];
    if (gateAnswerObject) {
      lessonCompKeys = Object.keys(gateAnswerObject);
    }
    this.updateState({
      lessons,
      lessonCompKeys,
      c_lug_no,
      isModalVisible: true,
      gate_type: type,
    });
  };

  repeatQuiz = (lesson) => {
    let {navigation} = this.props;
    this.updateState({isModalVisible: false}, () => {
      if (lesson.type === 'stories') {
        navigation.navigate('Stories', {lesson});
      } else {
        navigation.navigate('Quiz', {
          lessonPath: lesson.path,
          mode: QUIZ_MODE.REPEAT,
        });
      }
    });
  };

  renderGates = () => {
    let {unit, level, lug_no, unitAnswerObject} = this.props;
    let {gates} = this.state;
    if (gates.length === 0) {
      return null;
    }
    let {bgcolor} = unit;
    return gates.map((gate, i) => {
      let lessonsCompleted = 0;
      let gateAnswerObject = unitAnswerObject[gate.key];
      if (gateAnswerObject) {
        lessonsCompleted = Object.keys(gateAnswerObject).length;
      }
      return (
        <View key={gate.key}>
          {i > 0 && (
            <View>
              <View style={[s.w40, s.h20, s.ac]}>
                <View style={[s.w2, s.h100p, {backgroundColor: bgcolor}]} />
              </View>
            </View>
          )}
          <GateItem
            level={level}
            gate={gate}
            unit={unit}
            lug_no={lug_no}
            onRepeat={this.onRepeat}
            count={5}
            completedCount={lessonsCompleted}
          />
        </View>
      );
    });
  };

  render() {
    let {unit, active, lug_no} = this.props;
    let {
      open,
      lessons,
      c_lug_no,
      lessonCompKeys,
      isModalVisible,
      gate_type,
    } = this.state;
    let gatesCompletedKeys = this.getCompleteness();
    return (
      <View>
        <TouchableOpacity
          //disabled={!active}
          activeOpacity={0.5}
          onPress={this.toggleOpen}>
          <UnitItem
            active={active}
            unit={unit}
            count={5}
            completedCount={gatesCompletedKeys.length}
          />
        </TouchableOpacity>
        {open && (
          <View>
            <View style={[s.jcac]}>
              <Iconmoon
                name="angle-arrow-pointing-down"
                style={[{color: unit.bgcolor}, s.f20]}
              />
            </View>
            <View style={[s.ms5p, s.me5p]}>{this.renderGates()}</View>
          </View>
        )}
        <Modal
          isVisible={isModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={[s.m0, s.jb]}>
          <View style={[s.bgWhite, s.brTop15]}>
            {lessons && lessons.length > 0 && (
              <RepeatModalContent
                lessons={lessons}
                c_lug_no={c_lug_no}
                lug_no={lug_no}
                gate_type={gate_type}
                completedkeys={lessonCompKeys}
                onCancel={this.toggleModal}
                onRepeat={this.repeatQuiz}
              />
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

UnitState.propTypes = {
  level: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  unitAnswerObject: PropTypes.object.isRequired,
  active: PropTypes.bool,
  lug_no: PropTypes.string,
};

export default UnitState;
