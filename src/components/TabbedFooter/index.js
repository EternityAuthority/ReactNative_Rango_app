import React from 'react';
import {View} from 'native-base';
import {Image, SafeAreaView, TouchableOpacity} from 'react-native';
import s from '../../assets/styles';

const ICONS = {
  shopgray: require('../../assets/images/shopgray.png'),
  shop: require('../../assets/images/shop.png'),
  leaguegray: require('../../assets/images/leaguegray.png'),
  league: require('../../assets/images/league.png'),
  startgray: require('../../assets/images/startgray.png'),
  start: require('../../assets/images/start.png'),
  academygray: require('../../assets/images/academygray.png'),
  academy: require('../../assets/images/academy.png'),
  profilegray: require('../../assets/images/profilegray.png'),
  profile: require('../../assets/images/profile.png'),
};

function getImage(routeName, active, style = []) {
  //let iconStyle = [Platform.OS === 'ios' ? s.mt5 : {}, s.hw25, ...style];
  let iconStyle = [s.hw25, ...style];
  let source = null;
  if (!active) {
    source = ICONS[routeName + 'gray'];
  } else {
    source = ICONS[routeName];
  }
  return <Image resizeMode="contain" source={source} style={iconStyle} />;
}

function TabbedFooter({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={[s.bgWhite, s.footerSh]}>
      <SafeAreaView>
        <View style={[s.flexRow, s.ac, s.jsa]}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const isFocused = state.index === index;
            const routeName = route.name;
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
            let lowerRouteName = routeName.toLowerCase();
            let iconStyle = lowerRouteName === 'start' ? [s.hw36] : [];
            return (
              <TouchableOpacity
                key={routeName}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={[s.h60, s.flex1, s.jcac]}>
                {getImage(lowerRouteName, isFocused, iconStyle)}
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default TabbedFooter;
