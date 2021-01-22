import React, {Component,useState} from 'react';
import {View, StyleSheet, StatusBar, Platform, Text,AsyncStorage,TouchableOpacity,NativeModules} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import MenuNavigationScreen from './MenuNavigationScreen';
import NewsStackScreen from './NewsStackScreen';
import WebScreen from './WebScreen';
import AdminScreen from './AdminScreen';
import Carousel from 'react-native-snap-carousel';
import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';
import {BLACK} from '../constants/Colors';
import {setWebViewVisiblity, fetchCategoryNews} from '../reducers/news';
import {bindActionCreators} from 'redux';
import ShortsLoader from '../components/ShortsLoader';
const screens = ['menu-navigation', 'news-stack', 'web'];
import {getStatusBarHeight} from 'react-native-status-bar-height';
const SCREEN_HEIGHT = getScreenHeight();
const STATUS_BAR_HEIGHT = getStatusBarHeight();
const SCREEN_WIDTH = getScreenWidth();
const titleText = "My Points";
import axios from 'axios';
// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");
// myHeaders.append("Accept", "application/json");
// 
// var raw = JSON.stringify(
// {"client_id":"lvH2uQAXl4MV9b8GC9r4GhWxDKBWmXmh",
//  "client_secret":"3OuUD7C7xr-qrtUQGBQrkZ0qKq2hqw-KSJPb0vfAAJCwApqaAEZf8ZlnGmPIPep",
//  "grant_type":"client_credentials","audience":"https://topups.reloadly.com"}
// );

