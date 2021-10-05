import React from 'react';
import {View} from 'native-base';
import ParentComponent from '../../components/ParentComponent';
import Container from '../../components/Container/secondary';
import DailyChestList from '../../components/DailyChest/list';
import {withContext} from '../../lib/AppContext';
import s from '../../assets/styles';
import LevelView from '../../components/LevelView';

class Start extends ParentComponent {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {};
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  render() {
    let {navigation} = this.props;
    let {user, curTargetLanguage, isTablet} = this.props.context;
    let {gems = 0} = curTargetLanguage;
    return (
      <Container header="primary">
        <View style={[s.flex1]}>
          <View style={[s.flex1, s.jcac]}>
            <LevelView
              curTargetLanguage={curTargetLanguage}
              navigation={navigation}
              user={user}
            />
          </View>
          <View style={[s.flex0, s.m5p]}>
            <DailyChestList gems={gems} user={user} isTablet={isTablet} />
          </View>
        </View>
      </Container>
    );
  }
}

export default withContext(Start);
