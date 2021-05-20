import React from 'react'
import {
  AppState,
  Appearance,
  View,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator  } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar'
import {connect} from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import NetInfo from '@react-native-community/netinfo'


// Screens
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import WelcomeScreen from './screens/WelcomeScreen'

// app theme colors
import {
	ScreenBackgroundColor,
  AccentColor,
  AccentColor1,
	TextColor1,
	TextColor2,
} from './theme/color_utils'

// Auth Screens
const AuthStack = createStackNavigator()

function AuthStackScreen () {
  return (    
    <AuthStack.Navigator
      headerMode='none'
      navigationOptions={{
          headerVisible: false,
      }}
      style = {{
        backgroundColor: AccentColor,
      }}
    >
      <AuthStack.Screen 
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <AuthStack.Screen 
        name="Login"
        component={LoginScreen}
      />
    </AuthStack.Navigator>    
  )
}

const MainStack = createStackNavigator()

function MainStackScreen (props) {
  return (
    <MainStack.Navigator
      headerMode='none'
      navigationOptions={{
          headerVisible: false,
      }}
    >
      <MainStack.Screen 
        name="Home"
        component={HomeScreen}
      />
    </MainStack.Navigator>
  )
}



class AppNavigator extends React.Component {  
  render(){
    return(
      <View style={{flex: 1}}>         
        <NavigationContainer style={{flex: 1, backgroundColor: ScreenBackgroundColor}}>
          {this.props.isLoggedIn ? (
              <MainStackScreen />
            ) : (
              <AuthStackScreen />
            )
          }
        </NavigationContainer>                          
    </View>
    )  
  }
}
  
const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
})

  
export default connect(mapStateToProps)(AppNavigator)