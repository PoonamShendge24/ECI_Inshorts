import React, {Component, useState} from 'react';
import {
  Text,
  Button,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  AsyncStorage ,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Axios from 'axios';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import FastImage from 'react-native-fast-image';
import {getScreenHeight, getScreenWidth} from '../helpers/DimensionsHelper';
import {LIGHT_BLUE, BLACK, DARKER_GRAY, GRAY, WHITE} from '../constants/Colors';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_NORMAL,
  FONT_SIZE_SMALL,
} from '../constants/Dimens';
import {
  fetchTrendingTopics, 
  fetchTopicNews,
  selectTopic,
} from '../reducers/news';
import {
  NEWS_CATEGORIES,
  FONT_BOLD,
  FONT_BLACK,
  FONT_SIZE_REGULAR,
} from '../constants/Constants';
import {selectCategory, fetchCategoryNews} from '../reducers/news';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
const SCREEN_WIDTH = getScreenWidth();
const MARGIN_HORIZONTAL = 8;
const ITEM_WIDTH = (SCREEN_WIDTH - MARGIN_HORIZONTAL * 2) / 3;
const values=['WATCH AD','LIKE PAGE','DELETE','PAYMENTS','SERVICES','ANALYTICS'];
const menus=['AddProperty','ViewProperty','','Payments','AddServices',''];
const url =["https://www.youtube.com/embed/oa_13oxXc5k","https://www.facebook.com/shopify/"];
const {width} = Dimensions.get('window');
const frameWidth = width;
const titleText = "My Points";
const source_name = "My Page";
const source_url = "https://www.youtube.com/embed/tgbNymZ7vqY";
import {getStatusBarHeight} from 'react-native-status-bar-height';
const SCREEN_HEIGHT = getScreenHeight();
const STATUS_BAR_HEIGHT = getStatusBarHeight();
import * as firebase from "firebase";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import type { User } from '@react-native-community/google-signin';
//import config from './config'; // see docs/CONTRIBUTING.md for details
import { TokenClearingView } from './TokenClearingView';

// type ErrorWithCode = Error & { code?: string };
// 
// type State = {
//   error: ?ErrorWithCode,
// };

class LoginScreen extends React.Component {
	handleBackOnPress = () => {
     this.setState({isVisible: false});
  };
  
  
  state = {
    selectedTopic: null,
    score:0,
	myScore:0,
	isVisible:false,
	isRegister:false,
	urlIndex : -1,
	name: 'ABC',  email: 'poonam.s@ec-interactive.com', contact: '9004696929',amount: '25.74',
	userInfo: null,
    error: null,
    loggedIn : false,
    setloggedIn : false,
    userInfo : [], setuserInfo : [],
    email: null, password: null, errorMessage: null ,isVerified:false,isLoaded:false,phone:null,semail: null, spassword: null,cpassword: null
    
  };
  
  //private homeInstance: HomeScreen;
  
  constructor(props) {
        super(props);
       
    }
     
  componentDidMount(){
  console.log("Login page");
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      if (user.emailVerified === false) {
       //console.log("Email Not Verified"+user.emailVerified);
      } else {
        // successful login 
        console.log("Email Verified"+user.emailVerified);
        this.props.navigation.navigate('Main')
      }
     } else {
       //  Toast.show({ text: 'Something Wrong!', position: 'bottom', buttonText: 'No user is signed in.' }); 
     }
   });  
}

handleLogin = () => {
   console.log("handleLogin");
    if(this.state.email == null)
	{
	 this.setState({ errorMessage:'Please enter email'});
	}
	else if(this.state.password == null)
	{
	 this.setState({ errorMessage:'Please enter password'});
	}
	else{
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.setState({ errorMessage: error.message }))
  
    firebase.auth().onAuthStateChanged(user => {
    if (user) {

      if (user.emailVerified === false) {
        Alert.alert("Email Not Verified. Please verify your email first");
       // console.log("Email Not Verified"+user.emailVerified);
      } else {
		Alert.alert("Login Successful");
        // successful login 
        console.log("Email Verified"+user.emailVerified);
        this.props.navigation.navigate('Main')
      }
     } else {
       //  Toast.show({ text: 'Something Wrong!', position: 'bottom', buttonText: 'No user is signed in.' }); 
     }
   });  
   }
  
  
}
  
  signUp = () => {
   console.log("signUp click");
   this.setState({isRegister: true});
   this.setState({errorMessage: null});
}

