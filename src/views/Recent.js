import React from 'react';
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
        }
    }
};

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
        </Card>
    );
}

export default RequestList(jimmify.getRecent, RecentItem, {
    responseKey: 'recents'
});