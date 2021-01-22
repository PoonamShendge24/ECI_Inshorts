import React from 'react'
import { BackHandler,StyleSheet, Text, TextInput, View,Dimensions, TouchableOpacity } from 'react-native'
//import firebase from 'react-native-firebase'
import * as firebase from "firebase/app";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button ,Input } from 'react-native-elements';
const {width} = Dimensions.get('window');
const frameWidth = width;

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }

//  	componentDidMount() {
//          BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
//      }
// 
//     componentWillUnmount() {
//         BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
//     }
//  
//  
//   handleBackButton() {
//         // After clicking on Back Button 
//  	    console.log('Back button is pressed');
//         return true;
//   }
  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
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
  
 /*  verifyEmail = () => {
    const { email, password } = this.state
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  // ...
	  
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
  } */
  
  render() {
    return (
      <View style={styles.container}>
       <View style={{flexDirection:"row",paddingTop:frameWidth/15}}>
	    <Text style={{fontSize: 25,color:'#F5511E',alignItems:'center',marginTop:frameWidth/30,fontFamily: 'Roboto-Bold'}}>Sign Up</Text>
		

		 </View>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Your Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Your Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
		<TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Confirm Password"
          onChangeText={cpassword => this.setState({ cpassword })}
          value={this.state.cpassword}
        />
        		<View style={{backgroundColor:'#F5511E',marginTop:frameWidth/15}}>
		        <TouchableOpacity
         style={styles.button}
         onPress={this.handleLogin}
        >
         <Text style={{fontSize: 16,color:'white'}}> SIGN UP </Text>
        </TouchableOpacity>
		
		</View>
		
		<View style={{backgroundColor:'#F5511E',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={() => this.props.navigation.navigate('Home')}
        >
         <Text style={{fontSize: 16,color:'white'}}> BACK </Text>
        </TouchableOpacity>
		
		</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 50,
    width: '80%',
	color: 'grey',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: frameWidth/25,
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
