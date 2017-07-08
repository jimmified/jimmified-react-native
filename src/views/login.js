import React from 'react';
import { View, TextInput, Image, TouchableOpacity, Text } from 'react-native';
import { colors } from '../utils/constants';

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
        flex: 1
    },
    button: {
        backgroundColor: colors.GREEN,
        marginHorizontal: 20,
        marginTop: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    }
};

export default class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<View style={styles.wrapper}>
            <Image
                source={require('../../assets/images/jimmy-logo.png')}
                style={styles.logo}
            />
            <TextInput
                numberOfLines={1}
                style={[styles.input, styles.placeholder]}
                placeholder='Username'
            />
            <TextInput
                numberOfLines={1}
                secureTextEntry={true}
                style={[styles.input, styles.placeholder]}
                placeholder='Password'
            />
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
        </View>)
    }
}