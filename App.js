import React from 'react';
import { StackNavigator } from 'react-navigation';
import Login from './src/views/Login';
import Main from './src/views/Main';

export default StackNavigator({
    Login: { screen: Login},
    Main: { screen: Main}
}, {
    headerMode: 'none'
});
