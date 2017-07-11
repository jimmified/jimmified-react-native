import _ from 'lodash';
import React from 'react';
import jimmify from '../utils/jimmify';
import Logo from './shared/RotatingLogos';
import { View, TextInput, Button, Text } from 'react-native';
import { colors, STATUSBAR_HEIGHT, STORE_KEYS } from '../utils/constants';
import store from '../utils/store';

const styles = {
    input: {
        marginHorizontal: 20,
        marginBottom: 10,
        height: 40,
        alignSelf: 'stretch'
    },
    placeholder: {
        fontSize: 18
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

    static defaultProps = {
        onLogin: () => {}
    };

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
        jimmify.authenticate({
            username: this.state.username,
            password: this.state.password
        }).then((response) => {
            // TODO: Why isn't this a boolean!?!
            if (response.status === false) {
                this.setState({
                    invalidLogin: true
                });
            // TODO: And why is this a different case!?!
            } else if (response.status === true) {
                store.save({
                    key: STORE_KEYS.login,
                    data: {
                        token: response.token
                    }
                });
                this.props.onLogin(response.token);
            }
        }).catch((error) => {
            console.warn('error', error);
        });
    }

    render() {
        return (
            <View>
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
                        onPress={this.onSubmit}
                        title="SIGN IN"/>
                </View>
            </View>)
    }
}