// import { Auth } from 'aws-amplify';
// import Amplify from "@aws-amplify/core";
// import awsconfig from './aws-exports';
// 
// Amplify.configure(awsconfig);
const AllInOneSDKManager = NativeModules.AllInOneSDKManager;
// const username = 'poonam.shendge@yahoo.com';
// const password = 'Tanishka24';
// const email = 'poonam.shendge@yahoo.com';
// const phone_number = 9967591334;
var jsonString = "";
class HomeScreen extends Component {
  // shouldComponentUpdate = nextProps => {
  //   const currentProps = this.props;
  //   return true;
  //   if (currentProps.isNewsListEmpty !== nextProps.isNewsListEmpty) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  state = {
	myScore:0,
	data : [],
  };
  
  
    constructor(props) {
        super(props);
        //this.saveData = this.saveData.bind(this);
       // this.updateState = this.updateState.bind(this);
        //console.log("saveData value is "+this.state.myScore);
       // this.fetchAccessToken();
        //this.fetchAccountBalance();
        //this.getOperator();
        //this.topUp();
       
    }
  
 //const displayResult = (result) => { setShowToast(result); }
  
  async fetchAccessToken(){
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

var raw = JSON.stringify(
{"client_id":"lvH2uQAXl4MV9b8GC9r4GhWxDKBWmXmh",
 "client_secret":"3OuUD7C7xr-qrtUQGBQrkZ0qKq2hqw-KSJPb0vfAAJCwApqaAEZf8ZlnGmPIPep",
 "grant_type":"client_credentials","audience":"https://topups-sandbox.reloadly.com"}
);


// var raw = JSON.stringify(
// {"client_id":"kBUgXV10ip5nKDnsm4VgkCVQhPFeGNPI",
//  "client_secret":"aqzoB9XFmB-q5Ni39mb6GuA45FnisB-vfZWNKTNk4su3T22jyiC9Kj97gy6RKf7",
//  "grant_type":"client_credentials","audience":"https://topups.reloadly.com"}
// );

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://auth.reloadly.com/oauth/token", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  
  
  }
  
   async fetchAccountBalance(){
		var request = new XMLHttpRequest();

		request.open('GET', 'https://topups-sandbox.reloadly.com/accounts/balance');

		request.setRequestHeader('Accept', 'application/com.reloadly.topups-v1+json');
		request.setRequestHeader('Authorization', 'Bearer eyJraWQiOiI1N2JjZjNhNy01YmYwLTQ1M2QtODQ0Mi03ODhlMTA4OWI3MDIiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1MDI1IiwiaXNzIjoiaHR0cHM6Ly9yZWxvYWRseS1zYW5kYm94LmF1dGgwLmNvbS8iLCJodHRwczovL3JlbG9hZGx5LmNvbS9zYW5kYm94Ijp0cnVlLCJodHRwczovL3JlbG9hZGx5LmNvbS9wcmVwYWlkVXNlcklkIjoiNTAyNSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF1ZCI6Imh0dHBzOi8vdG9wdXBzLWhzMjU2LXNhbmRib3gucmVsb2FkbHkuY29tIiwibmJmIjoxNjA0MzAxOTg0LCJhenAiOiI1MDI1Iiwic2NvcGUiOiJzZW5kLXRvcHVwcyByZWFkLW9wZXJhdG9ycyByZWFkLXByb21vdGlvbnMgcmVhZC10b3B1cHMtaGlzdG9yeSByZWFkLXByZXBhaWQtYmFsYW5jZSByZWFkLXByZXBhaWQtY29tbWlzc2lvbnMiLCJleHAiOjE2MDQzODgzODQsImh0dHBzOi8vcmVsb2FkbHkuY29tL2p0aSI6IjMwNGU1NGNkLWU0OWEtNGE5Mi04NTI1LTUwY2JhY2M2NjU3NSIsImlhdCI6MTYwNDMwMTk4NCwianRpIjoiMDRlMGIyZDAtZjNkNy00MzkxLWFkM2UtYjNjMWI4ZTY5MmY1In0.ZzWlj2SINZG6uce-khVXES93srpmFCSOWYRYMqaxKtc');

		request.onreadystatechange = function () {
  		if (this.readyState === 4) {
    		console.log('Status:', this.status);
    		console.log('Headers:', this.getAllResponseHeaders());
    		console.log('Body:', this.responseText);
    		jsonString = this.responseText;
    		//this.setState({data: this.responseText});
    		console.log('Balance:', jsonString.balance);
  		}
  		
  		
		};

		request.send();
  }
  
  async topUp()
  {
  
  //this.setState({data: jsonString});
   // console.log("balance is "+jsonString);
   // console.log("top up called");
    
  var request = new XMLHttpRequest();

request.open('POST', 'https://topups-sandbox.reloadly.com/topups');

request.setRequestHeader('Content-Type', 'application/json');
request.setRequestHeader('Accept', 'application/com.reloadly.topups-v1+json');
request.setRequestHeader('Authorization', 'Bearer eyJraWQiOiI1N2JjZjNhNy01YmYwLTQ1M2QtODQ0Mi03ODhlMTA4OWI3MDIiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1MDI1IiwiaXNzIjoiaHR0cHM6Ly9yZWxvYWRseS1zYW5kYm94LmF1dGgwLmNvbS8iLCJodHRwczovL3JlbG9hZGx5LmNvbS9zYW5kYm94Ijp0cnVlLCJodHRwczovL3JlbG9hZGx5LmNvbS9wcmVwYWlkVXNlcklkIjoiNTAyNSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF1ZCI6Imh0dHBzOi8vdG9wdXBzLWhzMjU2LXNhbmRib3gucmVsb2FkbHkuY29tIiwibmJmIjoxNjA0MzAxOTg0LCJhenAiOiI1MDI1Iiwic2NvcGUiOiJzZW5kLXRvcHVwcyByZWFkLW9wZXJhdG9ycyByZWFkLXByb21vdGlvbnMgcmVhZC10b3B1cHMtaGlzdG9yeSByZWFkLXByZXBhaWQtYmFsYW5jZSByZWFkLXByZXBhaWQtY29tbWlzc2lvbnMiLCJleHAiOjE2MDQzODgzODQsImh0dHBzOi8vcmVsb2FkbHkuY29tL2p0aSI6IjMwNGU1NGNkLWU0OWEtNGE5Mi04NTI1LTUwY2JhY2M2NjU3NSIsImlhdCI6MTYwNDMwMTk4NCwianRpIjoiMDRlMGIyZDAtZjNkNy00MzkxLWFkM2UtYjNjMWI4ZTY5MmY1In0.ZzWlj2SINZG6uce-khVXES93srpmFCSOWYRYMqaxKtc');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

var body = {
  'recipientPhone': {
    'countryCode': 'IN',
    'number': '+919967591334' //(Note the '+509' country dialing code for Haiti)
  },
  'senderPhone': {
    'countryCode': 'IN',
    'number': '+919967591334' //(Note the '+1' country dialing code for USA)
  },
  'operatorId': 200,
  'amount': 25.74,
  'customIdentifier': 'vnvnvm'
};


request.send(JSON.stringify(body));
}
  
  async getOperator(){
  var request = new XMLHttpRequest();

request.open('GET', 'https://topups-sandbox.reloadly.com/operators/auto-detect/phone/+919967591334/countries/IN');

request.setRequestHeader('Accept', 'application/com.reloadly.topups-v1+json');
request.setRequestHeader('Authorization', 'Bearer eyJraWQiOiI1N2JjZjNhNy01YmYwLTQ1M2QtODQ0Mi03ODhlMTA4OWI3MDIiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1MDI1IiwiaXNzIjoiaHR0cHM6Ly9yZWxvYWRseS1zYW5kYm94LmF1dGgwLmNvbS8iLCJodHRwczovL3JlbG9hZGx5LmNvbS9zYW5kYm94Ijp0cnVlLCJodHRwczovL3JlbG9hZGx5LmNvbS9wcmVwYWlkVXNlcklkIjoiNTAyNSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF1ZCI6Imh0dHBzOi8vdG9wdXBzLWhzMjU2LXNhbmRib3gucmVsb2FkbHkuY29tIiwibmJmIjoxNjA0MzAxOTg0LCJhenAiOiI1MDI1Iiwic2NvcGUiOiJzZW5kLXRvcHVwcyByZWFkLW9wZXJhdG9ycyByZWFkLXByb21vdGlvbnMgcmVhZC10b3B1cHMtaGlzdG9yeSByZWFkLXByZXBhaWQtYmFsYW5jZSByZWFkLXByZXBhaWQtY29tbWlzc2lvbnMiLCJleHAiOjE2MDQzODgzODQsImh0dHBzOi8vcmVsb2FkbHkuY29tL2p0aSI6IjMwNGU1NGNkLWU0OWEtNGE5Mi04NTI1LTUwY2JhY2M2NjU3NSIsImlhdCI6MTYwNDMwMTk4NCwianRpIjoiMDRlMGIyZDAtZjNkNy00MzkxLWFkM2UtYjNjMWI4ZTY5MmY1In0.ZzWlj2SINZG6uce-khVXES93srpmFCSOWYRYMqaxKtc');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

request.send();
  }
  // async signUp() {
