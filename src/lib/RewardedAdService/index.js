import {Platform} from 'react-native';
import {utils} from '@react-native-firebase/app';
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';

const adUnitId =
  __DEV__ || utils().isRunningInTestLab
    ? TestIds.REWARDED
    : Platform.OS === 'ios'
    ? 'ca-app-pub-1429195201520708/1455420778'
    : 'ca-app-pub-1429195201520708/1646992465';

export default class RewardedAdService {
  constructor() {
    this.STATUS = 'loading';
    this.listeners = new Set();
  }

  getStatus = () => {
    return this.STATUS;
  };

  setStatus = (status) => {
    this.STATUS = status;
  };

  isLoading = () => {
    return this.getStatus() === 'loading';
  };

  /** Add a event listener to listen to the status changes */
  addListener = (func) => {
    this.listeners.add(func);
  };

  /** Add a event listener to listen to the status changes */
  removeListener = (func) => {
    this.listeners.delete(func);
  };

  close = () => {
    if (this.adStopListener && typeof this.adStopListener === 'function') {
      this.adStopListener();
    }
    this.listeners.clear();
  };

  init = () => {
    this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    this.loadAd();
  };

  loadAd = () => {
    this.adStopListener = this.rewardedAd.onAdEvent((type, error, reward) => {
      //console.log(error);
      if (type === RewardedAdEventType.LOADED) {
        //console.log('loaded');
        this.setStatus('loaded');
        this.fireAllListeners();
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        this.setStatus('finished');
        this.fireAllListeners();
      }
      if (type === RewardedAdEventType.CLOSED) {
        this.setStatus('closed');
        this.fireAllListeners();
      }
      /** Reload the data when user is rewarded or closed with new ad */
      if (
        type === RewardedAdEventType.EARNED_REWARD ||
        type === AdEventType.CLOSED
      ) {
        this.setStatus('loading');
        this.rewardedAd.load();
        this.fireAllListeners();
      }
    });
    this.rewardedAd.load();
  };

  fireAllListeners = () => {
    let status = this.getStatus();
    this.listeners.forEach((func) => {
      if (func && typeof func === 'function') {
        func(status);
      }
    });
  };

  show = () => {
    this.rewardedAd.show();
  };
}
