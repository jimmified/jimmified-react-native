import React from 'react';
import { View, TextInput, Image, Button } from 'react-native';
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
    }

    onEdit(searchText) {
        this.setState({ searchText });
    }

    onSearch() {

    }

    render() {
        return (<View style={styles.container}>
            <Image style={styles.logo} source={{uri: 'https://jimmified.com/img/logo1.png' }}/>
            <TextInput
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