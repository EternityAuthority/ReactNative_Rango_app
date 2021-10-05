import 'react-native-gesture-handler';
import {setLocale, setDefaultLocale} from './src/locale';
import React, {Component} from 'react';
import {I18nManager} from 'react-native';
import {StyleProvider, Root} from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/commonColor';
import FlashMessage from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/lib/RootNavigation';
import {AppProvider} from './src/lib/AppContext';
import InitialRouting from './src/screens/InitialRouting';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import ToLearn from './src/screens/Languages/toLearn';
import ChooseLevel from './src/screens/Languages/chooseLevel';
import LearningGoals from './src/screens/Languages/goals';
import NativeLanguage from './src/screens/Languages/nativeLanguage';
import TabbedFooter from './src/components/TabbedFooter';
import ForgotPassword from './src/screens/ForgotPassword';
import UpgradeToPro from './src/screens/UpgradeToPro';
import Leagues from './src/screens/Leagues';
import Quiz from './src/screens/Quiz';
import QuizStart from './src/screens/Quiz/start';
import QuizFinish from './src/screens/Quiz/finish';
import Wordsbank from './src/screens/Wordsbank';
import Shop from './src/screens/Home/shop';
import Academy from './src/screens/Home/academy';
import Start from './src/screens/Home/start';
import League from './src/screens/Home/league';
import Profile from './src/screens/Home/profile';
import GatesSplash from './src/screens/GateSplash';
import UserDetails from './src/screens/UserDetails';
import Settings from './src/screens/Settings';
import Faq from './src/screens/Faq';
import Privacy from './src/screens/Privacy';
import Terms from './src/screens/Terms';
import Feedback from './src/screens/Feedback';
import Stories from './src/screens/Stories';
import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
import RewardedAdService from './src/lib/RewardedAdService';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import RNBootSplash from 'react-native-bootsplash';

