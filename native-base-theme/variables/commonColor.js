// @flow

import color from 'color';
import DeviceInfo from 'react-native-device-info';
import { Platform, Dimensions, PixelRatio } from 'react-native';

let isTablet = DeviceInfo.isTablet();
let factor = 1.4;

export const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  MATERIAL: 'material',
  WEB: 'web'
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === PLATFORM.IOS &&
  (deviceHeight === 812 ||
    deviceWidth === 812 ||
    deviceHeight === 896 ||
    deviceWidth === 896);

export default {
  platformStyle,
  platform,

  // Accordion
  headerStyle: '#edebed',
  iconStyle: '#000',
  contentStyle: '#f5f4f5',
  expandedIconStyle: '#000',
  accordionBorderColor: '#d3d3d3',

  // ActionSheet
  elevation: 4,
  containerTouchableBackgroundColor: 'rgba(0,0,0,0.4)',
  innerTouchableBackgroundColor: '#fff',
  listItemHeight: 50,
  listItemBorderColor: 'transparent',
  marginHorizontal: -15,
  marginLeft: 14,
  marginTop: 15,
  minHeight: 56,
  padding: 15,
  touchableTextColor: '#757575',

  // Android
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',
  buttonUppercaseAndroidText: false,

  // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
  badgePadding: platform === PLATFORM.IOS ? 3 : 0,

  // Button
  buttonFontFamily: platform === PLATFORM.IOS ? 'System' : 'Roboto_medium',
  buttonDisabledBg: '#b5b5b5',
  buttonPadding: isTablet ? 7 * factor : 7,
  buttonHeight: isTablet ? 52 * factor : 52,
  jck: platform === PLATFORM.IOS ? 'PingFang SC' : 'Noto Sans CJK',
  montserrat: platform === PLATFORM.IOS ? 'Montserrat' : 'Montserrat-Regular',
  montserrat700: platform === PLATFORM.IOS ? 'Montserrat' : 'Montserrat-Bold',
  montserrat500: platform === PLATFORM.IOS ? 'Montserrat' : 'Montserrat-SemiBold',

  tajawal: platform === PLATFORM.IOS ? 'Tajawal' : 'Tajawal-Regular',
  tajawal700: platform === PLATFORM.IOS ? 'Tajawal' : 'Tajawal-Bold',
  tajawal500: platform === PLATFORM.IOS ? 'Tajawal' : 'Tajawal-Medium',

  hind: platform === PLATFORM.IOS ? 'Hind Siliguri' : 'Hind Siliguri-Regular',
  hind700: platform === PLATFORM.IOS ? 'Hind Siliguri' : 'Hind Siliguri-Bold',
  hind500: platform === PLATFORM.IOS ? 'Hind Siliguri' : 'Hind Siliguri-SemiBold',

  kanit: platform === PLATFORM.IOS ? 'Kanit' : 'Kanit-Regular',
  kanit700: platform === PLATFORM.IOS ? 'Kanit' : 'Kanit-Bold',
  kanit500: platform === PLATFORM.IOS ? 'Kanit' : 'Kanit-SemiBold',

  cabin: platform === PLATFORM.IOS ? 'Cabin' : 'Cabin-Regular',
  cabin700: platform === PLATFORM.IOS ? 'Cabin' : 'Cabin-Bold',
  cabin500: platform === PLATFORM.IOS ? 'Cabin' : 'Cabin-SemiBold',

  arsenal: platform === PLATFORM.IOS ? 'Arsenal' : 'Arsenal-Regular',
  arsenal700: platform === PLATFORM.IOS ? 'Arsenal' : 'Arsenal-Bold',
  arsenal500: platform === PLATFORM.IOS ? 'Arsenal' : 'Arsenal-Regular',

  heebo: platform === PLATFORM.IOS ? 'Heebo' : 'Heebo-Regular',
  heebo700: platform === PLATFORM.IOS ? 'Heebo' : 'Heebo-Bold',
  heebo500: platform === PLATFORM.IOS ? 'Heebo' : 'Heebo-SemiBold',

  get buttonPrimaryBg() {
    return this.brandPrimary;
  },
  get buttonPrimaryColor() {
    return this.inverseTextColor;
  },
  get buttonInfoBg() {
    return this.brandInfo;
  },
  get buttonInfoColor() {
    return this.inverseTextColor;
  },
  get buttonSuccessBg() {
    return this.brandSuccess;
  },
  get buttonSuccessColor() {
    return this.inverseTextColor;
  },
  get buttonDangerBg() {
    return this.brandDanger;
  },
  get buttonDangerColor() {
    return this.inverseTextColor;
  },
  get buttonWarningBg() {
    return this.brandWarning;
  },
  get buttonWarningColor() {
    return this.inverseTextColor;
  },
  get buttonTextSize() {
    return platform === PLATFORM.IOS
      ? this.fontSizeBase * 1.1
      : this.fontSizeBase; // -1
  },
  get buttonTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get buttonTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * (isTablet ? 3.8 * factor : 3.8);
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: '#fff',
  cardBorderColor: '#ccc',
  cardBorderRadius: 2,
  cardItemPadding: platform === PLATFORM.IOS ? 10 : 12,

  // CheckBox
  CheckboxRadius: platform === PLATFORM.IOS ? 13 : 0,
  CheckboxBorderWidth: platform === PLATFORM.IOS ? 1 : 2,
  CheckboxPaddingLeft: platform === PLATFORM.IOS ? 4 : 2,
  CheckboxPaddingBottom: platform === PLATFORM.IOS ? 0 : 5,
  CheckboxIconSize: platform === PLATFORM.IOS ? 21 : 16,
  CheckboxIconMarginTop: platform === PLATFORM.IOS ? undefined : 1,
  CheckboxFontSize: platform === PLATFORM.IOS ? 23 / 0.9 : 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

  // Color

  brandPrimary: '#2ec8ff',
  brandPrimaryDark: '#529fff',
  brandPrimaryDarker: '#3489e9',
  brandPrimaryOther: '#cdc0d4',

  brandPurpleLight: '#d7d6ff',
  brandPurple: '#6597ff',
  brandPurpleDark: '#3a5897',
  brandPurpleDarker: '#38364A',

  brandOrange: '#FF7878',
  brandOrangeDark: '#F44336',

  brandDangerLight: '#ff688f',
  brandDanger: '#e83966',
  brandDangerDark: '#e42d5c',
  brandDangerDarker: '#cc2149',

  brandWarning: '#fbb84a',
  brandWarningDark: '#ff8622',
  brandWarningDarker: '#e98d34',

  brandSuccess: '#9ad93d',
  brandSuccessDark: '#9ad93d',
  brandSuccessDarker: '#488919',

  brandSuccessLight: '#baf363',
  brandSuccessLightDark: '#8cd47c',

  brandInfo: '#2FE5ED',
  brandInfoDark: '#1ad2f5',
  brandInfoDarker: '#0ab1f9',

  brandSilverLight: '#cee6f6',
  brandSilver: '#C1DAE7',
  brandSilverDark: '#c1dae5',
  brandSilverDarker: '#aabfcd',

  brandIce: '#cfe8fa',
  brandIceDark: '#85BCFE',
  brandGolden: '#AA812A',

  brandDark: '#000',
  brandLight: '#DEDEDE',
  brandLighter: '#F4F5F7',
  brandGrayLight: '#AAA',
  brandGray: '#666',
  brandGrayDark: '#222',

  // Container
  containerBgColor: '#f3faff',

  // Date Picker
  datePickerTextColor: '#000',
  datePickerBg: 'transparent',

  // FAB
  fabWidth: 56,

  // Font
  DefaultFontSize: isTablet ? 16 * factor : 16,
  fontFamily: platform === PLATFORM.IOS ? 'System' : 'Roboto',
  fontSizeBase: isTablet ? 15 * factor : 15,
  wh36: isTablet ? 36 * factor : 36,
  wh40: isTablet ? 40 * factor : 40,
  wh56: isTablet ? 56 * factor : 56,
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: isTablet ? 60 * factor : platform === PLATFORM.IOS ? 55 : 60,
  //footerDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  footerDefaultBg: '#ffffff',
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: platform === PLATFORM.IOS ? '#737373' : '#bfc6ea',
  tabBarTextSize: platform === PLATFORM.IOS ? 14 : 11,
  activeTab: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: platform === PLATFORM.IOS ? '#2874F0' : '#fff',
  tabActiveBgColor: platform === PLATFORM.IOS ? '#cde1f9' : '#3F51B5',

  // Header
  //spanHeaderHeight: isTablet ? 110 * factor : 110,
  spanHeaderHeight:
    platform === PLATFORM.IOS
      ? isTablet
        ? 110 * factor
        : 110
      : isTablet
      ? 128 * factor
      : 128,
  toolbarBtnColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  toolbarDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  //  toolbarHeight: platform === PLATFORM.IOS ? 64 : 56,
  toolbarHeight:
    platform === PLATFORM.IOS
      ? isTablet
        ? 56 * factor
        : 56
      : isTablet
      ? 56 * factor
      : 56,
  toolbarSearchIconSize: platform === PLATFORM.IOS ? 20 : 23,
  toolbarInputColor: platform === PLATFORM.IOS ? '#CECDD2' : '#fff',
  searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
  searchBarInputHeight: platform === PLATFORM.IOS ? 30 : 50,
  toolbarBtnTextColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  iosStatusbar: 'dark-content',
  toolbarDefaultBorder: platform === PLATFORM.IOS ? '#a7a6ab' : '#3F51B5',
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: isTablet ? 24 * factor : 24,
  iconHeaderSize: platform === PLATFORM.IOS ? (isTablet ? 33 * factor : 33) : (isTablet ? 24 * factor : 24),

  // InputGroup
  inputFontSize: isTablet ? 17 * factor : 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',
  inputHeightBase: isTablet ? 52 * factor : 52,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return '#575757';
  },

  // Line Height
  buttonLineHeight: 19,
  // lineHeightH1: 32,
  // lineHeightH2: 27,
  // lineHeightH3: 22,
  lineHeight: platform === PLATFORM.IOS ? 20 : 24,

  // List
  listBg: 'transparent',
  listBorderColor: '#c9c9c9',
  listDividerBg: '#f4f4f4',
  listBtnUnderlayColor: '#DDD',
  listItemPadding: platform === PLATFORM.IOS ? 10 : 12,
  listNoteColor: '#808080',
  listNoteSize: 13,
  listItemSelected: platform === PLATFORM.IOS ? '#007aff' : '#3F51B5',

  // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',

  // Radio Button
  radioBtnSize: platform === PLATFORM.IOS ? 25 : 23,
  radioSelectedColorAndroid: '#3F51B5',
  radioBtnLineHeight: platform === PLATFORM.IOS ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  segmentActiveBackgroundColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  segmentTextColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  segmentActiveTextColor: platform === PLATFORM.IOS ? '#fff' : '#3F51B5',
  segmentBorderColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  segmentBorderColorMain: platform === PLATFORM.IOS ? '#a7a6ab' : '#3F51B5',

  // Spinner
  defaultSpinnerColor: '#45D56E',
  inverseSpinnerColor: '#1A191B',

  // Tab
  tabBarHeight: isTablet ? 50 * factor : 50,
  tabDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  topTabBarTextColor: platform === PLATFORM.IOS ? '#6b6b6b' : '#b3c7f9',
  topTabBarActiveTextColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  topTabBarBorderColor: platform === PLATFORM.IOS ? '#a7a6ab' : '#fff',
  topTabBarActiveBorderColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',

  // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: isTablet ? 15 * factor : 15,

  // Text
  textColor: '#000',
  inverseTextColor: '#fff',
  noteFontSize: isTablet ? 14 * factor : 14,
  smallFontSize: isTablet ? 12 * factor : 12,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: platform === PLATFORM.IOS ? 'System' : 'Roboto_medium',
  titleFontSize: platform === PLATFORM.IOS ? 17 : 19,
  subTitleFontSize: platform === PLATFORM.IOS ? 11 : 14,
  subtitleColor: platform === PLATFORM.IOS ? '#000' : '#fff',
  titleFontColor: platform === PLATFORM.IOS ? '#000' : '#fff',

  // Other
  borderRadiusBase: platform === PLATFORM.IOS ? (isTablet ? 5 * factor : 5) : (isTablet ? 2 * factor : 2),
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: isTablet ? 30 * factor : 30,

  // iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      //bottomInset: 34
      bottomInset: 20,
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 20
    }
  }
};
