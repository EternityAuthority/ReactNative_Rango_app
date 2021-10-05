import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SubscriptionManager from '../SubscriptionManager';
import Utils from '../Utils';
import {recieptValidationURL} from '../Constants';

/** Create a main app context */
export const AppContext = React.createContext();

/** Intialise the context with some details of the firebase user */
export class AppProvider extends Component {
  constructor(props) {
    super(props);
    let {
      uid,
      displayName,
      photoURL,
      age,
      curtargetlanguage,
      curtargetlanguagekey,
      nativelanguage,
      createdAt,
    } = props.fuser;
    this.state = {
      user: {
        uid,
        displayName,
        photoURL,
        age,
        createdAt,
        curtargetlanguage,
        curtargetlanguagekey,
        nativelanguage,
      },
      leagues: props.leagues || [],
      language: props.language || {},
      curTargetLanguage: props.curTargetLanguage || {},
      isTablet: props.isTablet,
    };
  }

  async componentDidMount() {
    this.subscribeUser();
    this.subscribeCurrentTargetLanguage();
    this.subscribeToLanguage();
    this.subscribeToLeagues();
    global.signOut = this.signOut;
    try {
      this.subscriptionManager = new SubscriptionManager();
      await this.subscriptionManager.init();
      let purchases = await this.subscriptionManager.getPurchases();
      if (purchases.length > 0) {
        await Utils.request(recieptValidationURL, purchases[0]);
      }
    } catch (err) {}
  }

  componentWillUnmount() {
    this.unsubscribeAll();
  }

  signOut = async () => {
    this.unsubscribeAll();
    await auth().signOut();
  };

  componentDidUpdate(prevProps, prevState) {
    let {user} = this.state;
    if (
      user &&
      user.curtargetlanguagekey !== prevState.user.curtargetlanguagekey
    ) {
      /** unsubscribe depedent data */
      this.unsubscribeCurrentTargetLanguage();
      this.unsubscribeToLanguage();
      this.unsubscribeToLeagues();

      /** Resubscribe dependent data */
      this.subscribeCurrentTargetLanguage();
      this.subscribeToLanguage();
      this.subscribeToLeagues();
    }
  }

  unsubscribeAll = () => {
    this.unsubscribeToLanguage();
    this.unsubscribeCurrentTargetLanguage();
    this.unsubscribeToLeagues();
    this.unsubscribeUser();
  };

  /** Subscribes the user for the shanpshot changes from the server */
  subscribeUser = () => {
    let {user} = this.state;
    const userDoc = firestore().collection('users').doc(user.uid);
    this.unSubscribePrivate = userDoc.onSnapshot((userPrivate) => {
      if (userPrivate && userPrivate.exists) {
        let dbUserP = userPrivate.data();
        this.setState({user: dbUserP});
      }
    });
  };

  /** unsubscribe from the firebase user snapshot listener */
  unsubscribeUser = () => {
    if (
      this.unSubscribePrivate &&
      typeof this.unSubscribePrivate === 'function'
    ) {
      this.unSubscribePrivate();
    }
  };

  subscribeToLanguage = () => {
    let {user} = this.state;
    let {curtargetlanguagekey} = user;
    if (curtargetlanguagekey) {
      this.unSubscribeLanguage = firestore()
        .doc(`languages/${curtargetlanguagekey}`)
        .onSnapshot((snap) => {
          if (snap && snap.exists) {
            let d = snap.data();
            this.setState({language: d});
          }
        });
    }
  };

  unsubscribeToLanguage = () => {
    if (
      this.unSubscribeLanguage &&
      typeof this.unSubscribeLanguage === 'function'
    ) {
      this.unSubscribeLanguage();
    }
  };

  subscribeCurrentTargetLanguage = () => {
    let {user} = this.state;
    let {curtargetlanguagekey, uid} = user;
    if (curtargetlanguagekey) {
      this.unSubscribeTargetLanguage = firestore()
        .doc(`users/${uid}`)
        .collection('targetlanguage')
        .doc(curtargetlanguagekey)
        .onSnapshot((snap) => {
          if (snap && snap.exists) {
            let targetLanguageData = snap.data();
            targetLanguageData.path = snap.ref.path;
            this.setState({curTargetLanguage: targetLanguageData});
          }
        });
    }
  };

  unsubscribeCurrentTargetLanguage = () => {
    if (
      this.unSubscribeTargetLanguage &&
      typeof this.unSubscribeTargetLanguage === 'function'
    ) {
      this.unSubscribeTargetLanguage();
    }
  };

  subscribeToLeagues = () => {
    let {user} = this.state;
    let {curtargetlanguagekey} = user;
    if (curtargetlanguagekey) {
      this.unSubscribeLeagues = firestore()
        .doc(`languages/${curtargetlanguagekey}`)
        .collection('leagues')
        .where('published', '==', true)
        .orderBy('trophies', 'asc')
        .onSnapshot((leaguesSnap) => {
          let leagues = [];
          if (leaguesSnap && !leaguesSnap.empty) {
            leaguesSnap.docs.forEach((doc) => {
              let league = doc.data();
              league.path = doc.ref.path;
              leagues.push(league);
            });
          }
          this.setState({leagues: leagues});
        });
    }
  };

  unsubscribeToLeagues = () => {
    if (
      this.unSubscribeLeagues &&
      typeof this.unSubscribeLeagues === 'function'
    ) {
      this.unSubscribeLeagues();
    }
  };

  render() {
    let {user, curTargetLanguage, language, leagues, isTablet} = this.state;
    return (
      <AppContext.Provider
        value={{user, curTargetLanguage, language, leagues, isTablet}}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

// create the consumer as higher order component
export const withContext = (ChildComponent) => (props) => (
  <AppContext.Consumer>
    {(context) => <ChildComponent {...props} context={context} />}
  </AppContext.Consumer>
);
