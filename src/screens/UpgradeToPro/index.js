import React from 'react';
import {Spinner, View} from 'native-base';
import {ImageBackground, Image, Dimensions} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import Button from '../../components/Button';
import Text from '../../components/Text';
import FastImage from '../../components/Image';
import Iconmoon from '../../components/Icon/moon';
import s from '../../assets/styles';
import {getLangCode, t} from '../../locale';
import ButtonText from '../../components/Text/buttonText';
import Utils from '../../lib/Utils';
import {claimTrial, recieptValidationURL} from '../../lib/Constants';
import SubscriptionManager from '../../lib/SubscriptionManager';

const SKUS = {
  month12: 'month12',
  month1: 'month1',
};

class UpgradeToPro extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    let {width} = Dimensions.get('window');
    let {user} = props.context;
    this.state = {
      width: width,
      slideshow: {},
      purchasing: null,
      products: {
        month12: {
          title: t('twelve_month'),
          price: 0,
        },
        month1: {
          title: t('one_month'),
          price: 0,
        },
      },
      loading: true,
      loadingSku: true,
      selected: SKUS.month12,
    };
    this.slideshowRef = firestore().doc('pro-features-slideshow/slides');
    this.purchaseColl = firestore()
      .doc(`purchases/${user.uid}`)
      .collection('transactions');
    this.subscriptionManager = new SubscriptionManager();
  }

  async componentDidMount() {
    try {
      let {route = {}} = this.props;
      let {params = {}} = route;
      if (params.ads && !global.adsService.isLoading()) {
        global.adsService.show();
      }
    } catch (e) {}
    this.unsubscribe = this.slideshowRef.onSnapshot((snap) => {
      if (snap && snap.exists) {
        let slideshow = snap.data();
        this.updateState({slideshow, loading: false});
      }
    });
    try {
      await this.subscriptionManager.init();
      const subscriptions = await this.subscriptionManager.getSubscriptions();
      let {products} = this.state;
      subscriptions.forEach((sus) => {
        let p = products[sus.productId] || {};
        p.price = sus.localizedPrice;
        products[sus.productId] = p;
      });
      this.updateState({products, loadingSku: false});
    } catch (err) {
      this.toastError(err.message);
    }
    this.subscriptionManager.purchaseUpdatedListener(async (purchase) => {
      const {transactionReceipt, transactionId} = purchase;
      if (transactionReceipt) {
        try {
          await this.purchaseColl
            .doc(transactionId)
            .set(purchase, {merge: true});
          await Utils.request(recieptValidationURL, purchase);
          this.updateState({purchasing: null});
        } catch (ackErr) {
          this.updateState({purchasing: null});
          this.toastError(ackErr.message);
        }
      }
    });
    this.subscriptionManager.purchaseErrorListener((error) => {
      this.toastError(error.message);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.subscriptionManager.destroy();
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  goBack = () => {
    let {navigation} = this.props;
    navigation.goBack();
  };

  purchaseSubscription = async (next) => {
    try {
      let {selected} = this.state;
      this.updateState({purchasing: true});
      await this.subscriptionManager.purchaseSubscription(selected);
      next();
    } catch (err) {
      this.updateState({purchasing: false});
      this.toastError(err.message);
      next();
    }
  };

  setSelectedSKU = (sku) => {
    this.updateState({selected: sku});
  };

  claimTrial = (next) => {
    Utils.request(claimTrial, {})
      .then((res) => {
        next();
        this.toastSuccess(t('trial_activated'));
      })
      .catch((error) => {
        this.toastError(error.message);
      });
  };

  renderSlide = ({item}) => {
    let {width} = this.state;
    let {imageURL, defaultText, title = {}} = item;
    let langCode = getLangCode();
    let label = title[langCode] ? title[langCode] : defaultText;
    return (
      <View style={[s.flex0, s.ac, s.mb20, {width: width}]}>
        <FastImage
          source={{uri: imageURL}}
          style={s.img250}
          resizeMode="contain"
        />
        <Text
          style={[
            s.textCenter,
            s.me10p,
            s.ms10p,
            s.mb20,
            s.f20,
            s.textPrimaryDarker,
          ]}>
          {label}
        </Text>
      </View>
    );
  };

  renderSlideShow = () => {
    let {slideshow} = this.state;
    let {slides = []} = slideshow;
    return (
      <SwiperFlatList
        autoplay
        autoplayDelay={5}
        index={0}
        autoplayLoop
        autoplayDirection
        showPagination
        paginationActiveColor={s.textPrimaryDarker.color}
        paginationDefaultColor={s.textGrayLight.color}
        paginationStyleItem={[s.hw10, s.mHor5]}
        data={slides}
        initialNumToRender={5}
        updateCellsBatchingPeriod={100}
        renderItem={this.renderSlide}
      />
    );
  };

  renderProMember = () => {
    return (
      <View style={[s.m10p]}>
        <Text fontWeight="700" style={[s.textGrayDark, s.textCenter, s.f20]}>
          {t('congratulations')}
        </Text>
        <Text style={[s.textGrayDark, s.textCenter, s.mt10]}>
          {t('you_are_pro')}
        </Text>
      </View>
    );
  };

  renderPurchasePackages = () => {
    let {user} = this.props.context;
    let {products, loadingSku, selected} = this.state;
    if (loadingSku) {
      return <Spinner color="white" />;
    }
    if (user.isPro) {
      return this.renderProMember();
    }
    return (
      <View style={[s.ms10p, s.me10p]}>
        <View>
          <Button
            type="ice"
            stretch={true}
            progress={true}
            height={s.h70.height}
            onPress={this.setSelectedSKU.bind(this, SKUS.month12)}
            style={[
              {
                borderColor:
                  selected === SKUS.month12
                    ? s.textPrimaryDark.color
                    : s.textGrayLight.color,
              },
              s.jsb,
            ]}>
            <ButtonText
              style={[
                s.flex0,
                s.f18,
                s.ms30,
                selected === SKUS.month12 ? s.textPrimaryDark : s.textGray,
              ]}>
              {t('twelve_month')}
            </ButtonText>
            <ButtonText
              style={[
                s.flex0,
                s.f14,
                s.textCenter,
                s.me30,
                selected === SKUS.month12 ? s.textPrimaryDark : s.textGray,
              ]}>
              {products.month12.price}
              {'\n'}
              {t('yearly')}
            </ButtonText>
          </Button>
          <Button
            type="ice"
            stretch={true}
            progress={true}
            height={s.h70.height}
            onPress={this.setSelectedSKU.bind(this, SKUS.month1)}
            style={[
              s.mt20,
              {
                borderColor:
                  selected === SKUS.month1
                    ? s.textPrimaryDark.color
                    : s.textGrayLight.color,
              },
              s.jsb,
            ]}>
            <ButtonText
              style={[
                s.flex0,
                s.f18,
                s.ms30,
                selected === SKUS.month1 ? s.textPrimaryDark : s.textGray,
              ]}>
              {t('one_month')}
            </ButtonText>
            <ButtonText
              style={[
                s.flex0,
                s.f14,
                s.textCenter,
                s.me30,
                selected === SKUS.month1 ? s.textPrimaryDark : s.textGray,
              ]}>
              {products.month1.price}
              {'\n'}
              {t('monthly')}
            </ButtonText>
          </Button>
          <View
            style={[
              s.abs,
              s.absRight,
              s.jcac,
              s.p5,
              s.ps10,
              s.pe10,
              s.br20,
              s.mt_15,
              s.bgDangerSoft,
            ]}>
            <Text fontWeight="500" style={[s.textWhite, s.f14]}>
              {t('get_25_off')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let {user} = this.props.context;
    let {loading, loadingSku, purchasing} = this.state;
    return (
      <ImageBackground
        source={require('../../assets/images/radialback.png')}
        style={[s.hw100p]}
        resizeMode="cover">
        {loading && (
          <View style={[s.flex1, s.jcac]}>
            <Spinner color="white" />
          </View>
        )}
        {!loading && (
          <Container style={[s.bgTransparent, s.safeArea]} header="none">
            <View style={[s.flex1, s.jc]}>
              <Image
                source={require('../../assets/images/langoopro.png')}
                resizeMode="contain"
                style={[s.flex0, s.as, s.mt20, s.mb20]}
              />
              <View style={[s.flexRow, s.jcac]}>{this.renderSlideShow()}</View>
              <View style={[s.mt20]}>{this.renderPurchasePackages()}</View>
              <View style={[s.mt30, s.ms10p, s.me10p, s.mb10]}>
                {!user.isPro && (
                  <Button
                    stretch={true}
                    progress={true}
                    onPress={this.purchaseSubscription}>
                    {!user.trialused && (
                      <ButtonText>{t('try_7_free')}</ButtonText>
                    )}
                    {user.trialused && (
                      <ButtonText>{t('subscribe')}</ButtonText>
                    )}
                  </Button>
                )}
              </View>
            </View>
            <View style={[s.abs, s.absEnd]}>
              <Button
                disabled={loadingSku || purchasing}
                badge={true}
                type="danger"
                height={s.h36.height}
                borderRadius={s.br10.borderRadius}
                onPress={this.goBack}>
                <Iconmoon
                  name="cancel"
                  style={[s.textWhite, s.ps10, s.pe10, s.f14]}
                />
              </Button>
            </View>
          </Container>
        )}
      </ImageBackground>
    );
  }
}

export default withContext(UpgradeToPro);
