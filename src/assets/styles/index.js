/** A common stylesheet for all screens */
import {StyleSheet, Platform, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import commonColor from '../../../native-base-theme/variables/commonColor';

let isTablet = DeviceInfo.isTablet();
let factor = 1.4;

export default StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: commonColor.containerBgColor,
  },
  bgTransparent: {
    backgroundColor: 'transparent',
  },
  bgNoColor: {
    backgroundColor: '#00000000',
  },
  bgWhite: {
    backgroundColor: '#ffffff',
  },
  bgWhiteO: {
    backgroundColor: '#ffffff33',
  },
  bgWhite5: {
    backgroundColor: '#ffffff99',
  },
  bgWhite6: {
    backgroundColor: '#ffffffBB',
  },
  bgPrimary: {
    backgroundColor: commonColor.brandPrimary,
  },
  bgPrimaryDark: {
    backgroundColor: commonColor.brandPrimaryDark,
  },
  bgPrimaryDarker: {
    backgroundColor: commonColor.brandPrimaryDarker,
  },

  bgPurpleVeryLight: {
    backgroundColor: '#F7F4FE',
  },
  bgPurpleLight: {
    backgroundColor: commonColor.brandPurpleLight,
  },
  bgPurple: {
    backgroundColor: commonColor.brandPurple,
  },
  bgPurpleDark: {
    backgroundColor: commonColor.brandPurpleDark,
  },
  bgPurpleDarker: {
    backgroundColor: commonColor.brandPurpleDarker,
  },
  bgVoilet: {
    backgroundColor: '#602C8B',
  },

  bgOrange: {
    backgroundColor: commonColor.brandOrange,
  },
  bgOrangeDark: {
    backgroundColor: commonColor.brandOrangeDark,
  },

  bgDangerLight: {
    backgroundColor: commonColor.brandDangerLight,
  },
  bgDanger: {
    backgroundColor: commonColor.brandDanger,
  },
  bgDangerDark: {
    backgroundColor: commonColor.brandDangerDark,
  },
  bgDangerDarker: {
    backgroundColor: commonColor.brandDangerDarker,
  },
  bgDangerSoft: {
    backgroundColor: '#d04d4d',
  },

  bgSuccess: {
    backgroundColor: commonColor.brandSuccess,
  },
  bgSuccessDark: {
    backgroundColor: commonColor.brandSuccessDark,
  },
  bgSuccessDarker: {
    backgroundColor: commonColor.brandSuccessDarker,
  },
  bgSuccessLight: {
    backgroundColor: commonColor.brandSuccessLight,
  },
  bgSuccessVeryLight: {
    backgroundColor: '#7BFF5F',
  },

  bgInfo: {
    backgroundColor: commonColor.brandInfo,
  },
  bgInfoDark: {
    backgroundColor: commonColor.brandInfoDark,
  },
  bgInfoDarker: {
    backgroundColor: commonColor.brandInfoDarker,
  },

  bgSilverLight: {
    backgroundColor: commonColor.brandSilverLight,
  },
  bgSilver: {
    backgroundColor: commonColor.brandSilver,
  },
  bgSilver1: {
    backgroundColor: '#b2c2c7',
  },
  bgSilverDark: {
    backgroundColor: commonColor.brandSilverDark,
  },
  bgSilverDarker: {
    backgroundColor: commonColor.brandSilverDarker,
  },

  bgWarning: {
    backgroundColor: commonColor.brandWarning,
  },
  bgWarningDark: {
    backgroundColor: commonColor.brandWarningDark,
  },
  bgWarningDarker: {
    backgroundColor: commonColor.brandWarningDarker,
  },
  bgWarningT: {
    backgroundColor: '#fbb84a66',
  },

  bgGray: {
    backgroundColor: commonColor.brandGray,
  },
  bgLight: {
    backgroundColor: commonColor.brandLight,
  },
  bgLighter: {
    backgroundColor: commonColor.brandLighter,
  },
  bgBlack: {
    backgroundColor: '#000000',
  },
  bgBlackT: {
    backgroundColor: '#000000DD',
  },
  bgBlack5: {
    backgroundColor: '#00000077',
  },
  bgBlack4: {
    backgroundColor: '#00000044',
  },
  textBlack5: {
    color: '#00000077',
  },
  bgYellow: {
    backgroundColor: '#FFF73C',
  },
  bgYellow3: {
    backgroundColor: '#FFF7AF',
  },
  bgYellow2: {
    backgroundColor: '#f4fff5',
  },
  bgIce: {
    backgroundColor: commonColor.brandIce,
  },
  bgIceLight: {
    backgroundColor: commonColor.containerBgColor,
  },
  bgIceDark: {
    backgroundColor: commonColor.brandIceDark,
  },
  textWhite: {
    color: 'white',
  },
  textGolden: {
    color: commonColor.brandGolden,
  },
  textDark: {
    color: commonColor.brandDark,
  },
  textPrimary: {
    color: commonColor.brandPrimary,
  },
  textPrimaryDark: {
    color: commonColor.brandPrimaryDark,
  },
  textPrimaryDarker: {
    color: commonColor.brandPrimaryDarker,
  },
  textPrimaryOther: {
    color: commonColor.brandPrimaryOther,
  },
  textDanger: {
    color: commonColor.brandDanger,
  },
  textSuccess: {
    color: commonColor.brandSuccess,
  },
  textSuccessDark: {
    color: commonColor.brandSuccessDark,
  },
  textSuccessDarker: {
    color: commonColor.brandSuccessDarker,
  },
  textSuccessLight: {
    color: '#7BFF5F',
  },
  textWarn: {
    color: commonColor.brandWarning,
  },
  textWarnDark: {
    color: commonColor.brandWarningDark,
  },
  textYellow: {
    color: '#FFF7af',
  },
  textInfo: {
    color: commonColor.brandInfo,
  },
  textGray: {
    color: commonColor.brandGray,
  },
  textCharcoal: {
    color: '#B8C4D7',
  },
  textGrayLight: {
    color: commonColor.brandGrayLight,
  },
  textGrayDark: {
    color: commonColor.brandGrayDark,
  },
  textLight: {
    color: commonColor.brandLight,
  },
  textSilver: {
    color: commonColor.brandSilver,
  },
  textSilverDark: {
    color: commonColor.brandSilverDark,
  },
  textPlatinum: {
    color: '#8A36AE',
  },
  textPurple: {
    color: commonColor.brandPurple,
  },
  textPurpleDark: {
    color: commonColor.brandPurpleDark,
  },
  textOrange: {
    color: commonColor.brandOrange,
  },
  textOrangeDark: {
    color: commonColor.brandOrangeDark,
  },
  textSizeBase: {
    fontSize: commonColor.fontSizeBase,
  },
  textSizeDefault: {
    fontSize: commonColor.DefaultFontSize,
  },
  jc: {
    justifyContent: 'center',
  },
  jb: {
    justifyContent: 'flex-end',
  },
  jsb: {
    justifyContent: 'space-between',
  },
  jsa: {
    justifyContent: 'space-around',
  },
  js: {
    justifyContent: 'flex-start',
  },
  ac: {
    alignItems: 'center',
  },
  ae: {
    alignItems: 'flex-end',
  },
  as: {
    alignSelf: 'center',
  },
  ass: {
    alignSelf: 'flex-start',
  },
  jcac: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    display: 'flex',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexRowRev: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flexGrow: {
    flexGrow: 1,
  },
  flex0_5: {
    flex: 0.5,
  },
  flex0: {
    flex: 0,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  abs: {
    position: 'absolute',
  },
  absolute: {
    position: 'absolute',
  },
  absoluteFillObject: {
    ...StyleSheet.absoluteFillObject,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  h46: {
    height: isTablet ? 46 * factor : 46,
  },
  h10: {
    height: isTablet ? 10 * factor : 10,
  },
  h15: {
    height: isTablet ? 15 * factor : 15,
  },
  h20: {
    height: isTablet ? 20 * factor : 20,
  },
  h30: {
    height: isTablet ? 30 * factor : 30,
  },
  h34: {
    height: isTablet ? 34 * factor : 34,
  },
  h36: {
    height: isTablet ? 36 * factor : 36,
  },
  h40: {
    height: isTablet ? 40 * factor : 40,
  },
  h50: {
    height: isTablet ? 50 * factor : 50,
  },
  h54: {
    height: isTablet ? 54 * factor : 54,
  },
  h60: {
    height: isTablet ? 60 * factor : 60,
  },
  h70: {
    height: isTablet ? 70 * factor : 70,
  },
  h80: {
    height: isTablet ? 80 * factor : 80,
  },
  h100: {
    height: isTablet ? 100 * factor : 100,
  },
  h120: {
    height: isTablet ? 120 * factor : 120,
  },
  h130: {
    height: isTablet ? 130 * factor : 130,
  },
  h150: {
    height: isTablet ? 150 * factor : 150,
  },
  h330: {
    height: isTablet ? 330 * factor : 330,
  },
  h400: {
    height: isTablet ? 400 * factor : 400,
  },
  h500: {
    height: isTablet ? 500 * factor : 500,
  },
  h90p: {
    height: '90%',
  },
  h85p: {
    height: '85%',
  },
  h80p: {
    height: '80%',
  },
  h75p: {
    height: '75%',
  },
  h100p: {
    height: '100%',
  },
  minw30: {
    minWidth: 30,
  },
  minw35: {
    minWidth: 35,
  },
  minh600: {
    minHeight: 600,
  },
  minh128: {
    minHeight: 128,
  },
  minh25: {
    minHeight: 25,
  },
  minh500: {
    minHeight: 500,
  },
  minh400: {
    minHeight: 400,
  },
  minh300: {
    minHeight: 300,
  },
  minh350: {
    minHeight: 350,
  },
  minh550: {
    minHeight: 550,
  },
  maxh200: {
    maxHeight: 200,
  },
  w90: {
    width: isTablet ? 90 * factor : 90,
  },
  w100: {
    width: isTablet ? 100 * factor : 100,
  },
  w150: {
    width: isTablet ? 150 * factor : 150,
  },
  w200: {
    width: isTablet ? 200 * factor : 200,
  },
  w2: {
    width: isTablet ? 2 * factor : 2,
  },
  w30: {
    width: isTablet ? 30 * factor : 30,
  },
  w25: {
    width: isTablet ? 25 * factor : 25,
  },
  w40: {
    width: isTablet ? 40 * factor : 40,
  },
  w46: {
    width: isTablet ? 46 * factor : 46,
  },
  w50: {
    width: isTablet ? 50 * factor : 50,
  },
  w60: {
    width: isTablet ? 60 * factor : 60,
  },
  wauto: {
    width: 'auto',
  },
  hw20: {
    height: isTablet ? 20 * factor : 20,
    width: isTablet ? 20 * factor : 20,
  },
  hw25: {
    height: isTablet ? 25 * factor : 25,
    width: isTablet ? 25 * factor : 25,
  },
  hw30: {
    height: isTablet ? 30 * factor : 30,
    width: isTablet ? 30 * factor : 30,
  },
  hw36: {
    height: isTablet ? 36 * factor : 36,
    width: isTablet ? 36 * factor : 36,
  },
  hw15: {
    height: isTablet ? 15 * factor : 15,
    width: isTablet ? 15 * factor : 15,
  },
  hw10: {
    height: isTablet ? 10 * factor : 10,
    width: isTablet ? 10 * factor : 10,
  },
  hw40: {
    height: isTablet ? 40 * factor : 40,
    width: isTablet ? 40 * factor : 40,
  },
  hw46: {
    height: isTablet ? 46 * factor : 46,
    width: isTablet ? 46 * factor : 46,
  },
  hw50: {
    height: isTablet ? 50 * factor : 50,
    width: isTablet ? 50 * factor : 50,
  },
  hw60: {
    height: isTablet ? 60 * factor : 60,
    width: isTablet ? 60 * factor : 60,
  },
  hw70: {
    height: isTablet ? 70 * factor : 70,
    width: isTablet ? 70 * factor : 70,
  },
  hw80: {
    height: isTablet ? 80 * factor : 80,
    width: isTablet ? 80 * factor : 80,
  },
  hw100: {
    height: isTablet ? 100 * factor : 100,
    width: isTablet ? 100 * factor : 100,
  },
  hw100p: {
    height: '100%',
    width: '100%',
  },
  img150: {
    width: isTablet ? 150 * factor : 150,
    height: isTablet ? 150 * factor : 150,
  },
  img200: {
    width: isTablet ? 200 * factor : 200,
    height: isTablet ? 200 * factor : 200,
  },
  img250: {
    width: isTablet ? 250 * factor : 250,
    height: isTablet ? 250 * factor : 250,
  },
  img300: {
    width: isTablet ? 300 * factor : 300,
    height: isTablet ? 300 * factor : 300,
  },
  img300x177: {
    width: isTablet ? 300 * factor : 300,
    height: isTablet ? 177 * factor : 177,
  },
  img350: {
    width: isTablet ? 350 * factor : 350,
    height: isTablet ? 350 * factor : 350,
  },
  w100p: {
    width: '100%',
  },
  w50p: {
    width: '50%',
  },
  m0: {
    margin: 0,
    marginStart: 0,
    marginEnd: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  m5: {
    margin: isTablet ? 5 * factor : 5,
  },
  m10: {
    margin: isTablet ? 10 * factor : 10,
  },
  m15: {
    margin: isTablet ? 15 * factor : 15,
  },
  m20: {
    margin: isTablet ? 20 * factor : 20,
  },
  m30: {
    margin: isTablet ? 30 * factor : 30,
  },
  m5p: {
    margin: '5%',
  },
  m10p: {
    margin: '10%',
  },
  m15p: {
    margin: '15%',
  },
  m20p: {
    margin: '20%',
  },
  m30p: {
    margin: '30%',
  },
  mb0: {
    marginBottom: 0,
  },
  mb2: {
    marginBottom: isTablet ? 2 * factor : 2,
  },
  mb3: {
    marginBottom: isTablet ? 3 * factor : 3,
  },
  mb5: {
    marginBottom: isTablet ? 5 * factor : 5,
  },
  mb6: {
    marginBottom: isTablet ? 6 * factor : 6,
  },
  mb10: {
    marginBottom: isTablet ? 10 * factor : 10,
  },
  mb15: {
    marginBottom: isTablet ? 15 * factor : 15,
  },
  mb20: {
    marginBottom: isTablet ? 20 * factor : 20,
  },
  mb30: {
    marginBottom: isTablet ? 30 * factor : 30,
  },
  mb2p: {
    marginBottom: '2%',
  },
  mb5p: {
    marginBottom: '5%',
  },
  mb10p: {
    marginBottom: '10%',
  },
  mb15p: {
    marginBottom: '15%',
  },
  mb20p: {
    marginBottom: '20%',
  },
  mb30p: {
    marginBottom: '30%',
  },
  mt0: {
    marginTop: 0,
  },
  mt1: {
    marginTop: isTablet ? 1 * factor : 1,
  },
  mt2: {
    marginTop: isTablet ? 2 * factor : 2,
  },
  mt5: {
    marginTop: isTablet ? 5 * factor : 5,
  },
  mt10: {
    marginTop: isTablet ? 10 * factor : 10,
  },
  mt15: {
    marginTop: isTablet ? 15 * factor : 15,
  },
  mt20: {
    marginTop: isTablet ? 20 * factor : 20,
  },
  mt30: {
    marginTop: isTablet ? 30 * factor : 30,
  },
  mt40: {
    marginTop: isTablet ? 40 * factor : 40,
  },
  mt50: {
    marginTop: isTablet ? 50 * factor : 50,
  },
  mt_2: {
    marginTop: isTablet ? -2 * factor : -2,
  },
  mt_3: {
    marginTop: isTablet ? -3 * factor : -3,
  },
  mt_5: {
    marginTop: isTablet ? -5 * factor : -5,
  },
  mt_10: {
    marginTop: isTablet ? -10 * factor : -10,
  },
  mt_15: {
    marginTop: isTablet ? -15 * factor : -15,
  },
  mt_20: {
    marginTop: isTablet ? -20 * factor : -20,
  },
  mt_30: {
    marginTop: isTablet ? -30 * factor : -30,
  },
  mt_35: {
    marginTop: isTablet ? -30 * factor : -30,
  },
  mt_40: {
    marginTop: isTablet ? -40 * factor : -40,
  },
  mt_50: {
    marginTop: isTablet ? -50 * factor : -50,
  },
  mt_70: {
    marginTop: isTablet ? -70 * factor : -70,
  },
  mt_80: {
    marginTop: isTablet ? -80 * factor : -80,
  },
  mt_90: {
    marginTop: isTablet ? -90 * factor : -90,
  },
  mt5p: {
    marginTop: '5%',
  },
  mt10p: {
    marginTop: '10%',
  },
  mt15p: {
    marginTop: '15%',
  },
  mt20p: {
    marginTop: '20%',
  },
  mt30p: {
    marginTop: '30%',
  },
  mt40p: {
    marginTop: '40%',
  },
  mt50p: {
    marginTop: '50%',
  },
  ms0: {
    marginStart: 0,
  },
  ms5: {
    marginStart: isTablet ? 5 * factor : 5,
  },
  ms10: {
    marginStart: isTablet ? 10 * factor : 10,
  },
  ms15: {
    marginStart: isTablet ? 15 * factor : 15,
  },
  ms20: {
    marginStart: isTablet ? 20 * factor : 20,
  },
  ms30: {
    marginStart: isTablet ? 30 * factor : 30,
  },
  ms5p: {
    marginStart: '5%',
  },
  ms10p: {
    marginStart: '10%',
  },
  ms15p: {
    marginStart: '15%',
  },
  ms20p: {
    marginStart: '20%',
  },
  ms30p: {
    marginStart: '30%',
  },
  me0: {
    marginEnd: 0,
  },
  me3: {
    marginEnd: isTablet ? 3 * factor : 3,
  },
  me5: {
    marginEnd: isTablet ? 5 * factor : 5,
  },
  me10: {
    marginEnd: isTablet ? 10 * factor : 10,
  },
  me15: {
    marginEnd: isTablet ? 15 * factor : 15,
  },
  me20: {
    marginEnd: isTablet ? 20 * factor : 20,
  },
  me30: {
    marginEnd: isTablet ? 30 * factor : 30,
  },
  me5p: {
    marginEnd: '5%',
  },
  me10p: {
    marginEnd: '10%',
  },
  me15p: {
    marginEnd: '15%',
  },
  me20p: {
    marginEnd: '20%',
  },
  me30p: {
    marginEnd: '30%',
  },
  me40p: {
    marginEnd: '40%',
  },
  mHor5: {
    marginHorizontal: 5,
  },
  mHor10: {
    marginHorizontal: 10,
  },
  mHor15: {
    marginHorizontal: 15,
  },
  mHor20: {
    marginHorizontal: 20,
  },
  mHor25: {
    marginHorizontal: 25,
  },
  mHor30: {
    marginHorizontal: 30,
  },
  p0: {
    padding: 0,
    paddingStart: 0,
    paddingEnd: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  p2: {
    padding: isTablet ? 2 * factor : 2,
  },
  p5: {
    padding: isTablet ? 5 * factor : 5,
  },
  p10: {
    padding: isTablet ? 10 * factor : 10,
  },
  p13: {
    padding: isTablet ? 13 * factor : 13,
  },
  p15: {
    padding: isTablet ? 15 * factor : 15,
  },
  p20: {
    padding: isTablet ? 20 * factor : 20,
  },
  p25: {
    padding: isTablet ? 25 * factor : 25,
  },
  p30: {
    padding: isTablet ? 30 * factor : 30,
  },
  p5p: {
    padding: '5%',
  },
  p10p: {
    padding: '10%',
  },
  p15p: {
    padding: '15%',
  },
  p20p: {
    padding: '20%',
  },
  p30p: {
    padding: '30%',
  },
  pb0: {
    paddingBottom: 0,
  },
  pb5: {
    paddingBottom: isTablet ? 5 * factor : 5,
  },
  pb10: {
    paddingBottom: isTablet ? 10 * factor : 10,
  },
  pb15: {
    paddingBottom: isTablet ? 15 * factor : 15,
  },
  pb20: {
    paddingBottom: isTablet ? 20 * factor : 20,
  },
  pb30: {
    paddingBottom: isTablet ? 30 * factor : 30,
  },
  pt0: {
    paddingTop: 0,
  },
  pt5: {
    paddingTop: isTablet ? 5 * factor : 5,
  },
  pt10: {
    paddingTop: isTablet ? 10 * factor : 10,
  },
  pt15: {
    paddingTop: isTablet ? 15 * factor : 15,
  },
  pt20: {
    paddingTop: isTablet ? 20 * factor : 20,
  },
  pt30: {
    paddingTop: isTablet ? 30 * factor : 30,
  },
  pt40: {
    paddingTop: isTablet ? 40 * factor : 40,
  },
  pt50: {
    paddingTop: isTablet ? 50 * factor : 50,
  },
  ps0: {
    paddingStart: 0,
  },
  ps5: {
    paddingStart: isTablet ? 5 * factor : 5,
  },
  ps10: {
    paddingStart: isTablet ? 10 * factor : 10,
  },
  ps15: {
    paddingStart: isTablet ? 15 * factor : 15,
  },
  ps20: {
    paddingStart: isTablet ? 20 * factor : 20,
  },
  ps30: {
    paddingStart: isTablet ? 30 * factor : 30,
  },
  pe0: {
    paddingEnd: 0,
  },
  pe5: {
    paddingEnd: isTablet ? 5 * factor : 5,
  },
  pe10: {
    paddingEnd: isTablet ? 10 * factor : 10,
  },
  pe15: {
    paddingEnd: isTablet ? 15 * factor : 15,
  },
  pe20: {
    paddingEnd: isTablet ? 20 * factor : 20,
  },
  pe30: {
    paddingEnd: isTablet ? 30 * factor : 30,
  },
  ucase: {
    textTransform: 'uppercase',
  },
  lcase: {
    textTransform: 'lowercase',
  },
  ccase: {
    textTransform: 'capitalize',
  },
  unline: {
    borderBottomWidth: 2,
    borderBottomColor: commonColor.brandLight,
  },
  f10: {
    fontSize: isTablet ? 10 * factor : 10,
  },
  f12: {
    fontSize: isTablet ? 12 * factor : 12,
  },
  f13: {
    fontSize: isTablet ? 13 * factor : 13,
  },
  f14: {
    fontSize: isTablet ? 14 * factor : 14,
  },
  f15: {
    fontSize: isTablet ? 15 * factor : 15,
  },
  f16: {
    fontSize: isTablet ? 16 * factor : 16,
  },
  f18: {
    fontSize: isTablet ? 18 * factor : 18,
  },
  f20: {
    fontSize: isTablet ? 20 * factor : 20,
  },
  f22: {
    fontSize: isTablet ? 22 * factor : 22,
  },
  f24: {
    fontSize: isTablet ? 24 * factor : 24,
  },
  f25: {
    fontSize: isTablet ? 25 * factor : 25,
  },
  f30: {
    fontSize: isTablet ? 30 * factor : 30,
  },
  f35: {
    fontSize: isTablet ? 35 * factor : 35,
  },
  f50: {
    fontSize: isTablet ? 50 * factor : 50,
  },
  f100: {
    fontSize: isTablet ? 100 * factor : 100,
  },
  bwhite: {
    borderColor: 'white',
  },
  bpurple: {
    borderColor: commonColor.brandPurple,
  },
  bpurpledark: {
    borderColor: commonColor.brandPurpleDark,
  },
  bprimary: {
    borderColor: commonColor.brandPrimary,
  },
  bdanger: {
    borderColor: commonColor.brandDanger,
  },
  bgray: {
    borderColor: commonColor.brandGray,
  },
  bsilver: {
    borderColor: commonColor.brandSilver,
  },
  blight: {
    borderColor: commonColor.brandLight,
  },
  bice: {
    borderColor: commonColor.brandIce,
  },
  bWhite: {
    borderColor: 'white',
  },
  b0: {
    borderWidth: 0,
    borderStartWidth: 0,
    borderEndWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  b1: {
    borderWidth: 1,
  },
  bb1: {
    borderBottomWidth: 1,
  },
  b2: {
    borderWidth: 2,
  },
  b4: {
    borderWidth: 4,
  },
  bColor: {
    borderColor: commonColor.brandGrayLight,
  },
  bDisabled: {
    borderColor: commonColor.brandLight,
  },
  br0: {
    borderRadius: 0,
  },
  br5: {
    borderRadius: isTablet ? 5 * factor : 5,
  },
  br8: {
    borderRadius: isTablet ? 8 * factor : 8,
  },
  br10: {
    borderRadius: isTablet ? 10 * factor : 10,
  },
  br15: {
    borderRadius: isTablet ? 15 * factor : 15,
  },
  br18: {
    borderRadius: isTablet ? 18 * factor : 18,
  },
  br20: {
    borderRadius: isTablet ? 20 * factor : 20,
  },
  br25: {
    borderRadius: isTablet ? 25 * factor : 25,
  },
  br30: {
    borderRadius: isTablet ? 30 * factor : 30,
  },
  br35: {
    borderRadius: isTablet ? 35 * factor : 35,
  },
  br40: {
    borderRadius: isTablet ? 40 * factor : 40,
  },
  br50: {
    borderRadius: isTablet ? 50 * factor : 50,
  },
  br100: {
    borderRadius: isTablet ? 100 * factor : 100,
  },
  br125: {
    borderRadius: isTablet ? 125 * factor : 125,
  },
  brTop0: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  brTop5: {
    borderTopLeftRadius: isTablet ? 5 * factor : 5,
    borderTopRightRadius: isTablet ? 5 * factor : 5,
  },
  brTop10: {
    borderTopLeftRadius: isTablet ? 10 * factor : 10,
    borderTopRightRadius: isTablet ? 10 * factor : 10,
  },
  brLeft10: {
    borderTopLeftRadius: isTablet ? 10 * factor : 10,
    borderBottomLeftRadius: isTablet ? 10 * factor : 10,
  },
  brTop15: {
    borderTopLeftRadius: isTablet ? 15 * factor : 15,
    borderTopRightRadius: isTablet ? 15 * factor : 15,
  },
  brBottom15: {
    borderBottomLeftRadius: isTablet ? 15 * factor : 15,
    borderBottomRightRadius: isTablet ? 15 * factor : 15,
  },
  opacity: {
    opacity: 0.4,
  },
  opacity5: {
    opacity: 0.5,
  },
  opacity6: {
    opacity: 0.6,
  },
  opacity7: {
    opacity: 0.7,
  },
  opacity8: {
    opacity: 0.8,
  },
  ofh: {
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: commonColor.brandIce,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: {
      height: 0,
    },
    elevation: 3,
  },
  footerSh: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowRadius: 5,
    shadowOpacity: 0.6,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowColor: commonColor.brandIce,
    elevation: 6,
  },
  headerShadow: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowRadius: 5,
    shadowOpacity: 0.6,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowColor: commonColor.brandIce,
    elevation: 4,
  },
  lh20: {
    lineHeight: isTablet ? 20 * factor : 20,
  },
  lh24: {
    lineHeight: isTablet ? 24 * factor : 24,
  },
  lh26: {
    lineHeight: isTablet ? 26 * factor : 26,
  },
  topleft20: {
    top: Platform.OS === 'ios' ? 10 : 40,
    left: 20,
    position: 'absolute',
    zIndex: 99,
  },
  bottom0: {
    bottom: 0,
  },
  hr: {
    backgroundColor: commonColor.brandLight,
    height: 1,
  },
  hrlight: {
    backgroundColor: commonColor.brandLighter,
    height: 1,
  },
  chalkFont: {
    fontFamily: 'ChalkboardSE-Regular',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 999,
    backgroundColor: '#00000077',
  },
  absStart: {
    top: 0,
    left: 0,
  },
  absEnd: {
    top: 10,
    right: 20,
  },
  absRight: {
    top: 0,
    right: 20,
  },
  textShadow: {
    textShadowColor: '#1c5290',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
  },
  textShadowGreen: {
    textShadowColor: commonColor.brandSuccessDarker,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 0,
  },
  flagfont: {
    fontFamily: 'icomoon',
  },
  aspect_4_3: {
    aspectRatio: 4 / 2.8,
  },
  aspect_16_9: {
    aspectRatio: 16 / 7,
  },
  flag: {
    width: isTablet ? 42 * factor : 42,
    height: isTablet ? 30 * factor : 30,
    borderRadius: isTablet ? 3 * factor : 3,
    overflow: 'hidden',
  },
  montserrat: {
    fontFamily: commonColor.montserrat,
  },
  montserrat700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.montserrat700,
  },
  montserrat500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.montserrat500,
  },
  tajawal: {
    fontFamily: commonColor.tajawal,
  },
  tajawal700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.tajawal700,
  },
  tajawal500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.tajawal500,
  },
  hind: {
    fontFamily: commonColor.hind,
  },
  hind700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.hind700,
  },
  hind500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.hind500,
  },
  kanit: {
    fontFamily: commonColor.kanit,
  },
  kanit700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.kanit700,
  },
  kanit500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.kanit500,
  },
  cabin: {
    fontFamily: commonColor.cabin,
  },
  cabin700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.cabin700,
  },
  cabin500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.cabin500,
  },
  arsenal: {
    fontFamily: commonColor.arsenal,
  },
  arsenal700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.arsenal700,
  },
  arsenal500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.arsenal500,
  },
  heebo: {
    fontFamily: commonColor.heebo,
  },
  heebo700: {
    fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
    fontFamily: commonColor.heebo700,
  },
  heebo500: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    fontFamily: commonColor.heebo500,
  },
  jck: {
    fontFamily: commonColor.jck,
  },
});
