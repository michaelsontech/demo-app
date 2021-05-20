import React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  View,
  Text,  
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native'
import { connect } from 'react-redux'
import { getStatusBarHeight } from 'react-native-status-bar-height'

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
  AccentColor5,
  ScreenBackgroundColor,
  ScreenBackgroundColor0,
  ScreenBackgroundColor1,
  ScreenBackgroundColor3,
} from '../theme/color_utils'


import NotificationBell from '../assets/svg/icons/NotificationBell'
import ErrorIcon from '../assets/svg/icons/ErrorIcon'
import SuccessIcon from '../assets/svg/icons/SuccessIcon'
import WarningIcon from '../assets/svg/icons/WarningIcon'

const width = Dimensions.get("screen").width
const height = Dimensions.get("window").height

const VW = width / 375
const VH = height / 812


const Message = (props) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 10,        
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: AccentColor2,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10
        }}
      >
        {
          props.msg_type === 'default' ? (
            <NotificationBell size={40} />
          ) :null
        }
        {
          props.msg_type === 'error' ? (
            <ErrorIcon size={40} />
          ) :null
        }
        {
          props.msg_type === 'success' ? (
            <SuccessIcon size={40} />
          ) :null
        }
        {
          props.msg_type === 'warning' ? (
            <WarningIcon size={35} />
          ) :null
        }
        
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              // fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: TextColor1,
              textTransform: 'capitalize',
            }}
            numberOfLines={1}
          >
            {props.message}
          </Text>
          {/* <Text
            style={{
              // fontFamily: 'Poppins-Light',
              fontSize: 10,
              color: TextColor3,
            }}
            numberOfLines={1}
          >
            1m ago
          </Text> */}
        </View>        
        <Text
          style={{
            // fontFamily: 'Poppins',
            fontSize: 12,
            color: TextColor1,
          }}
          numberOfLines={2}
        >
          {props.description}
        </Text>
      </View>
    </View>
  )
}

export default class NotificationPanel extends React.Component {

  state = {
    panel_value: new Animated.ValueXY({x: 0, y: -100}),

    message: '',
    description: '',
    msg_type: 'default', // default, success, warning, danger,  notification,
  }

  _showMessage(message, description, type = 'default') {
    this.setState({
      ...this.state,
      message: message,
      description: description,
      msg_type: type,
    })
    this._open_panel()
  }

  _open_panel = () => {
    // StatusBar.setHidden(true)
    if (this.props.parent_has_statusbar) {
      Animated.timing(this.state.panel_value, {
        toValue: {x: 0, y:(getStatusBarHeight())},
        duration: 100, 
        useNativeDriver: true,
        easing: Easing.bounce,
      }).start()
    } else {
      Animated.timing(this.state.panel_value, {
        toValue: {x: 0, y: 0},
        duration: 100, 
        useNativeDriver: true,
        easing: Easing.bounce,
      }).start()
    }
    
    setTimeout(this._close_panel, 10000)
  }

  _close_panel = () => {    
    Animated.timing(this.state.panel_value, {
      toValue: {x: 0, y:-100},
      duration: 100, 
      useNativeDriver: true,
      easing: Easing.ease,
    }).start()
    // StatusBar.setHidden(false)
  }

  render() {
    const panel_content_visibility = this.state.panel_value.y.interpolate({
      inputRange: [-50, 0],
      outputRange: [0, 1]
    })

    return(
      <Animated.View
        style={{
          width: width,
          height: 80,
          backgroundColor: ScreenBackgroundColor1,
          position: 'absolute',
          zIndex: 999999999,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          elevation: 20,
          shadowOffset: {
            width: 0.00,
            height: -0.00
          },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          transform: [
            {translateX: this.state.panel_value.x},
            {translateY: this.state.panel_value.y},
          ],          
        }}
      >
        <Animated.View
          style={{
            flex: 1,            
            opacity: panel_content_visibility,
          }}
        >
          <Pressable 
            onPress={() => this._close_panel()}
            style={{
              flex: 1,
              
            }}
          >
            <Message
              message={this.state.message}
              description={this.state.description}
              msg_type={this.state.msg_type}
            />
          </Pressable>
        </Animated.View>
      </Animated.View>
    )
  }
}


NotificationPanel.defaultProps = {
  parent_has_statusbar: false,
}