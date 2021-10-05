import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Header} from 'native-base';
import {TouchableOpacity, StatusBar} from 'react-native';
import * as RootNavigation from '../../lib/RootNavigation';
import Icon from '../Icon';
import Text from '../Text';
import s from '../../assets/styles';

class HeaderBlue extends PureComponent {
  constructor(props) {
    super(props);
  }

  onBackPress = () => {
    let canGoBack = RootNavigation.canGoBack();
    if (canGoBack) {
      RootNavigation.goBack();
    } else {
      RootNavigation.replace('Home');
    }
  };

  render() {
    let {hasTabs, menu, title, noHeader, iconStyle = []} = this.props;
    return (
      <Header
        transparent
        hasTabs={hasTabs ? true : false}
        noShadow
        style={[s.flexColumn, s.bgWhite, s.headerShadow]}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {!noHeader && (
          <View style={[s.flexRow, s.ac]}>
            <View style={[s.flex0, s.mr15]}>
              {menu && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={this.onMenuPress}
                  style={[s.backWhiteO, s.p10, s.br30, s.hw46, s.jcac]}>
                  <Icon
                    name="bars"
                    type="FontAwesome5"
                    style={[s.textWhite, ...iconStyle]}
                  />
                </TouchableOpacity>
              )}
            </View>
            {!!title && (
              <Text
                fontWeight="700"
                numberOfLines={1}
                style={[s.flex1, s.textCenter, s.ccase, s.textPrimary]}>
                {title}
              </Text>
            )}
          </View>
        )}
      </Header>
    );
  }
}

HeaderBlue.propTypes = {
  hasTabs: PropTypes.bool,
  menu: PropTypes.bool,
  noHeader: PropTypes.bool,
  title: PropTypes.string,
  iconStyle: PropTypes.array,
};

export default HeaderBlue;
