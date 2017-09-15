import _ from 'lodash';
import React from 'react';
import * as pushNotifications from '../utils/pushNotification';
import { STORE_KEYS, colors, STATUSBAR_HEIGHT, JIMMIFY_API_URL } from 'utils/constants';
import storage from 'utils/store';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Platform, Switch } from 'react-native';
import Login from './Login';
import Prompt from 'react-native-prompt';
import { setJimmyUrl, getJimmyUrl } from "../utils/jimmify";

const SETTINGS = [
  function title() {
    return (<View
        key="title"
        style={{
            alignItems: 'center',
            justifyContent: 'space-around'
        }}
    >
        <Text style={{
            fontSize: 32
        }}>Settings</Text>
    </View>)
  },
  function login(state, props, setState) {
    function callback() {
        if (state.loggedIn) {
          storage.remove({ key: STORE_KEYS.login });
          setState({ loggedIn: false });
        } else {
            setState({ showLoginModal: true });
        }
    }

    return (
      <View
        key="login"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginVertical: 10
      }}>
        <Text style={{
            fontSize: 24
        }}>Logged In</Text>
        <Switch value={state.loggedIn} onValueChange={callback} />
      </View>
    )
  },
  function enablePushNotifications(state, props, setState) {

    function callback() {
      if (state.pushNotifications) {
        if (state.token) {
          pushNotifications.unregister(state.token);
          setState({ pushNotifications: false });
        } else {
          console.warn("Can't unregister since you're not logged in");
        }
      } else {
        if (state.token) {
          pushNotifications.register(state.token);
        } else {
          console.warn("Can't register since you're not logged in");
        }
      }
    }

    return (
      <View
        key="push"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginVertical: 10
        }}>
        <Text style={{
          fontSize: 24
        }}>Push Notifications</Text>
        <Switch value={state.pushNotifications} onValueChange={callback} disabled={!state.loggedIn} />
      </View>
    )
  },
  function devServer(state, props, setState) {
    if (state.showServerList) {
      return (<Prompt
        key="devServer"
        title="Jimmify Server"
        defaultValue={state.server}
        visible={true}
        onCancel={() => {
          setState({ showServerList: false });
        }}
        onSubmit={(server) => {
          setState({ showServerList: false, server });
          setJimmyUrl(server);
        }}
      />)
    }

    return (
      <View key="devServer">
        <TouchableOpacity  onPress={() => {
          setState({ showServerList: true })
        }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginVertical: 10
            }}
          >
              <Text style={{ fontSize: 24 }}>Jimmified Server</Text>
            <Text style={{ marginLeft: 10 }}>{state.server}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
          onPress={() => {
            setState({ server: JIMMIFY_API_URL });
            setJimmyUrl(JIMMIFY_API_URL);
          }}
        >
          <Text style={{ color: colors.RED }}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
];

const styles = {

    withMargin: {
        marginHorizontal: 20
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

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        this.state = {
          loggedIn: false,
          showLoginModal: false,
          pushNotifications: false,
          server: JIMMIFY_API_URL,
          showServerList: false
        };

        storage
            .load({ key: STORE_KEYS.login })
            .then(({ token }) => {
                this.setState({ loggedIn: true, token });
            }).catch(error => {
                if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
                    // Do nothing
                    return;
                }
                console.warn(error.message);
            });

        getJimmyUrl().then(server => {
          this.setState({ server });
        });

        pushNotifications.isEnabled().then(isEnabled => {
          this.setState({
            pushNotifications: isEnabled
          });
        })
    }

    renderItem(item) {
        return item(this.state, this.props, this.setState.bind(this));
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
        if (this.state.showLoginModal) {
            return (
              <View>
                  <View style={styles.modalTop}>
                      <TouchableOpacity onPress={() => { this.setState({ showLoginModal: false }) }}>
                          <Text style={{ fontSize: 30, color: colors.GRAY_DARK }}>✖</Text>
                      </TouchableOpacity>
                  </View>
                  <Login onLogin={(token) => {
                    this.setState({ loggedIn: true, showLoginModal: false, token });
                  }}/>
              </View>
            )
        }

        function spacer(key) {
          return (<View style={{ height: 0, borderBottomWidth: 2, borderColor: colors.GRAY_LIGHT }} key={key} />);
        }

        return (
            <View style={{ justifyContent: 'space-between', marginTop: 20 }}>
              {_.flatten(_.map(SETTINGS, (s, i) => {
                if (i < 2) {
                  return this.renderItem(s);
                }
                return [spacer(i), this.renderItem(s)];
              }))}
            </View>
        )
    }
}