import React from 'react'
import { BackHandler,StyleSheet, Text, TextInput, View ,Image,Button, Dimensions,Alert,TouchableOpacity } from 'react-native'
import * as firebase from "firebase";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Input } from 'react-native-elements';
const {width} = Dimensions.get('window');
const frameWidth = width;

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null ,isVerified:false,isLoaded:false}
 
//   componentDidMount() {
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
  
 componentDidMount(){
  console.log("Login page");
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      if (user.emailVerified === false) {
       //console.log("Email Not Verified"+user.emailVerified);
      } else {
        // successful login 
        //console.log("Email Verified"+user.emailVerified);
        this.props.navigation.navigate('Main')
      }
     } else {
       //  Toast.show({ text: 'Something Wrong!', position: 'bottom', buttonText: 'No user is signed in.' }); 
     }
   });  
}

handleLogin = () => {
   console.log("handleLogin")
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

        // successful login 
       // console.log("Email Verified"+user.emailVerified);
        this.props.navigation.navigate('Main')
      }
     } else {
       //  Toast.show({ text: 'Something Wrong!', position: 'bottom', buttonText: 'No user is signed in.' }); 
     }
   });  
  
  
}
  
  render() {
   // console.log("render called");

    return (

	  <View style={styles.container}>

		<Image
          style={{width: 140, height: 200,backgroundColor: 'transparent',marginTop:frameWidth/5}}
          source={require('./mainLogoOrange.png')}
        />
        
       <Text style={{fontSize: 25,color:'#F5511E',alignItems:'center',marginBottom:frameWidth/25,fontFamily: 'Roboto-Bold'}}>RE-LEASED</Text>
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
		<View style={{backgroundColor:'#F5511E',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={this.handleLogin}>
         <Text style={{fontSize: 16,color:'white'}}> SUBMIT </Text>
        </TouchableOpacity>
		
		</View>
		
		<View style={{backgroundColor:'#F5511E',marginTop:frameWidth/15}}>
		<TouchableOpacity
         style={styles.button}
         onPress={() => this.props.navigation.navigate('SignUp')}
        >
         <Text style={{fontSize: 16,color:'white'}}> SIGN UP </Text>
        </TouchableOpacity>
		
		</View>
		
		<View style={{backgroundColor:'transparent', marginTop:frameWidth/15}}>
        <TouchableOpacity>
         <Text style={{fontSize: 20,color:'#3779AD'}}> Forgot Password? </Text>
        </TouchableOpacity>
      </View>
	   </View>
	   
    );
  }
}
  
  // render() {
    // return (
      // <View style={styles.container}>
        // <Text>Login</Text>
        // {this.state.errorMessage &&
          // <Text style={{ color: 'red' }}>
            // {this.state.errorMessage}
          // </Text>}
        // <TextInput
          // style={styles.textInput}
          // autoCapitalize="none"
          // placeholder="Email"
          // onChangeText={email => this.setState({ email })}
          // value={this.state.email}
        // />
        // <TextInput
          // secureTextEntry
          // style={styles.textInput}
          // autoCapitalize="none"
          // placeholder="Password"
          // onChangeText={password => this.setState({ password })}
          // value={this.state.password}
        // />
        // <Button style={styles.but} title="Login" onPress={this.handleLogin} />
        // <Button
		  // style={styles.but}
          // title="Sign Up"
          // onPress={() => this.props.navigation.navigate('SignUp')}
        // />
      // </View>
    // )
  // }
//}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
