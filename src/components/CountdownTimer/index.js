import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import s from '../../assets/styles';
import Utils from '../../lib/Utils';
import Text from '../Text';

class CountdownTimer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      remaining: props.remaining,
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.updateTime, 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateTime = () => {
    let {onExpire, onTick} = this.props;
    let {remaining} = this.state;
    remaining--;
    if (remaining < 0) {
      remaining = 0;
    }
    this.setState({remaining});
    if (onTick && typeof onTick === 'function') {
      onTick(remaining);
    }
    if (remaining < 1) {
      clearInterval(this.timer);
      if (onExpire && typeof onExpire === 'function') {
        onExpire();
      }
    }
  };

  render() {
    let {textStyle = []} = this.props;
    let {remaining} = this.state;
    let readable = 'expired';
    if (remaining > 0) {
      readable = Utils.secondsToHM(remaining);
    }
    return <Text style={[s.montserrat, ...textStyle]}>{readable}</Text>;
  }
}

CountdownTimer.propTypes = {
  textStyle: PropTypes.array,
  remaining: PropTypes.number.isRequired,
  onExpire: PropTypes.func,
};

export default CountdownTimer;
