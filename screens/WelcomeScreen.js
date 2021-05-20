import React from 'react'
import {
	Text,
	Dimensions,
	Image,
	View,
	TouchableOpacity,	
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import {LinearGradient} from 'expo-linear-gradient'
import Carousel, {Pagination} from 'react-native-snap-carousel'

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
  ScreenBackgroundColor0,
} from '../theme/color_utils'


const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

const VW = width /375
const VH = height / 812

export default class WelcomeScreen extends React.Component {


	render() {
		return (
			<LinearGradient 
        colors={[AccentColor3, ScreenBackgroundColor0]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
        style={{flex: 1}}
        >
			<SafeAreaView style={{ flex: 1, }}>                           
			<View style={{
				flex: 1,
			}}>
				<View style={{
					flex:4,
					justifyContent: 'center',
					alignItems: 'center',
					paddingTop: 30,
				}}>
					<Text
						style={{
							color: TextColor2,
							fontSize: 28,
							marginHorizontal: 10,
							textAlign: 'center',
						}}
					>Welcome To ContactX</Text>
				</View>
				<View style={{flex: 2}}>
					<TouchableOpacity 
						onPress={() => this.props.navigation.navigate('Login')}			
						style={{
							width: 334 * VW,
							height: 55,
							backgroundColor: TextColor2,
							alignSelf: 'center',
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: 6,
							flexDirection: 'row',
						}}>
						<Text style={{
							color: AccentColor,
							fontSize: 18,
							// fontFamily: 'Poppins-Medium'
						}}>
							Log In
						</Text>
					</TouchableOpacity>
					
					
				</View>
			</View>
			</SafeAreaView>
			<StatusBar style='light' />
			</LinearGradient>
		)
	}
}

