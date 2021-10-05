/**
 * A background image container HOC for all screens that will use a common background.
 */
import React from 'react';
import {Container} from 'native-base';
import s from '../../assets/styles';

const BackgroundContainer = (props) => {
  let {children, style = []} = props;
  return (
    <Container style={[s.flex1, s.container, ...style]}>{children}</Container>
  );
};

export default BackgroundContainer;