const isTablet = DeviceInfo.isTablet();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SCREEN_OPTIONS = {
  gestureEnabled: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

/** React navigation linking and path manipulation */
const LINKING = {
  prefixes: ['https://langoo.net/app'],
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fuser: null,
      loading: true,
    };
    try {
      I18nManager.allowRTL(false);
    } catch (error) {}
  }

  /**
   * Subscribe firebase login of user.
   * Set time out give time to update the name in case of sign up.
   */
  async componentDidMount() {
    //auth().signOut();
    await admob().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    global.adsService = new RewardedAdService();
    global.adsService.init();
    this.authUnSubscribe = auth().onAuthStateChanged(async (fuser) => {
      if (fuser) {
        /** Means user is looged in, download the private data */
        const userDoc = firestore().collection('users').doc(fuser.uid);
        const userDocSnap = await userDoc.get();
        if (userDocSnap && userDocSnap.exists) {
          let user = userDocSnap.data();
          if (user.nativelanguage) {
            /** Native Language will be reference to the language table. Fetch the language details and save it in app */
            let nativelanguage = (await user.nativelanguage.get()).data();
            setLocale(nativelanguage);
          }
          let language = null;
          let curTargetLanguage = null;
          if (user.curtargetlanguage) {
            language = (await user.curtargetlanguage.get()).data();
          }
          if (user.curtargetlanguagekey) {
            let curTargetLangaugeSnap = await userDoc
              .collection('targetlanguage')
              .doc(user.curtargetlanguagekey)
              .get();
            if (curTargetLangaugeSnap && curTargetLangaugeSnap.exists) {
              curTargetLanguage = curTargetLangaugeSnap.data();
              curTargetLanguage.path = curTargetLangaugeSnap.ref.path;
            }
          }
          this.setState({
            fuser: user,
            language,
            curTargetLanguage,
            loading: false,
          });
        } else {
          setTimeout(() => {
            this.setState({fuser: fuser, loading: false});
          }, 1000);
        }
        this.hideSplash();
      } else {
        setDefaultLocale();
        this.setState({fuser, loading: false});
        this.hideSplash();
      }
    });
  }

  /** Unsubscribe the user auth */
  componentWillUnmount() {
    if (this.authUnSubscribe) {
      this.authUnSubscribe();
    }
    if (global.adsService) {
      global.adsService.close();
    }
    this.clearSplashTimer();
  }

  hideSplash = () => {
    this.splashTimer = setTimeout(() => {
      RNBootSplash.hide({fade: true});
    }, 100);
  };

  clearSplashTimer = () => {
    if (this.splashTimer) {
      clearTimeout(this.splashTimer);
    }
  };

  /** A stack navigator that returns the screen for un authorised users. */
  getUnAuthStack = () => {
    return (
      <Stack.Navigator
        screenOptions={SCREEN_OPTIONS}
        headerMode="none"
        initialRouteName="InitialRouting">
        <Stack.Screen name="InitialRouting" component={InitialRouting} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Terms" component={Terms} />
      </Stack.Navigator>
    );
  };

  renderHomeTabs = () => {
    return (
      <Tab.Navigator
        initialRouteName="Start"
        tabBar={(props) => <TabbedFooter {...props} />}>
        <Tab.Screen name="Shop" component={Shop} />
        <Tab.Screen name="League" component={League} />
        <Tab.Screen name="Start" component={Start} />
        <Tab.Screen name="Academy" component={Academy} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  };

  /** When user is fully authenticated and has his all data set */
  getAuthStack = (initialRouteName) => {
    let {fuser, language, curTargetLanguage} = this.state;
    return (
      <AppProvider
        fuser={fuser}
        language={language}
        curTargetLanguage={curTargetLanguage}
        isTablet={isTablet}>
        <Stack.Navigator
          screenOptions={SCREEN_OPTIONS}
          headerMode="none"
          initialRouteName={initialRouteName}>
          <Stack.Screen name="ToLearn" component={ToLearn} />
          <Stack.Screen name="NativeLanguage" component={NativeLanguage} />
          <Stack.Screen name="LearningGoals" component={LearningGoals} />
          <Stack.Screen name="ChooseLevel" component={ChooseLevel} />
          <Stack.Screen name="Home" component={this.renderHomeTabs} />
          <Stack.Screen name="UpgradeToPro" component={UpgradeToPro} />
          <Stack.Screen name="Leagues" component={Leagues} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="QuizStart" component={QuizStart} />
          <Stack.Screen name="QuizFinish" component={QuizFinish} />
          <Stack.Screen name="GatesSplash" component={GatesSplash} />
          <Stack.Screen name="Wordsbank" component={Wordsbank} />
          <Stack.Screen name="UserDetails" component={UserDetails} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Faq" component={Faq} />
          <Stack.Screen name="Privacy" component={Privacy} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Feedback" component={Feedback} />
          <Stack.Screen name="Stories" component={Stories} />
        </Stack.Navigator>
      </AppProvider>
    );
  };

  /** Returns routing screens based on the user state.
   * If user is logged in but some data is missing then load post auth stack.
   */
  getNavigationContainer = () => {
    let {fuser, loading} = this.state;
    if (loading) {
      return null;
    } else {
      if (fuser) {
        // let initialRoute = 'ToLearn';
        // let {curtargetlanguage, nativelanguage, goal} = fuser;
        // if (curtargetlanguage && nativelanguage && goal) {
        //   initialRoute = 'Home';
        // }
        /** A temp update, since we have only one target language (english) we dont need to show to learn part
         * and hard code it in native language. remove this when we have other learn options.
         */
        let initialRoute = 'ChooseLevel';
        let {nativelanguage, goal, englishlevel} = fuser;
        if (nativelanguage && englishlevel && goal) {
          initialRoute = 'Home';
        }
        return this.getAuthStack(initialRoute);
      } else {
        return this.getUnAuthStack();
      }
    }
  };

  render() {
    let {fuser} = this.state;
    return (
      <Root>
        <StyleProvider style={getTheme(commonTheme)}>
          <NavigationContainer
            key={fuser}
            linking={LINKING}
            ref={navigationRef}>
            {this.getNavigationContainer()}
          </NavigationContainer>
        </StyleProvider>
        <FlashMessage position="bottom" />
      </Root>
    );
  }
}

export default App;