//     try {
//         const { user } = await Auth.signUp({
//             username,
//             password,
//             
//         });
//         console.log(user);
//     } catch (error) {
//         console.log('error signing up:', error);
//     }
// }
// 
//   async signIn() {
//   console.log("signIn called "+username);
//     try {
//         const user = await Auth.signIn(username, password);
//         console.log(user);
//     } catch (error) {
//         console.log('error signing in', error);
//     }
// }

  componentDidMount() {
    this.props.actions.fetchCategoryNews('top_stories');
  //  this.getOperator();
    
   // this.topUp();
//     AsyncStorage.getItem("myScore").then((value) => {
// 		console.log("home component value is "+value);
// 			if(value){
// 			  //0console.log("value is not null");
// 			  this.setState({"myScore": value});
// 			  this.saveData();
// 			}
// 			else{
// 			 console.log("value is null");
// 			  this.setState({"myScore": 0});
// 			  this.saveData();
// 			}
// 		  
// 		  
//         }).done();
  }
  
  
 //  async getTransactionData(){
//   const https = require('https');
// /*
// * import checksum generation utility
// * You can get this utility from https://developer.paytm.com/docs/checksum/
// */
// const PaytmChecksum = require('./PaytmChecksum');
// 
// var paytmParams = {};
// 
// paytmParams.body = {
//     "requestType"   : "Payment",
//     "mid"           : "rXehSc03224623542162",
//     "websiteName"   : "WEBSTAGING",
//     "orderId"       : "ORDERID_98765",
//     "callbackUrl"   : "https://merchant.com/callback",
//     "txnAmount"     : {
//         "value"     : "1.00",
//         "currency"  : "INR",
//     },
//     "userInfo"      : {
//         "custId"    : "CUST_001",
//     },
// };
// 
// /*
// * Generate checksum by parameters we have in body
// * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
// */
// PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "rXehSc03224623542162").then(function(checksum){
// 
//     paytmParams.head = {
//         "signature"    : checksum
//     };
// 
//     var post_data = JSON.stringify(paytmParams);
// 
//     var options = {
// 
//         /* for Staging */
//         hostname: 'securegw-stage.paytm.in',
// 
//         /* for Production */
//         // hostname: 'securegw.paytm.in',
// 
//         port: 443,
//         path: '/theia/api/v1/initiateTransaction?mid=rXehSc03224623542162&orderId=ORDERID_98765',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': post_data.length
//         }
//     };
// 
//     var response = "";
//     var post_req = https.request(options, function(post_res) {
//         post_res.on('data', function (chunk) {
//             response += chunk;
//         });
// 
//         post_res.on('end', function(){
//             console.log('Response: ', response);
//         });
//     });
// 
//     post_req.write(post_data);
//     post_req.end();
// });
// 
// 
//   }
  
  	saveData=() =>{
		console.log("saveData value is "+this.state.myScore);
		//setCount(count + 1);
// 		const value = Number(this.state.myScore) +10;
// 		AsyncStorage.setItem("myScore", value);
//      this.setState({"myScore": value});

    };


