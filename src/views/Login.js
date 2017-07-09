import _ from 'lodash';
import React from 'react';
import jimmify from '../utils/jimmify';
import Swiper from 'react-native-swiper';
import { View, TextInput, Image, Button, Text } from 'react-native';
import { colors, STATUSBAR_HEIGHT, STORE_KEYS } from '../utils/constants';
import store from '../utils/store';

const styles = {
    logo: {
        width: null,
        resizeMode: 'contain',
        height: 200,
        marginHorizontal: 10,
        alignSelf: 'stretch'
    },
    input: {
        marginHorizontal: 20,
        marginBottom: 10,
        height: 40,
        alignSelf: 'stretch'
    },
    placeholder: {
        fontSize: 18
    },
    wrapper: {
        flex: 1,
        marginTop: STATUSBAR_HEIGHT
    },
    buttonWrapper: {
        marginTop: 20,
        marginHorizontal: 20
    },
    validationError: {
        color: colors.RED,
        alignSelf: 'center'
    }
};

export class Logo extends React.Component {

    static logos = [
        'https://jimmified.com/img/logo1.png',
        'https://jimmified.com/img/logo2.png',
        'https://jimmified.com/img/logo3.png',
        'https://jimmified.com/img/logo4.png'
    ];

    constructor(props) {
        super(props);
        this.state = { currentLogo: 1 };
    }

    render() {

        return (
        <View style={{ marginTop: 75 }}>
            <Swiper
                height={200}
                showsPagination={false}
                autoplay={true}
                autoplayTimeout={10}
            >
                {_.map(Logo.logos, uri => <Image key={uri} source={{uri}} style={styles.logo}/>)}
            </Swiper>
        </View>);

    }
}

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.setStateForInputValue = this.setStateForInputValue.bind(this);
        this.onUsernameChange = _.partial(this.setStateForInputValue, 'username');
        this.onPasswordChange = _.partial(this.setStateForInputValue, 'password');

        this.state = {
            invalidLogin: false
        }
    }

    setStateForInputValue(field, value) {
        this.setState({
            [field]: value,
            invalidLogin: false
        });
    }

    onSubmit() {
        const { navigate } = this.props.navigation;
        jimmify.authenticate({
            username: this.state.username,
            password: this.state.password
        }).then((response) => {
            // TODO: Why isn't this a boolean!?!
            if (response.Status === 'false') {
                this.setState({
                    invalidLogin: true
                });
            // TODO: And why is this a different case!?!
            } else if (response.status === 'true') {
                store.save({
                    key: STORE_KEYS.login,
                    data: {
                        token: response.token
                    }
                });
                navigate('Main');
            }
            // navigate('Main');
        }).catch((error) => {
            console.warn('error', error);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Logo />
                <TextInput
                    autoCorrect={false}
                    returnKeyType={'next'}
                    onChangeText={this.onUsernameChange}
                    numberOfLines={1}
                    style={[styles.input, styles.placeholder]}
                    placeholder='Username'
                    onSubmitEditing={() => { this.passField.focus() }}
                />
                <TextInput
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={this.onPasswordChange}
                    numberOfLines={1}
                    secureTextEntry={true}
                    style={[styles.input, styles.placeholder]}
                    placeholder='Password'
                    ref={(passField) => this.passField = passField}
                />
                {this.state.invalidLogin &&
                    <Text style={styles.validationError}>Invalid username or password.</Text>
                }
                <View style={styles.buttonWrapper}>
                    <Button
                        color={colors.GREEN}
                        style={styles.button}
                        onPress={this.onSubmit}
                        title="SIGN IN"/>
                </View>
            </View>)
    }
}