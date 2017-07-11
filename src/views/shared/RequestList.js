import _ from 'lodash';
import React from 'react';
import { Text, FlatList } from 'react-native';
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
    const placeholder = _.isString(options.placeholder) ? <Text style={styles.placeholder}>{options.placeholder}</Text> : options.placeholder;

    return class extends React.Component {

        constructor(props) {
            super(props);

            this.refresh = this.refresh.bind(this);
            this.state = { loading: true };
            this.refresh();
        }

        refresh() {
            requestFunc().then((response) => {
                this.setState({ loading: false });
                if (response.status) {
                    if (responseKey) {
                        response = response[responseKey];
                    }
                    this.setState({ response });
                } else {
                    this.setState({ error: errorText });
                }
            }).catch((err) => {
                console.error(err);
                this.setState({ error: err.message, loading: false });
            });
        }

        render() {
            const data = this.state.response || [];

            if (this.state.error) {
                return (<Text style={{ color: colors.RED }}>{this.state.error}</Text>);
            }

            return (<FlatList
                style={{ backgroundColor: colors.GRAY_LIGHT }}
                data={this.state.response || []}
                extraData={this.state}
                ListEmptyComponent={placeholder}
                renderItem={Item}
                refreshing={this.state.loading}
                onRefresh={() => {
                    this.setState({ loading: true });
                    this.refresh();
                }}
            />)
        }
    }
}