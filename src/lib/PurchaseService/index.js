import Utils from '../Utils';
import {healthPurchaseByGemsURL} from '../Constants';

export default class PurchaseService {
  constructor() {}

  /**
   * Purchase by gems is a service that allows user to request the backend
   * to purchase health based on the sku id and current language and deduct gems accordingly.
   * @param {String} purchaseId
   */
  purchaseHealthByGems = async (purchaseId) => {
    try {
      let res = await Utils.request(healthPurchaseByGemsURL, {purchaseId});
      return res;
    } catch (error) {
      throw error;
    }
  };
}
