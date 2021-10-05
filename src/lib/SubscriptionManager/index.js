import {Platform} from 'react-native';
import RNIap, {
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

const itemSubs = Platform.select({
  ios: ['month12', 'month1'],
  android: ['month12', 'month1'],
});

export default class SubscriptionManager {
  constructor() {}

  init = async () => {
    try {
      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      return;
    } catch (err) {
      return err;
    }
  };

  getSubscriptions = async () => {
    let subscriptions = await RNIap.getSubscriptions(itemSubs);
    return subscriptions;
  };

  purchaseUpdatedListener = (callback) => {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        await finishTransaction(purchase);
        callback(purchase);
      },
    );
  };

  purchaseErrorListener = (callback) => {
    this.purchaseErrorSubscription = purchaseErrorListener(callback);
  };

  purchaseSubscription = async (sku) => {
    await RNIap.requestSubscription(sku);
  };

  getPurchases = async () => {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases;
  };

  destroy = () => {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  };
}
