import React from 'react';
import {Text} from 'react-native';
import Expo from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardTitle, CardContent } from 'react-native-card-view';
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
				link: {
					color: colors.BLUE
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
						{
							item.list
							? item.list.map((link) => {
								return (<Text key={link} style={styles.item.link} onPress={openLink.bind(this, link)}>{link}</Text>)
							})
							: null
						}
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