signUpClick = () => {
	if(this.state.semail == null)
	{
	 this.setState({ errorMessage:'Please enter email'});
	}
	else if(this.state.cpassword == null || this.state.spassword == null)
	{
	 this.setState({ errorMessage:'Please enter password'});
	}
	else if(this.state.spassword != this.state.cpassword )
	{
	 this.setState({ errorMessage:'Passwords do not match'});
	}
	else if(this.state.phone == null )
	{
	 this.setState({ errorMessage:'Please enter phone number'});
	}
	else{
    const { semail, spassword } = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(semail, spassword)
      .then(function(user){
      //if(user && user.emailVerified === false){
        firebase.auth().currentUser.sendEmailVerification().then(function(){
          console.log("email verification sent to user"+user);
        });
      // }
      })
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))
      }
  }
  
backClick = () => {
   console.log("back click");
   this.setState({isRegister: false});
   this.setState({errorMessage: null});
}

  render() {
   // console.log("render called");

    return (
	!this.state.isRegister ?
	  <View style={styles.container}>
		<Text style={{fontSize: 25,color:'black',alignItems:'center',marginTop:frameWidth/30,fontFamily: 'Roboto-Bold'}}>LOGIN</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Your Email"
		   placeholderTextColor="grey"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Your Password"
		   placeholderTextColor="grey"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
		        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
		<View style={{backgroundColor:'grey',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={this.handleLogin}>
         <Text style={{fontSize: 16,color:'white'}}> LOGIN </Text>
        </TouchableOpacity>
		
		</View>
		
		<View style={{backgroundColor:'grey',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={this.signUp}>
         <Text style={{fontSize: 16,color:'white'}}> SIGN UP </Text>
        </TouchableOpacity>
		
		</View>
		
		<View style={{backgroundColor:'transparent', marginTop:frameWidth/15}}>

      </View>
      
	   </View>
	   : 
	   <View style={styles.container}>
       <View style={{flexDirection:"row",paddingTop:frameWidth/15}}>
	    <Text style={{fontSize: 25,color:'black',alignItems:'center',marginTop:frameWidth/30,fontFamily: 'Roboto-Bold'}}>REGISTER</Text>
		

		 </View>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Your Email"
		   placeholderTextColor="grey"
          onChangeText={semail => this.setState({ semail })}
          value={this.state.semail}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Your Password"
          onChangeText={spassword => this.setState({ spassword })}
          value={this.state.spassword}
        />
		<TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Confirm Password"
          onChangeText={cpassword => this.setState({ cpassword })}
          value={this.state.cpassword}
        />
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Phone No."
          onChangeText={phone => this.setState({ phone })}
          value={this.state.phone}
        />
        <View style={{backgroundColor:'grey',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={this.signUpClick}>
         <Text style={{fontSize: 16,color:'white'}}> SIGN UP </Text>
        </TouchableOpacity>
		
		</View>
		
		<View style={{backgroundColor:'grey',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={this.backClick}>
         <Text style={{fontSize: 16,color:'white'}}> BACK </Text>
        </TouchableOpacity>
		
		</View>
      </View>
	   
    );
  }
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
	backgroundColor:'white'
  },
  textInput: {
    height: 50,
    width: '80%',
	color: 'grey',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: frameWidth/30,
	fontFamily: 'Roboto-Bold'
  },
  button: {
    height: 35,
    width: 120,
    alignItems: 'center',
     justifyContent: 'center',
	fontFamily: 'Roboto-Bold'
  }
})

// export const updateScore = ()=>{
// return dispatch => {
//    // let URL = `${INSHORTS_BASE_URL}/search/trending_topics`;
//      let URL = '';
// // 	var usersRef = firebase.database().ref('data/trending_tags');
// // 		usersRef.on('child_added', (snapshot) => {
// // 		 console.log('snapshot', snapshot.child("image_url").val());
// // 		  this.state.urlArray.push(snapshot.child("image_url").val())
// 		  // dispatch({
// //           type: FETCH_TRENDING_TOPICS_SUCCESS,
// //           namespace: NAMESPACE,
// //           result: snapshot.val(),
// //         });
// //		});
// 	
// 	
// 	let that = this;
//     Axios('http://www.url.com')
//     .then(function(res) {
//       that.setState(
//         that.state
//       )
//     })
//     .then(function(data) {
//       that.setState(
//         that.state
//       )
//     })
//    };
//     
// };
// 

export default connect(
  state => ({
    trendingTopics: state.news.trendingTopics,
    selectedCategory: state.news.selectedCategory,
    selectedTopicId: state.news.selectedTopicId,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        fetchTrendingTopics,
        selectCategory,
        fetchCategoryNews,
        fetchTopicNews,
        selectTopic,
      },
      dispatch,
    ),
  }),
)(LoginScreen);

