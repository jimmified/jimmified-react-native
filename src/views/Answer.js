import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Button, Platform } from 'react-native';
import {Card, CardTitle} from 'react-native-card-view';
import RequestList from './shared/RequestList';
import Autolink from "react-native-autolink";
import { colors, STORE_KEYS, STATUSBAR_HEIGHT } from '../utils/constants';
import jimmify from '../utils/jimmify';
import storage from '../utils/store';
import Modal from 'react-native-modalbox';
import Login from "./Login";
import AnswerAQ from './answer/AnswerAQuestion';

const styles = {
    item: {
        question: {
            fontWeight: 'bold',
            color: colors.GRAY_DARK
        }
    },
    wrapper: {
        height: '100%'
    },
    modal: {},
    btn: {},
    modalTop: {
        paddingTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    buttonWrapper: {
        height: 40,
        marginTop: 20,
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

    static navigationOptions = {
        tabBarLabel: 'Answer',
        tabBarIcon: ({tintColor}) => {
            return <Ionicons name="ios-text-outline" size={32} color={tintColor}/>
        }
    };

    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
        this.onAnswer = this.onAnswer.bind(this);

        this.state = { loggedIn: false, selectedQuestion: undefined } ;

        storage
            .load({ key: STORE_KEYS.login })
            .then(({ token }) => {
                this.setState({ loggedIn: true, token });
            }).catch(error => {
                if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
                    this.login();
                }
            });
    }

    login() {
        if (!this.state.loggedIn && this.props.isFocused) {
            this.loginModal.open();
        }
    }

    componentWillReceiveProps() {
        storage
            .load({ key: STORE_KEYS.login })
            .then(({ token }) => {
                this.setState({ loggedIn: true, token });
            }).catch(error => {
            if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
                this.setState({ loggedIn: false });
                this.login();
            }
        });
    }

    onAnswer(answer) {

        jimmify.answer({
            key: this.state.selectedQuestion.key,
            answer: answer.text,
            type: answer.originalQuestion.type,
            links: answer.links,
            token: this.state.token
        }).then((response) => {
            console.log(response);
            this.answerQueue.refresh();
        }).catch((err) => {
            console.warn(err);
        });

        this.setState({
            selectedQuestion: undefined
        });
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
                <View style={styles.modalTop}>
                    <TouchableOpacity onPress={() => { this.loginModal.close() }}>
                        <Text style={{ fontSize: 30, color: colors.GRAY_DARK }}>✖</Text>
                    </TouchableOpacity>
                </View>
                <Login onLogin={(token) => {
                        this.setState({ loggedIn: true, token });
                        this.loginModal.close();
                    }}
                />
            </Modal>
            {this.state.loggedIn ? <AnswerQueue ref={answerQueue => this.answerQueue = answerQueue } onSelectItem={(evt) => { console.log(evt);
                this.setState({ selectedQuestion: evt.item });
            }} /> : loginText}

            {this.state.selectedQuestion &&
            <Modal isOpen={true}
                   style={styles.modal}
                   swipeToClose={false}
                   coverScreen={false}
                   onClosed={() => { this.setState({ selectedQuestion: undefined})}}
                   ref={a => this.answerModal = a}>
                <View style={styles.modalTop}>
                    <TouchableOpacity onPress={() => { this.answerModal.close() }}>
                        <Text style={{ fontSize: 30, color: colors.GRAY_DARK }}>✖</Text>
                    </TouchableOpacity>
                </View>
                <AnswerAQ {...this.state.selectedQuestion} onAnswer={this.onAnswer} />
            </Modal>}
        </View>);
    }
}
