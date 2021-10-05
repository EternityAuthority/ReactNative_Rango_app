/**
 * Combines container with the secondary header.
 * Wraps all views in safe area view and keyboard aware scroll view
 */
import React from 'react';
import {Container} from 'native-base';
import s from '../../assets/styles';
import HeaderPrimary from '../Header/primary';
import HeaderSecondary from '../Header/secondary';
import HeaderBlue from '../Header/blue';
import HeaderWhite from '../Header/white';
import {SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import PropTypes from 'prop-types';

const SecondaryContainer = (props) => {
  let {
    children,
    style = [],
    avoidScrollView = false,
    contentContainerStyle = [],
    menu = false,
    hasTabs = false,
    noHeader = false,
    header = 'secondary',
    iconStyle = [],
    customFooter,
    noback,
    title,
  } = props;
  return (
    <Container style={[s.flex1, s.container, ...style]}>
      {header === 'primary' && <HeaderPrimary iconStyle={iconStyle} />}
      {header === 'secondary' && (
        <HeaderSecondary
          noHeader={noHeader}
          menu={menu}
          hasTabs={hasTabs}
          iconStyle={iconStyle}
          title={title}
        />
      )}
      {header === 'blue' && (
        <HeaderBlue
          noHeader={noHeader}
          menu={menu}
          hasTabs={hasTabs}
          noback={noback}
          iconStyle={iconStyle}
          title={title}
        />
      )}
      {header === 'white' && (
        <HeaderWhite
          noHeader={noHeader}
          menu={menu}
          hasTabs={hasTabs}
          iconStyle={iconStyle}
          title={title}
        />
      )}
      <SafeAreaView style={[s.flex1]}>
        {!avoidScrollView && (
          <KeyboardAwareScrollView
            contentContainerStyle={[s.flexGrow, ...contentContainerStyle]}>
            {children}
          </KeyboardAwareScrollView>
        )}
        {avoidScrollView && <>{children}</>}
      </SafeAreaView>
      {customFooter && typeof customFooter === 'function' && customFooter()}
    </Container>
  );
};

SecondaryContainer.propTypes = {
  header: PropTypes.oneOf(['primary', 'secondary', 'none', 'blue', 'white']),
  menu: PropTypes.bool,
  hasTabs: PropTypes.bool,
  noHeader: PropTypes.bool,
  style: PropTypes.array,
  iconStyle: PropTypes.array,
  contentContainerStyle: PropTypes.array,
  customFooter: PropTypes.any,
  avoidScrollView: PropTypes.bool,
};

export default SecondaryContainer;
