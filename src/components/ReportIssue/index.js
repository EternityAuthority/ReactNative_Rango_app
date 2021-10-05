import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Iconmoon from '../../components/Icon/moon';
import s from '../../assets/styles';
import {getLangCode, t, isRTL} from '../../locale';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

class ReportIssue extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      isModalVisible: false,
      phrases: [],
      value: '',
    };
    this.path = firestore().collection('report-problem');
    this.reportPath = firestore().collection('reported-problems');
  }

  componentDidMount() {
    this.unsubscribe = this.path.onSnapshot((snap) => {
      let phrases = [];
      if (snap && !snap.empty) {
        snap.docs.forEach((doc) => {
          let phrase = doc.data();
          phrases.push(phrase);
        });
      }
      this.updateState({phrases});
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleModal = () => {
    let {isModalVisible} = this.state;
    this.updateState({isModalVisible: !isModalVisible});
  };

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  onPress = () => {
    this.updateState({isModalVisible: true});
  };

  onValueChange = (value) => {
    if (value) {
      this.updateState({value: value, custom: false});
    } else {
      this.updateState({value: ''});
    }
  };

  onTextChange = (text) => {
    this.updateState({value: text, custom: true});
  };

  /** Save the value in the reported list */
  onSubmit = () => {
    let {value} = this.state;
    if (value && value.trim().length > 0) {
      //save the report in the db
      let {user, path} = this.props;
      let key = this.reportPath.doc().id;
      let data = {
        user: {
          uid: user.uid,
          displayName: user.displayName,
        },
        path: path,
        problem: value,
        resolved: false,
        key: key,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      this.updateState({saving: true, value: '', isModalVisible: false});
      this.reportPath
        .doc(key)
        .set(data)
        .then(() => {
          this.updateState({saving: false});
        })
        .catch((error) => {
          console.error(error);
          this.updateState({saving: false});
        });
    }
  };

  renderPhrases = () => {
    let {phrases, value} = this.state;
    let langCode = getLangCode();
    return phrases.map((p) => {
      let {key, name, defaultText} = p;
      let selected = value === defaultText;
      return (
        <View key={key} style={[s.flexRow, s.p20, s.ac, s.bb1, s.blight]}>
          <View style={[s.flex1]}>
            <Text style={[s.textGray]}>{name[langCode]}</Text>
          </View>
          <View style={[s.flex0, s.ps15]}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[
                s.blight,
                s.hw20,
                s.br5,
                selected ? s.bgPrimary : '',
                !selected ? s.b1 : '',
              ]}
              onPress={this.onValueChange.bind(this, defaultText)}
            />
          </View>
        </View>
      );
    });
  };

  render() {
    let {style = [], type = 'success'} = this.props;
    let {isModalVisible, custom, value, saving} = this.state;
    let isSucccessDisabled = !value;
    return (
      <>
        <View style={[s.abs, {right: 20, top: -20}, ...style]}>
          <Button
            disabled={saving}
            badge={true}
            type={type}
            height={s.h50.height}
            borderRadius={s.br10.borderRadius}
            onPress={this.toggleModal}>
            {saving && <ActivityIndicator size="small" color="white" />}
            {!saving && (
              <Iconmoon
                name="flag"
                style={[s.textWhite, s.ps15, s.pe15, s.f16]}
              />
            )}
          </Button>
        </View>
        <Modal
          isVisible={isModalVisible}
          animationIn="zoomIn"
          animationOut="zoomOut"
          backdropOpacity={0.5}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          onModalHide={this.onModalHide}
          onBackdropPress={this.toggleModal}
          style={[s.m0, s.jc]}>
          <View style={[s.m5p, s.bgWhite, s.br15]}>
            <View style={[s.bgLight, s.brTop15, s.p20]}>
              <Text fontWeight="700" style={[s.textGrayDark, s.f20]}>
                {t('report_problem')}
              </Text>
            </View>
            <View style={[s.maxh200]}>
              <ScrollView contentContainerStyle={s.flexGrow}>
                {this.renderPhrases()}
              </ScrollView>
            </View>
            <View style={[s.p20]}>
              <TextInput
                value={custom ? value : ''}
                placeholder={t('i_have_another_issue')}
                style={[
                  s.bb1,
                  s.blight,
                  s.mt20,
                  s.p5,
                  isRTL() ? s.textRight : s.textLeft,
                ]}
                onChangeText={this.onTextChange}
              />
            </View>
            <View style={[s.flexRow, s.ac, s.jsb]}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.toggleModal}>
                <Text fontWeight="700" style={[s.textGrayDark, s.f20, s.p20]}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                disabled={isSucccessDisabled}
                onPress={this.onSubmit}>
                <Text fontWeight="700" style={[s.textGrayDark, s.f20, s.p20]}>
                  {t('submit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

ReportIssue.propTypes = {
  path: PropTypes.string,
  style: PropTypes.array,
  type: PropTypes.string,
};

export default ReportIssue;
