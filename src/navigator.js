import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const StackNavigator = createStackNavigator(
  {
    Home: LoginScreen,
    Main: HomeScreen,
  },
  {
    defaultNavigationOptions: {
      title: 'Inshorts',
      header: null,
    },
    initialRouteName: 'Main',
  },
);

const AppContainer = createAppContainer(StackNavigator);

export default AppContainer;
