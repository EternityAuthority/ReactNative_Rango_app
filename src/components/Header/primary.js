/** A primary header that can be only used when user is logged in */
import React from 'react';
import {View, Header} from 'native-base';
import CountDown from 'react-native-countdown-component';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import {
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import {Popover, PopoverController} from 'react-native-modal-popover';
import * as RootNavigation from '../../lib/RootNavigation';
import {withContext} from '../../lib/AppContext';
import Icon from '../Icon';
import Text from '../Text';
import s from '../../assets/styles';
import {t, getLangCode} from '../../locale';
import Utils from '../../lib/Utils';
import {
  HEALTH_AWARD_SECONDS_GAP,
  healthURL,
  MAX_HEALTH,
} from '../../lib/Constants';
import PurchaseService from '../../lib/PurchaseService';

export const HICONS = {
  gems: require('../../assets/images/gems.png'),
  health: require('../../assets/images/health.png'),
  gold: require('../../assets/images/gold.png'),
  trophy: require('../../assets/images/trophy.png'),
  heart: require('../../assets/images/heart.png'),
};

class HeaderPrimary extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {width} = Dimensions.get('window');
    this.state = {
      gems: 0,
      trophy: 0,
      gold: 0,
      width: width - 50, //25 dp gap on both sides
      healthshop: [],
    };
    this.healthShopRef = firestore().doc('health-shop/purchases');
    this.purchaseService = new PurchaseService();
  }

  componentDidMount() {
    this.calculateFreeHealth();
    this.healthShopUnsubscribe = this.healthShopRef.onSnapshot((snap) => {
      let healthshop = [];
      if (snap.exists) {
        let data = snap.data();
        healthshop = data.data; //contains the array of health bying options in form of gems
      }
      this.updateState({healthshop});
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (
      this.healthShopUnsubscribe &&
      typeof this.healthShopUnsubscribe === 'function'
    ) {
      this.healthShopUnsubscribe();
    }
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onBackPress = () => {
    let canGoBack = RootNavigation.canGoBack();
    if (canGoBack) {
      RootNavigation.goBack();
    } else {
      RootNavigation.replace('Home');
    }
  };

  /** Load to the pro version */
  loadProScreen = (closePopover) => {
    closePopover();
    RootNavigation.navigate('UpgradeToPro');
  };

  /** Purchasable only by gems */
  puchaseByGems = async (closePopover, gemsrequired, purchaseId) => {
    let {gems} = this.state;
    closePopover();
    if (gems >= gemsrequired) {
      try {
        this.toastInfo(t('purchase_in_progress'));
        await this.purchaseService.purchaseHealthByGems(purchaseId);
        this.toastInfo(t('purchase_successful'));
      } catch (error) {
        this.toastError(error.message);
      }
    } else {
      this.toastError(t('not_enough_gems'));
    }
  };

  /** Renders a single layout for the counts, when user is pro then
   * Show infinity no the count.
   */
  renderSingleCountUI = (imageSource, count = 0, isHealthBar) => {
    let {user} = this.props.context;
    let {isPro = false} = user;
    let centStyle = [];
    if (isHealthBar) {
      centStyle.push(s.flex1);
      centStyle.push(s.textCenter);
      centStyle.push(s.ms30);
    }
    let showCount = !isHealthBar || !isPro;
    return (
      <PopoverController>
        {({
          openPopover,
          closePopover,
          popoverVisible,
          setPopoverAnchor,
          popoverAnchorRect,
        }) => (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[s.jc]}
              disabled={isPro && isHealthBar}
              ref={setPopoverAnchor}
              onPress={openPopover}>
              <View style={[s.flexRow, s.ac, s.minh25, s.bgSilver1, s.p2, s.pe5, s.br8, s.jb]}>
                {!showCount && (
                  <Icon
                    name="infinity"
                    type="FontAwesome5"
                    style={[s.textWhite, s.f16]}
                  />
                )}
                {showCount && (
                  <Text
                    style={[
                      s.textWhite,
                      s.textShadow,
                      s.montserrat700,
                      ...centStyle,
                    ]}>{`${count}`}</Text>
                )}
              </View>
              <Image
                source={imageSource}
                style={[s.absolute, s.hw30]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Popover
              contentStyle={[s.br10, s.p15]}
              visible={popoverVisible}
              onClose={closePopover}
              placement="bottom"
              useNativeDriver={true}
              fromRect={popoverAnchorRect}
              supportedOrientations={['portrait']}>
              {imageSource === HICONS.trophy &&
                this.renderTrophyPopoverContent()}
              {imageSource === HICONS.gems && this.renderGemsPopoverContent()}
              {imageSource === HICONS.gold && this.renderGoldPopoverContent()}
              {imageSource === HICONS.health &&
                this.renderHealthPopoverContent(closePopover)}
            </Popover>
          </>
        )}
      </PopoverController>
    );
  };

  renderHealthCount = () => {
    let {user} = this.props.context;
    let {health = 0} = user;
    return this.renderSingleCountUI(HICONS.health, health, true);
  };

  /** Makes the request for calculating the free health add on backend */
  calculateFreeHealth = () => {
    Utils.request(healthURL, {}).catch((error) => {
      console.log(error);
    });
  };

  renderHealthPopoverContent = (closePopover) => {
    let {user} = this.props.context;
    let {health = 0, healthAwardedAt = {}} = user;
    let {width, healthshop} = this.state;
    let currentElapsed = Utils.elapsedSeconds(healthAwardedAt.seconds);
    let GAP_IN_SECONDS = HEALTH_AWARD_SECONDS_GAP - currentElapsed;
    if (GAP_IN_SECONDS <= 0) {
      GAP_IN_SECONDS = 0;
    }
    return (
      <View style={{width}}>
        <Text style={[s.textCenter, s.mt15]}>{t('hearts_des')}</Text>
        {health >= MAX_HEALTH && (
          <Text style={[s.textCenter, s.textDanger, s.mt10]}>
            {t('health_full')}
          </Text>
        )}
        {health < MAX_HEALTH && GAP_IN_SECONDS > 0 && (
          <>
            <Text style={[s.textCenter, s.textGrayDark, s.mt10]}>
              {t('next_health_loaded')}
            </Text>
            <CountDown
              key={`countdown_${GAP_IN_SECONDS}`}
              size={15}
              until={GAP_IN_SECONDS}
              digitStyle={s.bgTransparent}
              digitTxtStyle={s.textDanger}
              showSeparator={false}
              separatorStyle={s.textDanger}
              timeToShow={['H', 'M', 'S']}
              timeLabels={{m: null, s: null}}
              onFinish={this.calculateFreeHealth}
            />
          </>
        )}
        <View style={[s.flexRow, s.mt15, s.flex1]}>
          <TouchableOpacity
            onPress={this.loadProScreen.bind(this, closePopover)}
            style={[s.m5, s.br10, s.ofh, s.bgIceLight, s.flex1]}>
            <View style={[s.p10, s.jcac, s.flex1]}>
              <ImageBackground
                source={require('../../assets/images/heart.png')}
                style={[s.hw46, s.jcac]}
                resizeMode="contain">
                <Icon
                  name="infinity"
                  type="FontAwesome5"
                  style={[s.textWhite, s.f12]}
                />
              </ImageBackground>
              <Text
                fontWeight="700"
                style={[s.textCenter, s.textPrimary, s.mt10, s.f12]}>
                {t('unlimited_health')}
              </Text>
            </View>
            <View style={[s.bgPrimary, s.h30, s.flex0, s.jcac]}>
              <Text style={[s.textCenter, s.textWhite, s.montserrat700]}>
                PRO
              </Text>
            </View>
          </TouchableOpacity>
          {healthshop.map((shop, i) => {
            return this.renderHealthShopAvailable(closePopover, shop);
          })}
        </View>
      </View>
    );
  };

  renderHealthShopAvailable = (closePopover, shop) => {
    let {labels, gemscost, healthaward, purchaseId, defaultText} = shop;
    let label = labels[getLangCode()] || defaultText;
    let isInfinite = healthaward <= -1;
    let source = HICONS.health;
    if (isInfinite) {
      source = HICONS.heart;
    }
    return (
      <TouchableOpacity
        key={purchaseId}
        onPress={this.puchaseByGems.bind(
          this,
          closePopover,
          gemscost,
          purchaseId,
        )}
        style={[s.m5, s.mt20, s.br10, s.ofh, s.bgIceLight, s.flex1]}>
        <View style={[s.p10, s.jcac, s.flex1]}>
          <ImageBackground
            source={source}
            style={[s.hw40, s.jcac]}
            resizeMode="contain">
            {isInfinite && (
              <Icon
                name="infinity"
                type="FontAwesome5"
                style={[s.textWhite, s.f12]}
              />
            )}
            {!isInfinite && (
              <Text
                style={[
                  s.textWhite,
                  s.textShadow,
                  s.montserrat700, //for number the hardecoded monteserrat family
                ]}>
                {healthaward}
              </Text>
            )}
          </ImageBackground>
          <Text
            fontWeight="700"
            style={[s.textCenter, s.textPrimary, s.mt10, s.f12]}>
            {label}
          </Text>
        </View>
        <View style={[s.bgOrange, s.h30, s.flex0, s.jcac]}>
          <View style={[s.flexRow, s.flex0, s.ac]}>
            <Text
              fontWeight="700"
              style={[s.textCenter, s.f14, s.textWhite, s.montserrat]}>
              {gemscost}
            </Text>
            <View style={[s.ms5]} />
            <Image source={HICONS.gems} style={[s.hw15]} resizeMode="contain" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderGoldCount = () => {
    let {curTargetLanguage} = this.props.context;
    let {gold} = curTargetLanguage;
    return this.renderSingleCountUI(HICONS.gold, gold);
  };

  renderGoldPopoverContent = () => {
    return (
      <View style={[s.w200]}>
        <Text>{t('gold_des_1')}</Text>
      </View>
    );
  };

  renderGemsCount = () => {
    let {curTargetLanguage} = this.props.context;
    let {gems} = curTargetLanguage;
    return this.renderSingleCountUI(HICONS.gems, gems);
  };

  renderGemsPopoverContent = () => {
    return (
      <View style={[s.w200]}>
        <Text>{t('gems_des_1')}</Text>
      </View>
    );
  };

  renderTrophyCount = () => {
    let {curTargetLanguage} = this.props.context;
    let {trophy} = curTargetLanguage;
    return this.renderSingleCountUI(HICONS.trophy, trophy);
  };

  renderTrophyPopoverContent = () => {
    return (
      <View style={[s.w200]}>
        <Text>{t('trophy_des_1')}</Text>
        <Text style={[s.mt10]}>{t('trophy_des_2')}</Text>
      </View>
    );
  };

  render() {
    return (
      <Header
        transparent
        hasTabs={false}
        noShadow
        style={[s.flexColumn, s.bgWhite, s.headerShadow]}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={[s.flexRow, s.flex1, s.ac]}>
          <View style={[s.flex0, s.w60, s.mHor5]}>
            {this.renderHealthCount()}
          </View>
          <View style={[s.flex1, s.mHor5]}>{this.renderGoldCount()}</View>
          <View style={[s.flex1, s.mHor5]}>{this.renderGemsCount()}</View>
          <View style={[s.flex1, s.mHor5]}>{this.renderTrophyCount()}</View>
        </View>
      </Header>
    );
  }
}

export default withContext(HeaderPrimary);
