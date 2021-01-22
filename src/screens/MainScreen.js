import React, {Component, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  AsyncStorage ,
  Alert,
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

class MainScreen extends React.Component {
	handleBackOnPress = () => {
     this.setState({isVisible: false});
  };
  
  state = {
    selectedTopic: null,
    score:0,
	myScore:0,
	isVisible:false,
	urlIndex : -1,
	name: 'ABC',  email: 'poonam.s@ec-interactive.com', contact: '9004696929',amount: '25.74',
  };
  
  //private homeInstance: HomeScreen;
  
  constructor(props) {
        super(props);
        this.handleOpenURL = this.handleOpenURL.bind(this);
       
    }
     
 adminClick = () => {
		console.log("admin clicked ");
		this.props.moveToPage(0);

    };
    
   componentDidMount () {
    this.props.actions.fetchTrendingTopics();
	
	Linking.getInitialURL().then((url) => { console.log('1', url) })
    Linking.addEventListener('url', this.handleOpenURL);
  

// 		AsyncStorage.getItem("myScore").then((value) => {
// 			console.log("home component value is "+value);
// 			if(value){
// 			  //0console.log("value is not null");
// 			  this.setState({"myScore": value});
// 			  this.saveData(value);
// 			}
// 			else{
// 			 console.log("value is null");
// 			  this.setState({"myScore": 0});
// 			  this.saveData('0');
// 			}
// 		  
// 		  
//         }).done();
    }

// 	saveData = value => {
// 		console.log("saveData value is "+value);
// 		AsyncStorage.setItem("myScore", value);
//         this.setState({"myScore": value});
// 
// 	//this.GetWeather();
// 
//     }
// 	
// 	updateSc = () => {
// 		console.log("UpdateScore called ");
//   		this.setState(this.state);
// 	}

componentWillUnmount() {
  Linking.removeEventListener('url', this.handleOpenURL)
}

// GetWeather = () => {
//   const API_KEY = "da9d6e14bf1eddc0eb773a327de2661c";
//   const NEWURL = 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=da9d6e14bf1eddc0eb773a327de2661c';
//   const URL = 'http://api.openweathermap.org/data/2.5/weather';
//   var searchTerm = 'MUMBAI'; 
//   return fetch('${NEWURL}')
//             .then(response => response.json())
//             .then((data) => {
// 		console.log("data is "+data);
//             })
//             .catch(() => {
// console.log("No data found");
//             });
// 
// };

  handleMenuOnPress = item => {
	//console.log("handleMenuOnPress"+item.tag);
	//console.log("image "+item.o);
    const {tag} = item;
	//console.log("tag"+tag);
    this.props.actions.selectTopic(tag);
    this.props.actions.fetchTopicNews(tag, 1);
    this.props.moveToPage(1);
  };

  renderCategoriesHeader = () => {
    return (
      <View style={styles.titleContent}>
        <Text style={styles.contentTitle}>CATEGORIES</Text>
        <View style={styles.divider} />
      </View>
    );
  };

  handleCategoryOnPress = item => {
	  console.log("handleCategoryOnPress"+item);
    if (item.id !== 'bookmarks') {
      this.props.actions.selectCategory(item.id);
      this.props.moveToPage(1);
      this.props.actions.fetchCategoryNews(item.id);
    }
  };

  renderCategoriesContent = () => {
    const {selectedCategory} = this.props;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {NEWS_CATEGORIES.map((category, index) => {
          const {id, label, icon} = category;
          const isSelected = id === selectedCategory;
          return (
            <TouchableOpacity
              key={String(id)}
              onPress={() => this.handleCategoryOnPress(category)}>
              <View
                style={{
                  alignItems: 'center',
                  marginHorizontal: 20,
                  marginVertical: 8,
                  opacity: isSelected ? 1 : 0.6,
                }}>
                <FastImage
                  style={{width: SCREEN_WIDTH / 10, height: SCREEN_WIDTH / 10}}
                  source={{
                    uri: icon,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected ? styles.selectedCategoryText : null,
                  ]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  renderSuggestedTopicsHeader = () => {
    return (
      <View style={styles.titleContent}>
        <Text style={styles.contentTitle}>AVAILABLE OFFERS</Text>
        <View style={styles.divider} />
      </View>
    );
  };

renderSuggestedTopicsHeader2 = () => {
    return (
      <View style={styles.titleContent}>
        <Text style={styles.contentTitle}>SUGGESTED TOPICS</Text>
        <View style={styles.divider} />
      </View>
    );
  };
  
  renderSuggestedTopicsContent = () => {
    const {selectedTopicId} = this.props;
    return (
      <View style={styles.menusContainer}>
	    {this.props.trendingTopics.map((item, index) => {
          const {tag, image_url, label} = item;
          return (
            <View style={styles.menuOuterWrapper} key={String(index)}>
              <TouchableOpacity
                style={[
                  styles.menuInnerWrapper,
                  {
                    height: styles.menuOuterWrapper.height - 10,
                    position: 'relative',
                  },
                ]}
                onPress={() => this.handleMenuOnPress(item)}
                key={String(index)}>
                <FastImage
                  style={{flex: 1}}
                  source={{
                    uri: image_url,
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                <LinearGradient
                  colors={['#FFFFFF00', '#FFFFFFDD', '#FFFFFFFF']}
                  style={[
                    {height: styles.menuOuterWrapper.height / 4},
                    styles.absoluteBottom,
                  ]}></LinearGradient>
                <Text
                  style={styles.topicLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {label}
                </Text>
                {tag === selectedTopicId ? (
                  <View
                    style={[
                      {flex: 1},
                      styles.absolute,
                      {backgroundColor: LIGHT_BLUE, opacity: 0.4},
                    ]}></View>
                ) : null}
              </TouchableOpacity>
            </View>
          );
        })}
		
      </View>
    );
  };

// mygetButtons = () => {
//     const buttons = [];
//     for( let i = 0; i < 2; i++) {
//        buttons.push(
//          <TouchableOpacity style={styles.but}  key={i} onPress={()=>this.handleClick(i)}>
// 
//       		<Text style = { styles.buttonText }> {values[i]} </Text>
//          </TouchableOpacity>
//       )
//     }
//     return buttons;
//   }
  
  mygetButtons = () => {
    const buttons = [];
    for( let i = 0; i < 2; i++) {
       buttons.push(
         <TouchableOpacity style={styles.but}  key={i} onPress={()=>this.handleClick(i)}>

      		<Text style = { styles.buttonText }> {values[i]} </Text>
         </TouchableOpacity>
      )
    }
    return buttons;
  }
  
  async handleClick(i) {
	  //const canOpen = await Linking.canOpenURL(url[i]);
	  //console.log("canOpen "+canOpen);
 	  this.setState({isVisible: true});
	  this.setState({urlIndex: i});
	 
  }

	handleOpenURL(event) {
    console.log("event is"+ event);
  }
  
  
// renderSuggestedTopicsContent2 = () => {
//     const {selectedTopicId} = this.props;
//     return (
//       <View style={styles.menusContainer}>
//         <View style={styles.frame}>               
//              {this.mygetButtons ()}
// 		</View>
// 			 
// 	  <Text style={styles.titleText}>
//         {titleText}
//       </Text>
//       <Text style={styles.baseText}>{this.state.myScore}</Text>
//       </View>
//     );
//   };
  
  renderSuggestedTopicsContent2 = () => {
    const {selectedTopicId} = this.props;
    return (
      <View style={styles.menusContainer}>
        <View style={styles.frame}>               
             {this.mygetButtons ()}
		</View>

      </View>
    );
  };
  
  renderCategories = () => {
    return (
      <React.Fragment>
        {this.renderCategoriesHeader()}
        {this.renderCategoriesContent()}
      </React.Fragment>
    );
  };

  renderSuggestedTopics = () => {
    return (
      <React.Fragment>
        {this.renderSuggestedTopicsHeader()}
		{this.renderSuggestedTopicsContent2()}


      </React.Fragment>
    );
  };
  
  
  
//   renderSuggestedTopics = () => {
//     return (
//       <React.Fragment>
//         {this.renderSuggestedTopicsHeader()}
//         {this.renderSuggestedTopicsContent()}
//       </React.Fragment>
//     );
//   };

SaveData = () =>{
 	  console.log("SaveData called ");
 	  var count = 0;
 	  var usersRef = firebase.database().ref('TopUpData/');
		usersRef.on('value', (snapshot) => {
		  count = snapshot.numChildren();
		  
			this.setState({
				data: count
			  })
			 console.log("count is "+count); 
		});
		
      setTimeout(() => {
      //console.log('Our data is fetched'+count);
      alert("Data added successfully.");
      this.setState({isVisible: false});
	  	//var database = firebase.database();

		  firebase.database().ref('TopUpData/Data'+(count+1)).set({
			Email: this.state.email,
			Contact: this.state.contact,
			Redeem: 0
		})

	   //this.props.navigation.navigate('Home')
    }, 2000)
}
    

_onLoadEnd() {
	console.log("score is "+this.state.myScore);
	//const count = Number(this.state.myScore) +10;
    //HomeScreen.saveData(count.toString());
    //this._onSaveData();
	//Alert.alert("Congratulations! You received 20 points",[{text:'REDEEM',onPress:() => console.log("Redeem Clicked")}]);
	Alert.alert(
  'Congratulations! You received 20 points',
  '',
  [
    {
      text: 'Redeem',
      onPress: () => this.SaveData()
    },
    { text: 'OK', onPress: () => console.log('OK Pressed') }
  ],
  { cancelable: false }
);
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
    'number': '+919004696929' //(Note the '+509' country dialing code for Haiti)
  },
  'senderPhone': {
    'countryCode': 'IN',
    'number': '+919967591334' //(Note the '+1' country dialing code for USA)
  },
  'operatorId': 200,
  'amount': 25.74,
  'customIdentifier': 'gdfgfdg'
};


request.send(JSON.stringify(body));

this.setState({isVisible: false});
}

// adminClick=() =>{
// 		console.log("admin clicked ");
// 		this.props.navigation.navigate('Admin')
// 
//     };
    
  render() {
	//console.log("is Visible "+this.state.isVisible);
	//console.log("menu render called"+this.state.isVisible);

    return (
	  !this.state.isVisible ?
      <View style={styles.container}>
      <StatusBar
          barStyle="dark-content"
          // dark-content, light-content and default
          hidden={false}
          //To hide statusBar
          backgroundColor="#ff4081"
          //Background color of statusBar
          translucent={false}
          //allowing light, but not detailed shapes
          networkActivityIndicatorVisible={true}
        />

        
        <ScrollView style={styles.scrollView}>
          {this.renderSuggestedTopics()}
        </ScrollView>
      </View>
	  :  
 	  <View style={styles.container}>	  
		<View style={styles.top}>
          <Icon
            name="chevron-left"
             size={30} color="#fff" 
            onPress={this.handleBackOnPress}
          />
          <Text style={styles.title}>{source_name}</Text>
        </View>
	   <View style={{height:"100%" , width:"100%"}}>
                <WebView 
                    source= {{uri: url[this.state.urlIndex]}}
                    style= {styles.loginWebView}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					mediaPlaybackRequiresUserAction={false}
					onLoadEnd={this._onLoadEnd.bind(this)} 
                />
            </View>
			 </View>
		: null
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  menusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: MARGIN_HORIZONTAL,
  },
  menuOuterWrapper: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    paddingHorizontal: 5,
    marginVertical: 1,
  },
  menuInnerWrapper: {
    borderColor: LIGHT_BLUE + 'AA',
    borderWidth: 1.5,
    borderRadius: 4,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  absoluteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleContent: {
    marginHorizontal: MARGIN_HORIZONTAL + 4,
  },
  contentTitle: {
    marginTop: 30,
    fontSize: FONT_SIZE_LARGE,
    fontFamily: FONT_BLACK,
    fontWeight: '900',
    color: DARKER_GRAY,
  },
  divider: {
    width: 25,
    height: 2,
    backgroundColor: DARKER_GRAY,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20,
  },
  topicLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginHorizontal: 6,
    marginVertical: 6,
    fontSize: FONT_SIZE_REGULAR,
    fontFamily: FONT_BOLD,
    fontWeight: '700',
  },
  categoryLabel: {
    marginTop: 16,
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: FONT_BOLD,
    fontWeight: '700',
    color: GRAY,
  },
  selectedCategoryText: {
    color: LIGHT_BLUE,
  },
  frame: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems:'center',
		justifyContent:'flex-start',
		backgroundColor:'white',
		backgroundColor: 'grey',
		width: frameWidth,
		backgroundColor:'white',
	  },
	  but: {
		backgroundColor:'white',
		width: frameWidth/2.75,
		height: frameWidth/6,
		paddingTop: frameWidth/5,
		margin: 20,
		borderRadius: 30,
		paddingBottom: frameWidth/6.5,
		alignItems:'center',
		borderColor: 'red',
		borderWidth: 1.5,

	  },
	   baseText: {
		   flexDirection: 'row',
		   fontSize: 20,
			fontFamily: "Cochin",
			paddingLeft:20
		},
	  titleText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	buttonText: {
        fontSize: 15,
		alignItems:'center',
		fontFamily: 'Roboto-Bold',
    },
    newbuttonText: {
        fontSize: 20,
		alignItems:'center',
		fontFamily: 'Roboto-Bold',
		borderWidth: 1.5,
		marginBottom: 100
    },
	 loginWebView: {
        flex: 1,
        marginTop: 30,
        marginBottom: 20
    },
  top: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: BLACK,
    color: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
});

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
)(MainScreen);

