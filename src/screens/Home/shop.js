import React from 'react';
import {View} from 'native-base';
import {Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import {t} from '../../locale';
import Text from '../../components/Text';
import FastImage from '../../components/Image';
import LottieView from 'lottie-react-native';
import {consumeDealURL} from '../../lib/Constants';
import Utils from '../../lib/Utils';
const TICK = require('../../assets/animations/tick.json');

class Shop extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      shop: {},
      processing: [],
      loading: true,
    };
    this.shopRef = firestore().doc('shop/data');
  }

  componentDidMount() {
    this.unsubscribe = this.shopRef.onSnapshot((snap) => {
      let data = snap.data();
      this.updateState({shop: data});
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  goToPro = () => {
    this.props.navigation.navigate('UpgradeToPro');
  };

  consumeDeal = async (deal) => {
    try {
      let {processing} = this.state;
      processing.push(deal.key);
      this.updateState({processing});
      await Utils.request(consumeDealURL, {dealkey: deal.key});
    } catch (error) {
      this.toastError(error.message);
    }
  };

  processDeal = (deal) => {
    let {user, curTargetLanguage} = this.props.context;
    let {gold} = curTargetLanguage;
    let {cost, for_pro_only} = deal;
    if (for_pro_only) {
      if (user.isPro) {
        if (gold >= cost) {
          this.consumeDeal(deal);
        } else {
          this.toastError(t('not_enough_gold'));
        }
      } else {
        this.goToPro();
      }
    } else {
      if (gold >= cost) {
        this.consumeDeal(deal);
      } else {
        this.toastError(t('not_enough_gold'));
      }
    }
  };

  renderButton = (cost) => {
    return (
      <View style={[s.jcac, s.as, s.abs, {bottom: -15}]}>
        <View style={[s.bgSuccessLight, s.w100, s.h34, s.br10]}>
          <View style={[s.bgSuccess, s.flex1, s.br10, s.mb3, s.jcac]}>
            {cost === 0 && (
              <Text style={[s.textWhite, s.textCenter, s.montserrat700]}>
                FREE
              </Text>
            )}
            {cost !== 0 && (
              <View style={[s.flexRow, s.ac]}>
                <Text style={[s.textWhite, s.textCenter, s.montserrat700]}>
                  {cost}
                </Text>
                <View style={[s.ps5]} />
                <Image
                  source={require('../../assets/images/gold.png')}
                  style={[s.hw20]}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  renderDealUI = (deal, isConsumed) => {
    let {
      key,
      imageURL,
      cost,
      reward_type,
      reward_value,
      textColor,
      for_pro_only,
    } = deal;
    return (
      <TouchableOpacity
        disabled={isConsumed}
        activeOpacity={0.5}
        key={key}
        style={[s.flex1, isConsumed ? {opacity: 0.3} : {}]}
        onPress={this.processDeal.bind(this, deal)}>
        <View style={[s.flex1, s.h150, s.bgIce, s.br10, s.jcac]}>
          <FastImage
            source={{uri: imageURL}}
            resizeMode="contain"
            style={[s.hw80]}
          />
          <Text
            style={[
              s.mt10,
              s.mb20,
              s.f18,
              s.ucase,
              s.montserrat700,
              {color: textColor},
            ]}>
            {`${reward_value} ${reward_type}`}
          </Text>
        </View>
        {this.renderButton(cost)}
        {for_pro_only && (
          <View style={[s.abs, s.p5, s.br5, s.bgVoilet, {left: -10, top: -10}]}>
            <Image
              source={require('../../assets/images/pro.png')}
              resizeMode="contain"
              style={[s.hw20]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  renderDeal = (array) => {
    let views = [];
    let {user} = this.props.context;
    let {processing} = this.state;
    let {consumeddeals = []} = user;
    array.forEach((deal, i) => {
      let {key} = deal;
      if (i > 0) {
        views.push(<View key={`${key}_i`} style={[s.p10]} />);
      }
      let isConsumed = consumeddeals.includes(key);
      let isProcessing = processing.includes(key);
      if (!isConsumed && isProcessing) {
        views.push(
          <View
            key={`${key}_success`}
            style={[s.flex1, s.h150, s.br10, s.jcac]}>
            <LottieView
              style={[s.flex1]}
              resizeMode="contain"
              source={TICK}
              autoPlay={true}
              loop={false}
            />
          </View>,
        );
      } else {
        views.push(this.renderDealUI(deal, isConsumed));
      }
    });
    return views;
  };

  render() {
    let {isTablet, user} = this.props.context;
    let {shop} = this.state;
    let {normal = [], pro = []} = shop;
    let padStyle = isTablet ? s.p10p : s.p20;
    return (
      <Container header="primary" contentContainerStyle={[padStyle]}>
        {!user.isPro && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={[s.br20, s.bgLight, s.mb20]}
            onPress={this.goToPro}>
            <FastImage
              source={{uri: shop.imageURL}}
              resizeMode="cover"
              style={[s.bgWhite, s.aspect_4_3, s.w100p, s.br20, s.mb3]}
            />
          </TouchableOpacity>
        )}
        <View style={[s.br20, s.bgLight]}>
          <View style={[s.br20, s.mb3, padStyle, s.bgWhite]}>
            <Text fontWeight="700" style={[s.f18, s.textGrayDark]}>
              {t('daily_deals')}
            </Text>
            <View style={[s.flexRow, s.mt20]}>{this.renderDeal(normal)}</View>
            <View style={[s.flexRow, s.mt30]}>{this.renderDeal(pro)}</View>
            <View style={[s.mb20]} />
          </View>
        </View>
      </Container>
    );
  }
}

export default withContext(Shop);
