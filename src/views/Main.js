import React from 'react';
import { TabNavigator } from 'react-navigation';
import { STATUSBAR_HEIGHT } from '../utils/constants';

import Queue from './Queue';
import Recent from './Recent';

export default TabNavigator({
    Queue: {
        screen: Queue
    },
    Recent: {
        screen: Recent
    }
}, {
    tabBarOptions: {
        style: {
            marginTop: STATUSBAR_HEIGHT
        },
        backBehavior: 'none'
    }
})