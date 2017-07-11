import React from 'react';
import { TabNavigator } from 'react-navigation';
import { STATUSBAR_HEIGHT } from '../utils/constants';

import Queue from './Answer';
import Recent from './Recent';
import Search from './Search';

export default TabNavigator({
    Answer: { screen: Queue },
    Search: { screen: Search },
    Recent: { screen: Recent },
}, {
    initialRouteName: 'Search',
    lazy: true,
    tabBarOptions: {
        style: {
            marginTop: STATUSBAR_HEIGHT
        },
        backBehavior: 'none'
    }
})