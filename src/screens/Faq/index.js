import React, {PureComponent} from 'react';
import {Accordion, View} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import Container from '../../components/Container/secondary';
import s from '../../assets/styles';
import {t} from '../../locale';
import Text from '../../components/Text';
import Iconmoon from '../../components/Icon/moon';

class HelpCenter extends PureComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = firestore()
      .doc('pages/faq')
      .onSnapshot((snap) => {
        if (snap && snap.exists) {
          this.updateState({data: snap.data().data});
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

  renderHeader(item, expanded) {
    return (
      <View style={[s.flexRow, s.p15, s.jsb, s.ac, s.bgLighter, s.br10]}>
        <Text style={[s.textGrayDark, s.montserrat500]}>{item.title}</Text>
        {expanded ? (
          <Iconmoon
            style={[s.textGrayLight]}
            name="angle-arrow-pointing-right"
          />
        ) : (
          <Iconmoon
            style={[s.textGrayLight]}
            name="angle-arrow-pointing-down"
          />
        )}
      </View>
    );
  }

  renderContent(item) {
    return (
      <Text style={[s.montserrat, s.textGray, s.textLeft, s.p10]}>
        {item.content}
      </Text>
    );
  }

  render() {
    let {data} = this.state;
    return (
      <Container
        header="blue"
        title={t('help_center')}
        style={[s.bgWhite]}
        avoidScrollView={true}>
        <Accordion
          animation={false}
          contentContainerStyle={[s.p5p]}
          dataArray={data}
          icon="add"
          expandedIcon="remove"
          expanded={[0]}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
        />
      </Container>
    );
  }
}

export default HelpCenter;