// adminClick=() =>{
// 		console.log("admin clicked ");
// 		this.props.navigation.navigate('Admin');
// 
//     };
    
  moveToPage = index => {
    this.viewpager.setPage(index);
    //console.log("move to page called");
  };

handleResponse = async(data) => {
        if(data.title == 'true') {
            console.log("transaction successful");
        }else if(data.title == 'false') {
            //handle failed payment here
            console.log("transaction failed");
        }
    }
    
  onPageSelected = ({nativeEvent: {position}}) => {
  console.log("onPageSelected"+position);

    if (position === 2) {
      this.props.actions.setWebViewVisiblity(true);
    } else {
      this.props.actions.setWebViewVisiblity(false);

    }
	//this.props.actions.updateScore();
  };

handleBackOnPress
  render() {
    const {isNewsListEmpty, newsListLength} = this.props;
    let { ORDER_ID, CUST_ID, TXN_AMOUNT } = this.state;
    //console.log('home render called');
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return (
        <View style={styles.container}>
           <View style={styles.statusContainer}>
        	

      </View>
          <ViewPager
            ref={viewpager => {
              this.viewpager = viewpager;
            }}
            style={styles.viewPager}
            initialPage={1}
            onPageSelected={this.onPageSelected}>
            <View>
              <MenuNavigationScreen moveToPage={this.moveToPage} />
            </View>
            <View>
              <MenuNavigationScreen moveToPage={this.moveToPage} />
            </View>
            <View>
              <WebScreen moveToPage={this.moveToPage} />
            </View>
          </ViewPager>
          
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPager: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
    buttonText: {
        fontSize: 20,
		alignItems:'center',
		fontFamily: 'Roboto-Bold',
		borderWidth: 1.5,
    },
});


export default connect(
  state => ({
    isNewsListEmpty: state.news.newsList.length === 0,
    newsListLength: state.news.newsList.length,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        setWebViewVisiblity,
        fetchCategoryNews,
      },
      dispatch,
    ),
  }),
)(HomeScreen);

