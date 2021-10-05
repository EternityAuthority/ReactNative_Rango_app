import React, {PureComponent} from 'react';
import firestore from '@react-native-firebase/firestore';
import Container from '../../components/Container/secondary';
import s from '../../assets/styles';
import {t} from '../../locale';
import {WebView} from 'react-native-webview';

class Terms extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      html: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = firestore()
      .doc('pages/terms')
      .onSnapshot((snap) => {
        if (snap && snap.exists) {
          if (snap && snap.exists) {
            let html = `<html><head><style>*{font-size: 40px;line-height: 140%;}</style><body>${
              snap.data().text
            }</body></head></html>`;
            this.updateState({html});
          }
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

  render() {
    let {html} = this.state;
    return (
      <Container
        header="blue"
        title={t('terms')}
        style={[s.bgWhite]}
        avoidScrollView={true}>
        <WebView
          originWhitelist={['*']}
          source={{html: html}}
          style={[s.flexGrow]}
          containerStyle={s.p5p}
        />
      </Container>
    );
  }
}

export default Terms;
