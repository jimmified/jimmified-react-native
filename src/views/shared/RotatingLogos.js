import React from 'react';
import {
	View,
	Image,
	Text
} from 'react-native';
import SwipeableViews from 'react-swipeable-views-native';

import {
	autoPlay
} from 'react-swipeable-views-utils';

import {JIMMYFY_LOGO_URL} from 'utils/constants';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
	wrapper: {
		height: 200
	},
	slideContainer: {
		height: 200
	},
	logo: {
		width: null,
		resizeMode: 'contain',
		height: 200,
		marginHorizontal: 10,
		alignSelf: 'stretch'
	},
};

const RotatingLogo = (props) => {
	return(
			<View style={styles.wrapper}>
				<AutoPlaySwipeableViews style={styles.slideContainer}>
				{
					JIMMYFY_LOGO_URL.map(
						(uri) => <Image key={uri} source={{uri}} style={styles.logo}/>)
				}
				</AutoPlaySwipeableViews>
			</View>
		)
}

export default RotatingLogo
