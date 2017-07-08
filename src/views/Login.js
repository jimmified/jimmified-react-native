import _ from 'lodash';
import React from 'react';
import jimmify from '../utils/jimmify';
import { View, TextInput, Image, Button, Text } from 'react-native';
import { colors, STATUSBAR_HEIGHT, STORE_KEYS } from '../utils/constants';
import store from '../utils/store';

const styles = {
    logo: {
        marginTop: 50,
        width: null,
        resizeMode: 'contain',
        height: 220,
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
        }).catch((error) => {
            console.warn('error', error);
        });
    }

    render() {
        return (<View style={styles.wrapper}>
            <Image
                source={require('../../assets/images/jimmy-logo.png')}
                style={styles.logo}
            />
            <TextInput
                onChangeText={this.onUsernameChange}
                numberOfLines={1}
                style={[styles.input, styles.placeholder]}
                placeholder='Username'
            />
            <TextInput
                onChangeText={this.onPasswordChange}
                numberOfLines={1}
                secureTextEntry={true}
                style={[styles.input, styles.placeholder]}
                placeholder='Password'
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