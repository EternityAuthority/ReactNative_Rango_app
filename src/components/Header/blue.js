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

  onSetingPress = () => {
    RootNavigation.navigate('Settings');
  };

  render() {
    let {hasTabs, menu, title, noback, noHeader, iconStyle = []} = this.props;
    return (
      <Header
        transparent
        hasTabs={hasTabs ? true : false}
        noShadow
        style={[s.flexColumn, s.bgPrimaryDark]}>
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
                  onPress={this.onSetingPress}
                  style={[s.backWhiteO, s.p10, s.br30, s.hw46, s.jcac]}>
                  <Icon
                    name="cog"
                    type="FontAwesome5"
                    style={[s.textWhite, ...iconStyle]}
                  />
                </TouchableOpacity>
              )}
              {!menu && !noback && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={this.onBackPress}
                  style={[s.p10, s.br30, s.hw46, s.jcac]}>
                  <Icon
                    name="arrow-left"
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
                style={[s.flex1, s.textCenter, s.ccase, s.textWhite]}>
                {title}
              </Text>
            )}
            {!noback && <View style={[s.hw46, s.p10]} />}
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
