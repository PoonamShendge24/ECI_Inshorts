import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  BackHandler,
  Alert
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {BLACK, WHITE} from '../constants/Colors';
import {FONT_SIZE_SMALL} from '../constants/Dimens';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';
import {bindActionCreators} from 'redux';
import * as firebase from "firebase";
import Carousel from 'react-native-snap-carousel';
const SCREEN_HEIGHT = getScreenHeight();
const STATUS_BAR_HEIGHT = getStatusBarHeight();
const SCREEN_WIDTH = getScreenWidth();
import FastImage from 'react-native-fast-image';
// const fs = require('fs');
import jsonData from './data.json';

var source_url = "";
var source_name = "";
class WebScreen extends Component {
  handleBackOnPress = () => {
     this.setState({isVisible: false});
     return true;
  };

  
  constructor(props){
        super(props);
        this.state = { 
          index:0,
          urlArray: [],
          isVisible:false,
          carouselItems: [],
          name: 'ABC',  email: 'poonam.s@ec-interactive.com', contact: '9004696929',amount: '25.74',
      }
      this._renderItem = this._renderItem.bind(this);
      this.handleBackOnPress = this.handleBackOnPress.bind(this);
    }
    
	componentDidMount () {
    	console.log("componentDidMount called "+jsonData);
    	this.getData();
    	this.timer = setInterval(()=> this.getData(), 43200000);

		BackHandler.addEventListener('hardwareBackPress', this.handleBackOnPress);
	}

getData(){
	var array = [];
	var index = 0;
	for (let prop in jsonData) {
		index ++;
 	 //array.push(jsonData[prop]);
  	//if(index <=5){
  		firebase.database().ref('NewsFeed/News'+index).set({
			label : jsonData[prop].label,
			description : jsonData[prop].description,
			tag : jsonData[prop].tag,
			image_url : jsonData[prop].image_url,
			post_url : jsonData[prop].post_url,
			watched : jsonData[prop].watched,
			})
	//	}
	}

    var usersRef = firebase.database().ref('NewsFeed');
	usersRef.on('child_added', (snapshot) => {
	console.log('snapshot', snapshot.child("image_url").val());
	this.state.carouselItems.push({image_url : snapshot.child("image_url").val(),
		  									post_url : snapshot.child("post_url").val(),
		  									title : snapshot.child("label").val(),
		  									description : snapshot.child("description").val(),
		  									text : snapshot.child("tag").val(),
		  									watched : snapshot.child("watched").val()});
	  this.setState(this.state);

	});
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackOnPress);
}

// handleBackButtonClick() {
//     this.props.navigation.goBack(null);
//     return true;
// }

_renderItem({item,index}){
var hideBtn = false;

if(item.watched > 0)
   hideBtn = true;
        return (
          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 5,
              height: SCREEN_HEIGHT,
              padding: 50,
              marginLeft: 25,
              alignItems:'center',
              marginRight: 25, }}>
           
            <FastImage
                  style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT/1.75}}
                  source={{
                    uri: item.image_url,
                  }}
                />
                 <Text style={{fontSize: 30}}>{item.title}</Text>
                 
                  <Text style={{fontSize: 25}}>{item.description}</Text>

         <TouchableOpacity style={{alignItems:'center',marginTop:100}} onPress={() => this.handleClick(item.post_url,item.title,index)}>
              
         <Text style = { styles.buttonText }>{item.text}</Text>
          </TouchableOpacity>


         </View>

        )
    }

   handleClick = (url,title,ind) =>{
   		source_url = url;
   		source_name = title;
	  //const canOpen = await Linking.canOpenURL(url[i]);
	  //console.log("handleClick called "+source_url);
 	  this.setState({isVisible: true});
	  this.setState({index: ind});
	 
  }

    
addData(index){
     //console.log('addData called '+index);
     firebase.database().ref('data/trending_tags/News' + (index+1)).update({
		watched: 1,
	 })
	this.state.carouselItems[index].watched = 1;
	this.setState(this.state);
  }
   
//    updateData(index){
//      console.log('addData called '+index);
//      firebase.database().ref('data/trending_tags/News' + (index+1)).update({
// 		watched: 1,
// 	 })
// 	this.state.carouselItems[index].watched = 1;
// 	this.setState(this.state);
//   }
   
SaveData = () =>{
 	  //console.log("SaveData called ");
 	  this.addData(this.state.index);
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

		  firebase.database().ref('TopUpData/Data'(count+1)).set({
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
  
 

render() {
    const {newsList} = this.props;
    //console.log('NewsStackProps', {...this.props});
	console.log("render called ");
    return (
    !this.state.isVisible ?
      <View style={{flex: 1}}>
        <Carousel
          data={this.state.carouselItems}
          renderItem={this._renderItem}
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={getScreenHeight()}
          itemWidth={SCREEN_WIDTH}
          itemHeight={getScreenHeight()}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          vertical={true}
          swipeThreshold={70}
          onEndReached={this.handleEndReached}
          nestedScrollEnabled
          windowSize={5}
          onSnapToItem={this.onSlideChange}
          // ListEmptyComponent={<ShortsLoader />}
        />
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
                    source= {{uri: source_url}}
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


 //  render() {
//     const {isWebViewVisible} = this.props;
//     if (!isWebViewVisible) {
//       return <View style={styles.container}></View>;
//     }
// 
//    // const {news_obj} = currentSlideData;
//    // const {source_name, source_url} = news_obj;
// 
// 	const source_name = 'My news' ;
//  	const source_url = 'https://en.wikipedia.org/wiki/Doraemon_(2005_TV_series)' ;
//  
//     return (
//       <View style={styles.container}>
//         <View style={styles.top}>
//           <Icon
//             name="chevron-left"
//             color={WHITE}
//             size={STATUS_BAR_HEIGHT * 0.8}
//             onPress={this.handleBackOnPress}
//           />
//           <Text style={styles.title}>{source_name}</Text>
//           <Icon name="more-vert" color={WHITE} size={STATUS_BAR_HEIGHT * 0.7} />
//         </View>
// 
//         <View style={styles.webViewContainer}>
//           <WebView
//             source={{
//               uri: source_url,
//             }}
//             // style={styles.webView}
//             startInLoadingState
//             scrollEnabled
//             scalesPageToFit
//             javaScriptEnabled={true}
//             zoomable={false}
//           />
//         </View>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
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
  title: {
    color: WHITE,
    fontSize: FONT_SIZE_SMALL,
  },
  webViewContainer: {
    minHeight: SCREEN_HEIGHT + 30,
  },
    buttonText: {
        fontSize: 20,
		alignItems:'center',
		fontFamily: 'Roboto-Bold',
		textDecorationLine: 'underline'
    },
    disabledText: {
        fontSize: 18,
		alignItems:'center',
		fontFamily: 'Roboto-Bold',
		color: 'grey',

    },
});

export default connect(
  state => ({
    currentNewsSlideIndex: state.news.currentNewsSlideIndex,
    isWebViewVisible: state.news.isWebViewVisible,
    currentSlideData: state.news.newsList[state.news.currentNewsSlideIndex]
      ? state.news.newsList[state.news.currentNewsSlideIndex]
      : null,
  }),
  dispatch => ({
    actions: bindActionCreators({}, dispatch),
  }),
)(WebScreen);
