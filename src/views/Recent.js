import React from 'react';
import {Text, Button} from 'react-native';
import Expo from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardTitle, CardContent, CardAction } from 'react-native-card-view';
import Autolink from 'react-native-autolink';
import { colors } from '../utils/constants';
import jimmify from '../utils/jimmify';
import RequestList from './shared/RequestList';

const styles = {
	item: {
		question: {
			fontWeight: 'bold',
			color: colors.GRAY_DARK
		},
		answer: {
			fontStyle: 'italic'
		},
		button: {
			 marginRight: 10
		}
	}
};

function openLink(link) {
	Expo.WebBrowser.openBrowserAsync(link);
}

function RecentItem(props) {
	const { item } = props;
	return (
		<Card>
			<CardTitle styles={{ cardTitle: { paddingBottom: 0 } }}>
				<Autolink style={styles.item.question} text={item.text}/>
			</CardTitle>
			<CardContent>
				<Autolink style={styles.item.answer} text={item.answer} />
			</CardContent>
			<CardAction >
			{
				item.list
				? item.list.map((link, index) => {
					return (<Button key={link} style={styles.item.button} onPress={openLink.bind(this, link)} title={"Link " + (index + 1)}></Button>)
				})
				: null
			}
			</CardAction>

		</Card>
	);
}

const Wrapped =  RequestList(jimmify.getRecent, RecentItem, {
	responseKey: 'recents'
});

Wrapped.navigationOptions = {
	tabBarLabel: 'Recent',
	tabBarIcon: ({tintColor}) => {
		return <Ionicons name="ios-book-outline" size={32} color={tintColor}/>
	}
};

export default Wrapped;
