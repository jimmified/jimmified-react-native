import _ from 'lodash';
import React from 'react';
import { Notifications } from 'expo';
import { Text, FlatList, TouchableOpacity, View } from 'react-native';
import { colors } from '../../utils/constants';

const defaultErrorMessage = 'Error fetching results, please check your network connection';

const styles = {
    placeholder: {
        margin: 20,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.GRAY_DARK
    }
};

export default function(requestFunc, Item, options={}) {

  const errorText = options.errorText || defaultErrorMessage;
  const responseKey = options.responseKey;
  options.placeholder = options.placeholder || 'Nothing here.\nPull down to refresh.';
  const placeholder = _.isString(options.placeholder) ?
    <Text style={styles.placeholder}>{options.placeholder}</Text> : options.placeholder;

  return class extends React.Component {
    constructor(props) {
      super(props);

      this.renderItem = this.renderItem.bind(this);
      this.refresh = this.refresh.bind(this);
      this._refresh = this._refresh.bind(this);
      this.state = {loading: true};
      this._refresh();
    }

    componentWillMount() {
      this.notificationSubscription = Notifications.addListener(() => {
        this.refresh();
        Expo.Notifications.setBadgeNumberAsync(0);
      });
    }

    componentWillUnmount() {
      this.notificationSubscription.remove();
    }

    refresh() {
      this.setState({
        loading: true
      });
      this._refresh();
    }

    _refresh() {
      requestFunc().then((response) => {
        this.setState({loading: false});
        if (response.status) {
          if (responseKey) {
            response = response[responseKey];
          }
          this.setState({response});
        } else {
          this.setState({error: errorText});
        }
      }).catch((err) => {
        console.error(err);
        this.setState({error: err.message, loading: false});
      });
    }

    renderItem(props) {

      const Wrapper = this.props.onSelectItem ? TouchableOpacity : View;

      return (
        <Wrapper onPress={_.partial(this.props.onSelectItem || _.noop, props)}>
            <Item {...props} />
        </Wrapper>
      );
    }

    render() {
      const data = this.state.response || [];

      if (this.state.error) {
        return (<Text style={{color: colors.RED}}>{this.state.error}</Text>);
      }

      return (<FlatList
        style={{backgroundColor: colors.GRAY_LIGHT}}
        data={this.state.response || []}
        extraData={this.state}
        ListEmptyComponent={placeholder}
        renderItem={this.renderItem}
        refreshing={this.state.loading}
        onRefresh={this.refresh}
      />)
    }
  }
}