import React from 'react';
import jimmify from '../utils/jimmify';
import { View, TextInput, Image, Button, Alert } from 'react-native';
import { colors } from '../utils/constants';

const styles = {
    container: {
    },
    logo: {
        width: null,
        resizeMode: 'contain',
        height: 200,
        marginHorizontal: 10,
        alignSelf: 'stretch'
    },
    search: {
        marginHorizontal: 20,
        marginBottom: 10,
        height: 40,
        alignSelf: 'stretch'
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    submitWrapper: {
        width: '50%'
    },
    submit: {
        paddingHorizontal: 40
    }
};

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.onEdit = this.onEdit.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = { searchText: '' };
    }

    onEdit(searchText) {
        this.setState({ searchText });
    }

    onSearch() {
        jimmify.search(this.state.searchText).then(() => {
            Alert.alert('Thanks!', 'Thanks for your question. Jimmy will answer it shortly.',[
                { text: 'OK' }
            ], { cancelable: true });
            this.searchInput.clear();
        }).catch(err => {
            console.warn(err);
        })
    }

    render() {
        return (<View style={styles.container}>
            <Image style={styles.logo} source={{uri: 'https://jimmified.com/img/logo1.png' }}/>
            <TextInput
                ref={input => this.searchInput = input}
                style={styles.search}
                placeholder='Ask Jimmy'
                onChangeText={this.onEdit}
            />

            <View style={styles.buttonWrapper}>
                <View style={styles.submitWrapper}>
                    <Button title="Search" onPress={this.onSearch} color={colors.GREEN}/>
                </View>
            </View>
        </View>);
    }
}