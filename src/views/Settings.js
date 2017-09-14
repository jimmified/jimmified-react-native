import _ from 'lodash';
import React from 'react';
import { STORE_KEYS, colors, STATUSBAR_HEIGHT } from 'utils/constants';
import storage from 'utils/store';
import { Ionicons } from '@expo/vector-icons';
import { View, FlatList, Text, TouchableOpacity, Platform } from 'react-native';
import IconButton from 'shared/IconButton'
import Modal from 'react-native-modalbox';
import Login from './Login';

const SETTINGS = [
    {
        name: 'Log in',
        icon: 'ios-log-in-outline',
        type: 'button',
        enabled: (props, state) => !state.loggedIn,
        onSelect: (foo) => {
            foo.loginModal.open();
        }
    },
    {
        name: 'Log out',
        icon: 'ios-log-out-outline',
        enabled: (props, state) => state.loggedIn,
        type: 'button',
        onSelect() {
            console.log('Setting state');
            storage.remove({ key: STORE_KEYS.login });
            return { loggedIn: false };
        }
    }
];

const styles = {

    withMargin: {
        marginHorizontal: 20
    },

    settingButton: {
        wrapper: {
            marginHorizontal: 20,
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-around'
        },
        name: {

        },
        icon: {
        }
    },
    modal: {},
    modalTop: {
        paddingTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
};

export default class Settings extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'Settings',
        tabBarIcon: ({tintColor}) => {
            return <Ionicons name="ios-settings-outline" size={32} color={tintColor}/>
        }
    };

    _keyExtractor = (item, index) => item.name;

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        this.state = { loggedIn: false  } ;

        storage
            .load({ key: STORE_KEYS.login })
            .then(() => {
                this.setState({ loggedIn: true });
            }).catch(error => {
                if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
                    // Do nothing
                    return;
                }
                console.warn(error.message);
        });
    }

    renderItem({ item }) {

        if (!_.isUndefined(item.enabled)) {
            if (!Boolean(item.enabled)) {
                return null;
            }
            if (_.isFunction(item.enabled)) {
                if (!item.enabled(this.props, this.state)) {
                    return null;
                }
            }
        }

        if (item.type === 'button') {
            const func = item.onSelect || _.noop;

            const callback = () => {
                const newState = func(this);
                if (_.isObject(newState)) {
                    this.setState(newState);
                }
            };

            return (
                <TouchableOpacity onPress={callback}>
                    <View style={[styles.settingButton.wrapper]}>
                        <Text>{item.name}</Text>
                        <IconButton onPress={_.noop} name={item.icon} size={32}/>
                    </View>
                </TouchableOpacity>
            )

        }
    }

    componentWillReceiveProps() {
        storage
            .load({ key: STORE_KEYS.login })
            .then(() => {
                this.setState({ loggedIn: true });
            }).catch(error => {
            if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
                this.setState({ loggedIn: false });
            }
        });
    }

    render() {
        return (
            <View>
                {!this.state.loggedIn && <Modal ref={login => this.loginModal = login} style={styles.modal} coverScreen={true} swipeToClose={false}>
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
                </Modal>}
                <FlatList
                    style={{ backgroundColor: colors.GRAY_LIGHT }}
                    data={SETTINGS}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        )
    }
}