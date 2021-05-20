import React from 'react'
import {
  Animated,
  ActivityIndicator,
  Text,
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import {
  AntDesign,
  MaterialCommunityIcons,
} from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import NetInfo from '@react-native-community/netinfo'
import {LinearGradient} from 'expo-linear-gradient'

// app theme colors
import {
  TextColor1,
  TextColor2,
  TextColor3,
  TextColor4,
  TextColor5,
  AccentColor,
  AccentColor1,
  AccentColor2,
  AccentColor3,
  FlashIconColor,
  ScreenBackgroundColor,
  ScreenBackgroundColor0,
  ScreenBackgroundColor1,
  ScreenBackgroundColor2,
  Glass1,
} from '../theme/color_utils'

import NotificationPanel from '../components/NotificationPanel'


import { 
  sleep, 
  validateEmail } from '../api/utils'

import { logInUser } from '../redux/actioncreators'

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

const VW = width /375
const VH = height / 812


class LoginScreen extends React.Component {

  state = {
    is_light: 'light',
    email: '',
    is_email_no_focused: false,
    password: '',
    show_password: false,
    emailValidated: false,
    is_password_no_focused: false,
    passwordIsTyped: false,
    passwordValidated: false,
    emailIsTyped: false,
    input_animations: {
      email_label_value: new Animated.ValueXY({x: Math.ceil((0)), y: Math.ceil((23 * VH))}),
      password_label_value: new Animated.ValueXY({x: Math.ceil((0)), y: Math.ceil((23 * VH))}),
    },

    // loading
    submit_loading: false,
  }

  handleEmailChange = (email) => {
    this.setState({
      ...this.state,
      email,
      emailIsTyped: true,
    })
    if (validateEmail(email)) {
      this.setState(state => ({
          ...state,
          emailValidated: true
      }))
    } else {
      this.setState(state => ({
        ...state,
        emailValidated: false
    }))
    }
  }
  handlePasswordChange = (password) => {
    this.setState({
      ...this.state,
      password: password,
      passwordIsTyped: true
    })
    if (password.length >= 8) {      
      this.setState(state => ({
        ...state,
        passwordValidated: true
      }))
    } else {
      this.setState(state => ({
        ...state,
        passwordValidated: false
    }))
    }
  }

  animate_email_label = command => {
    if (command === 'focus') {
      this.setState({
        ...this.state,
        is_email_no_focused: true
      }) 
      Animated.timing(this.state.input_animations.email_label_value, {
        toValue: {x: (VW*0), y: (VH*0)},
        duration: 100, 
        useNativeDriver: true
      }).start()           
    } else if (command === 'blur') {
      if (this.state.email === '') {
        this.setState({
          ...this.state,
          is_email_no_focused: false
        }) 
        Animated.timing(this.state.input_animations.email_label_value, {
          toValue: {x: (VW*0), y: (VH*23)},
          duration: 100, 
          useNativeDriver: true
        }).start()
      } else {
        this.setState({
          ...this.state,
          is_email_no_focused: false
        }) 
      }
    }
      
  }

  animate_password_label = command => {
    if (command === 'focus') {
      this.setState({
        ...this.state,
        is_password_no_focused: true
      }) 
      Animated.timing(this.state.input_animations.password_label_value, {
        toValue: {x: (VW*0), y: (VH*0)},
        duration: 100, 
        useNativeDriver: true
      }).start()           
    } else if (command === 'blur') {
      if (this.state.password === '') {
        this.setState({
          ...this.state,
          is_password_no_focused: false
        }) 
        Animated.timing(this.state.input_animations.password_label_value, {
          toValue: {x: (VW*0), y: (VH*23)},
          duration: 100, 
          useNativeDriver: true
        }).start()
      } else {
        this.setState({
          ...this.state,
          is_password_no_focused: false
        })
      }
      
    }
  }

  toggle_password = () => {
    this.setState({
        ...this.state,
        show_password: !this.state.show_password
    })
  }

  _login = async () => {
    this.setState(state => ({
      ...state,
      submit_loading: true
    }))

    NetInfo.fetch().then(async (state) => {
      var isConnected = state.isConnected
      
      if (isConnected) {
        if (this.state.emailValidated){
          if(this.state.passwordValidated) {
            var res = await this.props.logInUser(this.state.email, this.state.password)
    
            if (res.status === 'error') {
              this.setState(state => ({
                ...state,
                submit_loading: false
              }))
              this.notification_panel._showMessage('Login Error', res.message, 'error')        
            }
          } else {
            this.notification_panel._showMessage('Password Warning', 'Password should be at least 8 characters long.', 'warning')                      
            this.setState(state => ({
              ...state,
              submit_loading: false
            }))
          } 
        } else {
          this.notification_panel._showMessage('Email Warning', 'Enter a valid email.', 'warning')           

          this.setState(state => ({
            ...state,
            submit_loading: false
          }))
        }
      } else {
        this.setState(state => ({
          ...state,
          submit_loading: false
        }))
        this.notification_panel._showMessage('No Network Connection', 'Connect your device to the internet and try again', 'warning')              
      }
    })

    
    
  }

  render () {
    return (
      <LinearGradient 
        colors={[AccentColor3, ScreenBackgroundColor0]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
        style={{flex: 1}}
      >
      <SafeAreaView style={{ flex: 1,}}> 
      <NotificationPanel  ref={c => this.notification_panel = c} parent_has_statusbar={true} />
      <View style={{
        flex: 1,
        backgroundColor: ScreenBackgroundColor,
      }}>
       <TouchableOpacity 
          onPress={() => this.props.navigation.goBack()}
          style={{
            padding: 10,
          }}>
          <AntDesign 
            name='arrowleft'
            color= {TextColor1}
            size={20}
          />
        </TouchableOpacity>
        <ScrollView>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <View style={{
              paddingHorizontal: 20 * VW,
              justifyContent: 'center',          
              alignSelf: 'center',
            }}>
              <Text style={{
                color: TextColor1,
                // fontFamily: 'Poppins-Light',
                fontSize: 24,
                marginTop: 40,
                textAlign: 'center',
              }}>Welcome back!</Text>
              <Text
              style={{
                color: AccentColor1,
                // fontFamily: 'Poppins',
                fontSize: 12,
                textAlign: 'center',
                marginTop: 6,
              }}
            >
              Hey there, login to see what awesomeness awaits you.
            </Text>
              <View style={{marginTop: 60}}>
                <Animated.View
                  // ref={view => { this.email_label = view; }}
                  style={[{                        
                    transform: [
                      {translateX: this.state.input_animations.email_label_value.x},
                      {translateY: this.state.input_animations.email_label_value.y}
                    ]
                  },  
                  ]}
                > 
                  <Text style={{
                    color: TextColor3,
                    // fontFamily: 'Poppins',
                    fontSize: 10,
                  }}> Email </Text>
                </Animated.View>
                <View style={[(this.state.is_email_no_focused ? {borderColor: AccentColor, borderBottomWidth: 2,} : {borderColor: AccentColor1, borderBottomWidth: 0.8}), {
                  height: 40,
                  width: 334 * VW,
                  flexDirection: 'row',	
                }]}>
                  <TextInput
                    returnKeyType='next'
                    keyboardType='email-address'
                    style={{
                      fontSize: 14,
                      // fontFamily: 'Poppins',
                      flex: 1,
                      color: TextColor4,
                    }}
                    value={this.state.email}
                    onChangeText={this.handleEmailChange}                                            
                    autoCompleteType='email'
                    keyboardAppearance={this.state.is_light ? 'light' : 'dark'}                
                    onFocus={() => this.animate_email_label('focus')}
                    onBlur={() => this.animate_email_label('blur')}
                    autoCapitalize='none'
                    onSubmitEditing={() => this.password_input.show()}
                  />
                  <View style={{justifyContent: "center"}}>
                    <MaterialCommunityIcons 
                      name={
                        this.state.emailIsTyped && this.state.emailValidated ? (
                          'checkbox-marked-circle-outline'
                        ) : (this.state.emailIsTyped) ? ('cancel') : null
                      }
                      size={15}
                      color={TextColor1}
                    />
                    </View>
                </View>
              </View>
              
              <View style={{marginTop: 15}}>
                <Animated.View
                  style={[{                        
                    transform: [
                      {translateX: this.state.input_animations.password_label_value.x},
                      {translateY: this.state.input_animations.password_label_value.y}
                    ]
                  },  
                  ]}
                > 
                  <Text style={{
                    color: TextColor3,
                    // fontFamily: 'Poppins',
                    fontSize: 10,
                  }}> Password</Text>
                </Animated.View>
                <View style={[(this.state.is_password_no_focused ? {borderColor: AccentColor, borderBottomWidth: 2,} : {borderColor: AccentColor1, borderBottomWidth: 0.8}), {
                  height: 40,
                  width: 334 * VW,
                  flexDirection: 'row',	
                }]}>
                  <TextInput
                    returnKeyType='done'
                    keyboardType='default'
                  style={{
                    fontSize: 14,
                    // fontFamily: 'Poppins',
                    flex: 1,
                    color: TextColor4,
                  }}
                    value={this.state.password}
                    onChangeText={this.handlePasswordChange}                                            
                    autoCompleteType='password'
                    keyboardAppearance={this.state.is_light ? 'light' : 'dark'}
                    autoCapitalize='none'
                    maxLength={25}
                    onFocus={() => this.animate_password_label('focus')}
                    onBlur={() => this.animate_password_label('blur')}
                    secureTextEntry={!this.state.show_password}
                    ref={(ref) => { this.password_input = ref }}
                    onSubmitEditing={() => this._login()}
                  />
                  <View style={{justifyContent: "center"}}>
                    <MaterialCommunityIcons 
                      name={
                        this.state.passwordIsTyped && this.state.passwordValidated ? (
                          'checkbox-marked-circle-outline'
                        ) : (this.state.passwordIsTyped) ? ('cancel') : null
                      }
                      size={20}
                      color={TextColor1}
                    />
                    </View>
                    <TouchableOpacity
                      onPress={() => this.toggle_password()}
                      style={{
                        marginLeft: 10,
                        justifyContent: 'center'
                      }}
                    >
                      <MaterialCommunityIcons 
                        name={this.state.show_password ? 'eye-off-outline' :  'eye-outline'}
                        size={20}
                        color={TextColor1}
                      />
                    </TouchableOpacity>
                    
                </View>
              </View>              
              <TouchableOpacity 
                onPress={() => this._login()}
                style={{
                  width: 300 * VW,
                  height: 55,
                  backgroundColor: AccentColor,
                  alignSelf: 'center',
                  paddingHorizontal: 40 * VW,
                  alignItems: 'center',
                  borderRadius: 6 * VW,
                  flexDirection: 'row',
                  marginTop: 30 * VH}}>
                <Text style={{
                  color: TextColor2,
                  fontSize: 16,
                  flex: 6,
                  // fontFamily: 'Poppins-Medium'
                }}>
                    Login
                </Text>
                <View style={{flex: 1,}}>
                  {
                    this.state.submit_loading ? (
                      <ActivityIndicator 
                        size='small'
                        color={TextColor2}
                      />
                    ) : (
                      <AntDesign 
                        name='login'
                        color= {TextColor2}
                        size={20}
                      />
                    )
                  }
                </View>
              </TouchableOpacity>
              
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <StatusBar style={this.state.is_light ? ('dark') : ('light')} />
      </View>
      </SafeAreaView>
      <StatusBar style='light' />      
      </LinearGradient>
    )
  }
}

const mapDispatchToProps = {
  logInUser,
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  // is_light: state.color_theme.is_light
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)