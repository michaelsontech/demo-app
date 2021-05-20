import React from 'react'
import {
  Alert,
  ActivityIndicator,  
  Animated,
  BackHandler,    
  Dimensions,  
  Modal,
  Text,
  TouchableOpacity,  
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import {
  FlatList
} from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import NetInfo from '@react-native-community/netinfo'
import {LinearGradient} from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'



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
  ScreenBackgroundColor,
  ScreenBackgroundColor0,
  ScreenBackgroundColor1,
} from '../theme/color_utils'

import {
  AntDesign, 
  EvilIcons,
  Feather,
  FontAwesome, 
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from 'react-native-vector-icons'

import {
  sleep
} from '../api/utils'

import {
  add_contact,
  get_contacts
} from '../api/contacts'

import {
  logOut
} from '../redux/actioncreators'

import NotificationPanel from '../components/NotificationPanel'


const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

const VW = width /375
const VH = height / 812


class HomeScreen extends React.Component {

  state = {
    contacts: [],

    full_name: '',
    is_full_name_focused: false,
    full_name_typed: false,

    phone_number: '',
    is_phone_number_focused: false,
    phone_number_typed: false,

    input_animations: {
      full_name_label_value: new Animated.ValueXY({x: Math.ceil((0)), y: Math.ceil((23 * VH))}),
      phone_number_label_value: new Animated.ValueXY({x: Math.ceil((0)), y: Math.ceil((23 * VH))}),
    },

    is_modal_visible: false,
    submit_loading: false,
    is_screen_loading: true,
  }



  async componentDidMount () {           
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    )    

    var is_available = await SecureStore.isAvailableAsync()
    if (is_available) {      
      this.token = await SecureStore.getItemAsync('token')
    }

    var res = await get_contacts(this.token)

    if (res.status =='success') {
      this.storeContacts(res.contacts)
      .then(() => this.getContacts())      
    }

  }

  storeContacts = async (value) => {
    var contacts = {
      data: value
    }
    try {
      const jsonValue = JSON.stringify(contacts)
      await AsyncStorage.setItem('contacts', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  getContacts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('contacts')
      // return jsonValue != null ?  : null;

      if (jsonValue != null) {
        var contacts = await JSON.parse(jsonValue)
        this.setState({
          ...this.state,
          contacts: contacts.data,
          is_screen_loading: false,
        })

      }

    } catch(e) {
      // error reading value
    }
  }

  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to close the app?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp()}
    ]);
    return true;
  }


  componentWillUnmount() {
    this.backHandler.remove()
  }

  handle_full_name_Change = (full_name) => {
    this.setState({
      ...this.state,
      full_name,
      full_name_typed: true,
    })
  }

  animate_full_name__label = command => {
    if (command === 'focus') {
      this.setState({
        ...this.state,
        is_full_name_focused: true
      }) 
      Animated.timing(this.state.input_animations.full_name_label_value, {
        toValue: {x: (VW*0), y: (VH*0)},
        duration: 100, 
        useNativeDriver: true
      }).start()           
    } else if (command === 'blur') {
      if (this.state.full_name_ === '') {
        this.setState({
          ...this.state,
          is_full_name_focused: false
        }) 
        Animated.timing(this.state.input_animations.full_name_label_value, {
          toValue: {x: (VW*0), y: (VH*23)},
          duration: 100, 
          useNativeDriver: true
        }).start()
      } else {
        this.setState({
          ...this.state,
          is_full_name_focused: false
        }) 
      }
    }
      
  }

  handle_phone_number_Change = (phone_number) => {
    this.setState({
      ...this.state,
      phone_number,
      phone_number_typed: true
    })    
    
  }

  animate_phone_number_label = command => {
    if (command === 'focus') {
      this.setState({
        ...this.state,
        is_phone_number_focused: true
      }) 
      Animated.timing(this.state.input_animations.phone_number_label_value, {
        toValue: {x: (VW*0), y: (VH*0)},
        duration: 100, 
        useNativeDriver: true
      }).start()           
    } else if (command === 'blur') {
      if (this.state.phone_number === '') {
        this.setState({
          ...this.state,
          is_phone_number_focused: false
        }) 
        Animated.timing(this.state.input_animations.phone_number_label_value, {
          toValue: {x: (VW*0), y: (VH*23)},
          duration: 100, 
          useNativeDriver: true
        }).start()
      } else {
        this.setState({
          ...this.state,
          is_phone_number_focused: false
        })
      }
      
    }
  }

  _toggle_modal = value => {
    this.setState({
      ...this.state,
      is_modal_visible: value
    })
  }

  _create_contact = async () => {
    if(this.state.full_name.length >= 6){
      if(this.state.phone_number.length >= 11) {
        var is_available = await SecureStore.isAvailableAsync()
        if (is_available) {      
          this.token = await SecureStore.getItemAsync('token')
        }
        this.setState({
          ...this.state,
          submit_loading: true,
        })
        var res = await add_contact(this.state.full_name, this.state.phone_number, this.token)

        if (res.status === 'success'){
          this.setState({
            ...this.state,
            full_name: '',
            phone_number: '',
            contacts: res.contacts,
            submit_loading: false,
          })
          this.storeContacts(res.contacts)
          .then(() => this.getContacts()) 
          
          this._toggle_modal(false)
          this.notification_panel._showMessage('success', res.message, 'success')              
        } else {
          this.setState({
            ...this.state,
            submit_loading: false,
          })
          this._toggle_modal(false)
          this.notification_panel._showMessage('Error', res.message, 'error')              
        }
      } else {
        this._toggle_modal(false)
        this.notification_panel._showMessage('Phone Number Error', 'Enter a Valid Phone Number', 'warning')              
      }
    } else {
      this._toggle_modal(false)
      this.notification_panel._showMessage('Name Error', 'Enter a Valid Name', 'warning')              
    }
  }

  sample_contacts = [
    {
      full_name: 'Mike Smith',
      phone_number: '08089575769'
    },
    {
      full_name: 'Mike Smith',
      phone_number: '08089575769'
    },
    {
      full_name: 'Mike Smith',
      phone_number: '08089575769'
    },
    {
      full_name: 'Mike Smith',
      phone_number: '08089575769'
    },
    {
      full_name: 'Mike Smith',
      phone_number: '08089575769'
    },
  ]

  render() {
    return(
      <LinearGradient 
        colors={[AccentColor3, ScreenBackgroundColor0]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
        style={{flex: 1}}
      >
      <SafeAreaView style={{ flex: 1,}}> 
      <NotificationPanel  ref={c => this.notification_panel = c} parent_has_statusbar={true} />
        {
          this.state.is_screen_loading ? (
            <View 
              style={{ 
                flex: 1,
                backgroundColor: ScreenBackgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator 
                size='large'
                color={AccentColor}
                animating={this.state.is_screen_loading}
              />
            </View>
          ) : (
            <View 
              style={{ 
                flex: 1,
                backgroundColor: ScreenBackgroundColor
              }}
            >
              {/* Header */}
              <View
                style={{
                  width: width,
                  height: 45,
                  backgroundColor: ScreenBackgroundColor,
                  elevation: 4,
                  shadowOffset: {
                    width: 0.00,
                    height: -0.00
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4, 
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    flex: 1,
                  }}
                >
                  Contacts
                </Text>
                <TouchableOpacity
                  onPress={()=>this._toggle_modal(true)}
                >
                  <AntDesign 
                    name='pluscircle'
                    size={25}
                    color={AccentColor}
                  />
                </TouchableOpacity>
              </View>
              
              {/* Contacts List */}
              <FlatList
                data={this.state.contacts}
                style={{
                  marginTop: 10,
                }}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        paddingHorizontal: 10,
    
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: TextColor1,
                        }}
                      >{item.full_name}</Text>
                      <Text style={{
                        color: TextColor3,            
                        fontSize: 12
                      }}>{item.phone_number}</Text>
                    </View>
                  )
                }}
                ItemSeparatorComponent={() => {
                  return(
                    <View
                      style={{
                        backgroundColor: AccentColor2,
                        marginVertical: 5,
                        height: 0.7,
                        width: width,
                      }}
                    >
                    </View>
                  )
                }}
                keyExtractor={(item, index) => index.toString()}
              />          
              <TouchableOpacity 
                onPress={() => {this.props.logOut()}}
                style={{
                  paddingVertical: 6,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{
                  color: TextColor3,            
                  fontSize: 14
                }}>Log Out</Text>
              </TouchableOpacity>
            
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.is_modal_visible}
                onRequestClose={() => {
                  this._toggle_modal(false)
                }}
              >
                <View style={{
                  flex: 1, 
                  backgroundColor: ScreenBackgroundColor,              
                }}>
                  <View
                    style={{
                      width: width,
                      height: 45,
                      backgroundColor: ScreenBackgroundColor,
                      elevation: 4,
                      shadowOffset: {
                        width: 0.00,
                        height: -0.00
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4, 
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: AccentColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => this._toggle_modal(false)}
                    >
                      <AntDesign 
                        name='arrowleft'
                        color={TextColor2}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                
                  <ScrollView>
                    <KeyboardAvoidingView behavior='padding' style={{flex:1, paddingHorizontal: 10, justifyContent: 'center',}}>
                    <View style={{marginTop: 15, alignSelf: 'center',}}>
                      <Animated.View
                        // ref={view => { this.full_name__label = view; }}
                        style={[{                        
                          transform: [
                            {translateX: this.state.input_animations.full_name_label_value.x},
                            {translateY: this.state.input_animations.full_name_label_value.y}
                          ]
                        },  
                        ]}
                      > 
                        <Text style={{
                          color: TextColor3,
                          // fontFamily: 'Poppins',
                          fontSize: 10,
                        }}>Full Name </Text>
                      </Animated.View>
                      <View style={[(this.state.is_full_name_focused ? {borderColor: AccentColor, borderBottomWidth: 2,} : {borderColor: AccentColor1, borderBottomWidth: 0.8}), {
                        height: 40,
                        width: 334 * VW,
                        flexDirection: 'row',	
                      }]}>
                        <TextInput
                          returnKeyType='next'
                          keyboardType='default'
                          style={{
                            fontSize: 14,
                            flex: 1,
                            color: TextColor4,
                          }}
                          value={this.state.full_name}
                          onChangeText={this.handle_full_name_Change}                                                                                                      
                          onFocus={() => this.animate_full_name__label('focus')}
                          onBlur={() => this.animate_full_name__label('blur')}
                          autoCapitalize='words'
                          onSubmitEditing={() => this.phone_number_input.show()}
                        />                    
                      </View>
                    </View>
                  
                    <View style={{marginTop: 15, alignSelf: 'center',}}>
                      <Animated.View
                        // ref={view => { this.full_name__label = view; }}
                        style={[{                        
                          transform: [
                            {translateX: this.state.input_animations.phone_number_label_value.x},
                            {translateY: this.state.input_animations.phone_number_label_value.y}
                          ]
                        },  
                        ]}
                      > 
                        <Text style={{
                          color: TextColor3,
                          fontSize: 10,
                        }}>Phone Number</Text>
                      </Animated.View>
                      <View style={[(this.state.is_phone_number_focused ? {borderColor: AccentColor, borderBottomWidth: 2,} : {borderColor: AccentColor1, borderBottomWidth: 0.8}), {
                        height: 40,
                        width: 334 * VW,
                        flexDirection: 'row',	
                      }]}>
                        <TextInput
                          returnKeyType='done'
                          keyboardType='phone-pad'
                          style={{
                            fontSize: 14,
                            flex: 1,
                            color: TextColor4,
                          }}
                          value={this.state.phone_number}
                          onChangeText={this.handle_phone_number_Change}                                                                                                      
                          onFocus={() => this.animate_phone_number_label('focus')}
                          onBlur={() => this.animate_phone_number_label('blur')}                      
                          ref={(ref) => { this.phone_number_input = ref }}
                          // onSubmitEditing={() => this.phone_number_input.show()}
                        />                    
                      </View>
                    </View>
                  
                    <TouchableOpacity 
                      onPress={() => this._create_contact()}
                      style={{
                        width: 300 * VW,
                        height: 55,
                        backgroundColor: AccentColor,
                        alignSelf: 'center',
                        paddingHorizontal: 40 * VW,
                        alignItems: 'center',
                        borderRadius: 6 * VW,
                        flexDirection: 'row',
                        marginTop: 30 * VH
                      }}
                    >
                      <Text style={{
                        color: TextColor2,
                        fontSize: 16,
                        flex: 6,
                      }}>
                        Add Contact
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
                              name='plus'
                              color= {TextColor2}
                              size={20}
                            />
                          )
                        }
                      </View>
                    </TouchableOpacity>
                  
                    </KeyboardAvoidingView>
                  </ScrollView>
              
                </View>
              </Modal>
            </View>            
          
          )
        
        }
        
      </SafeAreaView>
      <StatusBar style='light' />     
      </LinearGradient>
      
    )
  }
  

  
}


const mapStateToProps = state => ({
  // is_light: state.color_theme.is_light,
})

const mapDispatchToProps = {
  logOut
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)