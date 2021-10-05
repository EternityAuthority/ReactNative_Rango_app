import {Component} from 'react';
import {Alert} from 'react-native';
import s from '../../assets/styles';
import {showMessage} from 'react-native-flash-message';
import {getLocale} from '../../locale';
const m = getLocale();

class ParentComponent extends Component {
  constructor(props) {
    super();
  }

  /**
   * A generic method to show the alert modal.
   * @param {String} title
   * @param {String} message
   * @param {Boolean} cancelables
   */
  alert(title, message, cancelables, onOkPress) {
    cancelables ? cancelables : true;
    Alert.alert(
      title,
      message,
      [{text: m.cancel}, {text: m.ok, onPress: onOkPress}],
      {
        cancelable: cancelables,
      },
    );
  }

  /**
   * Shows a generic toast message for the screens
   * @param {} message
   */
  toastSuccess = (message) => {
    showMessage({
      message: message,
      duration: 3000,
      floating: true,
      titleStyle: {
        fontSize: s.textSizeBase.fontSize,
        textAlign: 'center',
        color: 'white',
      },
      type: 'success',
    });
  };

  toastError = (message) => {
    showMessage({
      message: message,
      duration: 3000,
      floating: true,
      titleStyle: {
        fontSize: s.textSizeBase.fontSize,
        textAlign: 'center',
        color: 'white',
      },
      type: 'danger',
    });
  };

  toastInfo = (message) => {
    showMessage({
      message: message,
      duration: 3000,
      floating: true,
      titleStyle: {
        fontSize: s.textSizeBase.fontSize,
        textAlign: 'center',
        color: 'white',
      },
      type: 'info',
    });
  };
}

export default ParentComponent;
