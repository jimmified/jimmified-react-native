import React from 'react';
import { View, Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { STATUSBAR_HEIGHT } from '../utils/constants';

import Queue from './Answer';
import Recent from './Recent';
import Search from './Search';
import Settings from './Settings';

const styles = {
    wrapped: {
        marginTop: Platform.OS === 'android' ? 0 : STATUSBAR_HEIGHT
    }
};

function WithTopPadding(Comp) {
    const wrapped = function(props) {
        return (<View style={styles.wrapped}>
            <Comp {...props}/>
        </View>)
    };

    wrapped.navigationOptions = Comp.navigationOptions;
    return wrapped;
}

export default TabNavigator({
    Answer: { screen: WithTopPadding(Queue) },
    Search: { screen: WithTopPadding(Search) },
    Recent: { screen: WithTopPadding(Recent) },
    Settings: { screen: WithTopPadding(Settings) }
}, {
    initialRouteName: 'Search',
    lazy: true,
    tabBarOptions: {
        showLabel: false,
        showIcon: true,
        style: {
            marginTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0
        },
        backBehavior: 'none'
    }
});
