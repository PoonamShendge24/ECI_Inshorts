import React, {Component, Fragment} from 'react';
import {Platform, View} from 'react-native';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import AppContainer from './src/navigator';
import rootReducer from './src/reducers';
import {setScreenHeight} from './src/helpers/DimensionsHelper';
import * as firebase from "firebase";

console.disableYellowBox = true;
const store = createStore(rootReducer, applyMiddleware(thunk));

var firebaseConfig = {
	apiKey: "AIzaSyDpUXn9YIhr6ht0NpNv__b7h7gEuTKyj5k",
    authDomain: "inshortsdemo.firebaseapp.com",
    databaseURL: "https://inshortsdemo.firebaseio.com",
    projectId: "inshortsdemo",
    storageBucket: "inshortsdemo.appspot.com",
    messagingSenderId: "948498278341",
    appId: "1:948498278341:android:abffcc743a68a9d2420dac"
}

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}


class App extends Component {
  state = {
    isLoaded: false,
  };

  render() {
    const {isLoaded} = this.state;
    if (isLoaded) {
      return (
        <Provider store={store}>
          <AppContainer />
        </Provider>
      );
    } else {
      return (
        <View
          style={{flex: 1}}
          onLayout={event => {
            var {x, y, width, height} = event.nativeEvent.layout;
            setScreenHeight(height);
            this.setState({isLoaded: true});
          }}></View>
      );
    }
  }
}
export default App;
