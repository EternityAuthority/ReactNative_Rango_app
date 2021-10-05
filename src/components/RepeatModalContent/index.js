import React, {PureComponent} from 'react';
import {View} from 'native-base';
import Text from '../Text';
import {t} from '../../locale';
import s from '../../assets/styles';
import PropTypes from 'prop-types';
import Button from '../Button';
import ButtonText from '../Text/buttonText';

class RepeatModalContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
    };
  }

  onRepeat = () => {
    let {onRepeat, gate_type, lessons} = this.props;
    if (gate_type === 'unit_test' || gate_type === 'stories') {
      let current = lessons[0]; //the first lesson in the gate is the unit test
      if (onRepeat && current) {
        onRepeat(current);
      }
    } else {
      let {current} = this.state;
      if (onRepeat && current) {
        onRepeat(current);
      }
    }
  };

  updateCurrent = (lesson) => {
    this.setState({current: lesson});
  };

  render() {
    let {current} = this.state;
    let {
      lessons = [],
      c_lug_no,
      lug_no,
      completedkeys,
      onCancel,
      gate_type,
    } = this.props;
    return (
      <View style={[s.p10p]}>
        <View style={[s.flexRow, s.ac, s.jsa]}>
          {gate_type !== 'unit_test' &&
            gate_type !== 'stories' &&
            lessons.map((lesson, i) => {
              let retakable =
                c_lug_no < lug_no || completedkeys.includes(lesson.key);
              if (retakable) {
                if (current && current.key === lesson.key) {
                  return (
                    <Button
                      disabled={true}
                      type="success"
                      key={lesson.key}
                      stretch={false}
                      progress={false}
                      height={40}
                      width={40}>
                      <ButtonText style={[s.montserrat700]}>
                        {lesson.no}
                      </ButtonText>
                    </Button>
                  );
                } else {
                  return (
                    <Button
                      key={lesson.key}
                      stretch={false}
                      progress={false}
                      height={40}
                      width={40}
                      onPress={this.updateCurrent.bind(this, lesson)}>
                      <ButtonText style={[s.montserrat700]}>
                        {lesson.no}
                      </ButtonText>
                    </Button>
                  );
                }
              } else {
                return (
                  <Button
                    disabled={true}
                    type="gray"
                    key={lesson.key}
                    stretch={false}
                    progress={false}
                    height={40}
                    width={40}>
                    <ButtonText style={[s.montserrat700]}>
                      {lesson.no}
                    </ButtonText>
                  </Button>
                );
              }
            })}
        </View>
        {gate_type !== 'unit_test' && gate_type !== 'stories' && (
          <>
            <Text
              fontWeight="700"
              style={[s.mt20, s.f20, s.textCenter, s.textGrayDark]}>
              {t('repeat_lesson')}
            </Text>
            <Text style={[s.mt5, s.textCenter, s.textGrayDark]}>
              {t('repeat_lesson_des')}
            </Text>
          </>
        )}
        {gate_type === 'unit_test' && (
          <Text
            fontWeight="700"
            style={[s.mt20, s.f20, s.textCenter, s.textGrayDark]}>
            {t('repeat_unittest')}
          </Text>
        )}
        {gate_type === 'stories' && (
          <Text
            fontWeight="700"
            style={[s.mt20, s.f20, s.textCenter, s.textGrayDark]}>
            {t('repeat_story')}
          </Text>
        )}
        <Button stretch={true} style={[s.mt30]} onPress={this.onRepeat}>
          <ButtonText>{t('repeat_it')}</ButtonText>
        </Button>
        <Button type="ice" stretch={true} style={[s.mt20]} onPress={onCancel}>
          <ButtonText style={[s.textPrimary]}>
            {t('no_continue_learning')}
          </ButtonText>
        </Button>
      </View>
    );
  }
}

RepeatModalContent.propTypes = {
  lessons: PropTypes.array.isRequired,
  completedkeys: PropTypes.array,
  gate_type: PropTypes.string,
  c_lug_no: PropTypes.string.isRequired,
  lug_no: PropTypes.string.isRequired,
  onRepeat: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RepeatModalContent;
