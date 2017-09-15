import React from 'react';
import { Notifications } from 'expo';
import { View, Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { STATUSBAR_HEIGHT, events } from '../utils/constants';
import pubsub from 'utils/pubsub';

import Queue from './Answer';
import Recent from './Recent';
import Search from './Search';
import Settings from './Settings';

const styles = {
    wrapped: {
        marginTop: Platform.OS === 'android' ? 0 : STATUSBAR_HEIGHT
    }
};

function withNavigationIsFocused(WrappedContainer) {

    return class extends React.Component {
        static navigationOptions = {
            ...WrappedContainer.navigationOptions
        };

        constructor(props) {
            super(props);
            this.route = WrappedContainer.navigationOptions.tabBarLabel;
            this.onStateChange = this.onStateChange.bind(this);
            const currentRoute = props.navigation.state.routeName;
            this.state = {
                isFocused: currentRoute === this.route,
            }
        }

        onStateChange({ prevState, currentState }) {
            if (prevState !== currentState) {
                const isFocused = this.route === currentState;
                if (this.state.isFocused !== isFocused) {
                    this.setState({ isFocused });
                }
            }
        }

        componentDidMount() {
            pubsub.subscribe(events.NAV, this.onStateChange);
        }

        componentWillUnmount() {
            pubsub.unsubscribe(events.NAV, this.onStateChange);
        }

        render() {
            return <WrappedContainer isFocused={this.state.isFocused} {...this.props} />;
        }
    }
}

function WithTopPadding(Comp) {
    const wrapped = function(props) {
        return (<View style={styles.wrapped}>
            <Comp {...props}/>
        </View>)
    };

    wrapped.navigationOptions = Comp.navigationOptions;
    return withNavigationIsFocused(wrapped);
}

const Navigator = TabNavigator({
    Answer: { screen: WithTopPadding(Queue) },
    Search: { screen: WithTopPadding(Search) },
    Recent: { screen: WithTopPadding(Recent) },
    Settings: { screen: WithTopPadding(Settings) }
}, {
    initialRouteName: 'Settings',
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

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

export default class Main extends React.Component {

    render() {
        return <Navigator
            onNavigationStateChange={(prevState, currentState) => {
                pubsub.publish(events.NAV, {prevState: getCurrentRouteName(prevState), currentState: getCurrentRouteName(currentState)});
            }}
        />
    }
}
