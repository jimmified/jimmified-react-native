import React from 'react';
import { Card, CardTitle, CardContent } from 'react-native-card-view';
import { View, Text, FlatList } from 'react-native';
import jimmify from '../utils/jimmify';
import RequestList from './shared/RequestList';

const styles = {
    item: {
        question: {
            fontWeight: 'bold'
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
            <CardTitle>
                <Text style={styles.item.question}>{item.text}</Text>
            </CardTitle>
            <CardContent>
                <Text style={styles.item.answer}>{item.answer}</Text>
            </CardContent>
        </Card>
    );
}

export default RequestList(jimmify.getRecent, RecentItem, {
    responseKey: 'recents'
});