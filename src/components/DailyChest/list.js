import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import s from '../../assets/styles';
import {Image} from 'react-native';
import Text from '../Text';
import {getLangCode, t} from '../../locale';
import Utils from '../../lib/Utils';
import Chest from './chest';
import Button from '../Button';
import FastImage from '../Image';
import Icon from '../Icon';
import ButtonText from '../Text/buttonText';
import {HICONS} from '../Header/primary';

class DailyChestList extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      todaysdeal: {},
      exist: false,
      isModalVisible: false,
      current: {},
      langCode: getLangCode(),
      unlockedDeals: {},
    };
    this.dealTypes = firestore().collection('daily-deals-list');
    this.todaysDeal = firestore().collection('daily-deals-schedule');
  }

  async componentDidMount() {
    let {user} = this.props;
    let running = null;
    /*
     * check whether user has any current deal running in opening state,
     * then we have to replace that no deal with the next one. this deal will take priority.
     */
    if (user.unlockedDeals && user.unlockedDeals.todaysdealkey) {
      let scheduledData = await firestore()
        .doc(`daily-deals-schedule/${user.unlockedDeals.todaysdealkey}`)
        .get();
      if (scheduledData.exists) {
        running = scheduledData.data().deals[user.unlockedDeals.index];
        running.index = user.unlockedDeals.index;
      }
    }
    let dealTypeSnap = await this.dealTypes.get();
    let dealsType = {};
    if (dealTypeSnap && !dealTypeSnap.empty) {
      dealTypeSnap.docs.forEach((d) => {
        let data = d.data();
        dealsType[data.key] = data;
      });
    }
    //Which days it is for me after i signed up.
    let {
      createdAt: {seconds},
    } = user;
    let days = Utils.elapsedDays(seconds) % 365;
    this.unsubscribe = this.todaysDeal
      .where('no', '==', days)
      .limit(1)
      .onSnapshot((snap) => {
        if (snap && !snap.empty) {
          let todaysdeal = snap.docs[0].data();
          if (running) {
            todaysdeal.deals[running.index] = running;
          }
          /** Loop all deals in the todays deal and update the values of names and imageURL, to reflect the updated details */
          todaysdeal.deals.forEach((td, i) => {
            let {key} = td; //here the key is deal key
            td.name = dealsType[key].name;
            td.imageURL = dealsType[key].imageURL;
          });
          //todaysdeal.deals = todaysdeal.deals.filter((tf) => !tf.disabled);
          this.updateState({todaysdeal, exist: true});
        } else {
          this.updateState({exist: false});
        }
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

  toggleModal = () => {
    let {isModalVisible} = this.state;
    this.updateState({isModalVisible: !isModalVisible});
  };

  setCurrentChest = (item, index) => {
    item.index = index;
    this.updateState({current: item, isModalVisible: true});
  };

  unlockChestForUser = async (next) => {
    let {current, todaysdeal} = this.state;
    let {user} = this.props;
    let userRef = firestore().doc(`users/${user.uid}`);
    await userRef.update({
      unlockedDeals: {
        processing: true,
        dealkey: current.key,
        todaysdealkey: todaysdeal.key,
        unlockedAt: firestore.FieldValue.serverTimestamp(),
        index: current.index,
      },
    });
    this.updateState({isModalVisible: false});
    next();
  };

  getIconSourceForReward = (rewardType) => {
    switch (rewardType) {
      case 'health':
        return HICONS.health;
      case 'gems':
        return HICONS.gems;
      case 'trophy':
        return HICONS.trophy;
      case 'gold':
        return HICONS.gold;
    }
  };

  checkIdDealIsUnlockable = () => {
    let {user} = this.props;
    let result = true;
    if (user.unlockedDeals && user.unlockedDeals.processing) {
      result = false;
    }
    return result;
  };

  renderItem = (item, index, isUnlockable) => {
    let {todaysdeal} = this.state;
    let {isTablet, user, gems} = this.props;
    let {unlockedDeals, claimedDeals = []} = user;
    let {imageURL, unlockTime} = item;
    let unlocketAt = null;
    if (unlockedDeals && unlockedDeals.dealkey === item.key) {
      unlocketAt = unlockedDeals.unlockedAt;
    }
    let claimed = claimedDeals.includes(`${todaysdeal.key}${item.key}`);
    return (
      <Chest
        claimed={claimed}
        unlockable={isUnlockable}
        unlockedAt={unlocketAt}
        imageURL={imageURL}
        unlockTime={unlockTime}
        isTablet={isTablet}
        gems={gems}
        onPress={this.setCurrentChest.bind(this, item, index)}
      />
    );
  };

  renderOpenDealModal = () => {
    let {langCode, current} = this.state;
    return (
      <>
        <View style={[s.h80]}>
          <FastImage
            source={{uri: current.imageURL}}
            style={[s.img150, s.absolute, s.mt_90, s.as]}
            resizeMode="contain"
          />
        </View>
        <Text
          fontWeight="700"
          style={[s.f20, s.ucase, s.textCenter, s.textGrayDark]}>
          {!!current.name && !!current.name[langCode]
            ? current.name[langCode]
            : current.defaultText}
        </Text>
        <Text style={[s.textCenter, s.textGray, s.mt10]}>
          {t('learn_new_vocab')}
        </Text>
        <View style={[s.flexRow, s.jcac, s.mt40]}>
          <Image
            source={this.getIconSourceForReward(current.rewardtype)}
            style={[s.hw30]}
            resizeMode="contain"
          />
          <View style={[s.ps5, s.pe5]} />
          <Text fontWeight="700" style={[s.montserrat, s.textCenter, s.f22]}>
            {current.rewardvalue}
          </Text>
        </View>
        <View style={[s.p5p, s.mt10]}>
          <Button
            stretch={true}
            progress={true}
            onPress={this.unlockChestForUser}>
            <View style={[s.flexRow, s.w100p, s.ac, s.jsb]}>
              <ButtonText fontWeight="700" style={[s.ps20, s.f18]}>
                {t('start_unlock')}
              </ButtonText>
              <View style={[s.flexRow, s.ac]}>
                <ButtonText style={[s.f18, s.montserrat700]}>
                  {Utils.secondsToHM(current.unlockTime)}
                </ButtonText>
                <Icon
                  name="clock-o"
                  type="FontAwesome"
                  style={[s.f20, s.ms5, s.me20, s.textYellow]}
                />
              </View>
            </View>
          </Button>
        </View>
      </>
    );
  };

  render() {
    let {isTablet} = this.props;
    let {todaysdeal, exist, isModalVisible} = this.state;
    let isUnlockable = this.checkIdDealIsUnlockable();
    if (exist) {
      let deals = todaysdeal.deals;
      let gap = isTablet ? s.ms5p : s.ms5;
      let views = [];
      deals.forEach((deal, i) => {
        views.push(
          <View key={deal.key} style={[s.flex1]}>
            {this.renderItem(deal, i, isUnlockable)}
          </View>,
        );
        if (i < deals.length - 1) {
          views.push(<View key={`${deal.key}_${i}`} style={[gap]} />);
        }
      });
      return (
        <>
          <View style={[s.flexRow]}>{views}</View>
          <Modal
            isVisible={isModalVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            onBackdropPress={this.toggleModal}
            onBackButtonPress={this.toggleModal}>
            <View style={[s.bgWhite, s.p20, s.br15]}>
              {this.renderOpenDealModal()}
            </View>
          </Modal>
        </>
      );
    } else {
      return null;
    }
  }
}

DailyChestList.propTypes = {
  user: PropTypes.object,
};

export default DailyChestList;
