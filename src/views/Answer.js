import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import {Card, CardTitle} from 'react-native-card-view';
import RequestList from './shared/RequestList';
import Autolink from "react-native-autolink";
import { colors, STORE_KEYS } from '../utils/constants';
import jimmify from '../utils/jimmify';
import storage from '../utils/store';
import Modal from 'react-native-modalbox';
import Login from "./Login";

const styles = {
    item: {
        question: {
            fontWeight: 'bold',
            color: colors.GRAY_DARK
        }
    },
    wrapper: {
        flex: 1
    },
    modal: {
    },
    btn: {
    },
    modalTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    buttonWrapper: {
        marginHorizontal: 20
    }
};

function QueueItem(props) {
    const { item, separators } = props;
    separators.highlight();
    return (
        <Card>
            <CardTitle>
                <Text style={{color: colors.GRAY_DARK}}>Question: </Text>
                <Autolink style={styles.item.question} text={item.text}/>
            </CardTitle>
        </Card>
    );
}

export const AnswerQueue = RequestList(jimmify.getQueue, QueueItem, {
    responseKey: 'queue'
});

export default class Answer extends React.Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this);

        this.state = { loggedIn: false };

        storage
            .load({ key: STORE_KEYS.login })
            .then(() => {
                this.setState({ loggedIn: true });
            }).catch(error => {
                if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
                    this.login();
                }
            });
    }

    login() {
        if (!this.state.loggedIn) {
            this.loginModal.open();
        }
    }

    render() {

        const loginText = (
            <View>
                <Text style={{ textAlign: 'center', marginVertical: 40 }}>You need to be logged in to answer questions</Text>
                <View style={styles.buttonWrapper}>
                    <Button
                    color={colors.GREEN}
                    onPress={() => { this.loginModal.open() }}
                    title="SIGN IN"/>
                </View>
            </View>
        );

        return (<View style={styles.wrapper}>
            <Modal ref={login => this.loginModal = login} style={styles.modal} coverScreen={true} swipeToClose={false}>
                <View style={styles.modelTop}>
                    <TouchableOpacity onPress={() => { this.loginModal.close() }}>
                        <Text>✖</Text>
                    </TouchableOpacity>
                </View>
                <Login onLogin={() => {
                        this.setState({ loggedIn: true });
                        this.loginModal.close();
                    }}
                />
            </Modal>
            {!this.state.loggedIn && loginText}
            {this.state.loggedIn && <AnswerQueue/>}
        </View>);
    }
}
