import React, {PureComponent} from 'react';
import {Icon} from 'native-base';
import s from '../../assets/styles';

class CustomIcon extends PureComponent {
  render() {
    let {style = []} = this.props;
    return <Icon {...this.props} style={[s.f20, ...style]} />;
  }
}

export default CustomIcon;
