import {Player} from '@react-native-community/audio-toolkit';

/**
 * Audio service that helps in audio playback
 */
export default class AudioService {
  constructor(options, targetLang, onPlayCompleteCallback) {
    this.players = [];
    this.preparedCount = 0;
    this.listeners = new Set();
    options.forEach((option, i) => {
      if (option.audioURL) {
        this.players[i] = new Player(option.audioURL[targetLang], {
          autoDestroy: false,
        });
        this.players[i].prepare(this.onAudioPrepare);
        if (
          onPlayCompleteCallback &&
          typeof onPlayCompleteCallback === 'function'
        ) {
          this.players[i].on('ended', onPlayCompleteCallback);
        }
      }
    });
  }

  onAudioPrepare = () => {
    this.preparedCount++;
    this.fireAllListeners();
  };

  getStatus = () => {
    if (this.players.length === this.preparedCount) {
      return 'loaded';
    } else {
      return 'loading';
    }
  };

  /** Add a event listener to listen to the status changes */
  addAllPreparedListener = (func) => {
    this.listeners.add(func);
  };

  /** Add a event listener to listen to the status changes */
  removeAllPreparedListener = (func) => {
    this.listeners.delete(func);
  };

  fireAllListeners = () => {
    let status = this.getStatus();
    if (status === 'loaded') {
      this.listeners.forEach((func) => {
        if (func && typeof func === 'function') {
          func(status);
        }
      });
    }
  };

  /** Stop previously playing audio */
  stopPlaying = () => {
    this.players.forEach((player) => {
      player.stop();
    });
  };

  /**
   * Plays the audio on specified index
   * @param {Number} index
   */
  playIndex = (index, startCallback) => {
    this.stopPlaying();
    let player = this.players[index];
    if (player && player.isPrepared) {
      player.speed = 1;
      player.play(startCallback);
    }
  };

  /** Slows down the audio index */
  playIndexSlow = (index, startCallback) => {
    this.stopPlaying();
    let player = this.players[index];
    if (player && player.isPrepared) {
      player.speed = 0.5;
      player.play(startCallback);
    }
  };

  destroy = () => {
    if (this.players && this.players.length > 0) {
      this.players.forEach((player) => {
        if (player) {
          player.destroy();
        }
      });
    }
  };
}
