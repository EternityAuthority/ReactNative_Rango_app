import Voice from '@react-native-voice/voice';
import {DeviceEventEmitter} from 'react-native';

export default class VoiceService {
  constructor() {
    Voice.onSpeechResults = this.onSpeechResults;
  }

  onSpeechResults = (e) => {
    let valuesArray = e.value;
    let value = valuesArray[0];
    //console.log(valuesArray);
    DeviceEventEmitter.emit('voiceCommandEmitter', {value: value});
  };

  destroy = () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };

  start = async (langCCCode) => {
    try {
      await Voice.start(langCCCode);
    } catch (e) {
      console.error(e);
    }
  };

  stop = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
}
