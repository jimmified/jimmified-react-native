import _ from 'lodash';
import React from 'react';
import { View, Image } from 'react-native';
import Swiper from 'react-native-swiper';

const styles = {
    wrapper: {
        marginTop: 75
    },
    logo: {
        width: null,
        resizeMode: 'contain',
        height: 200,
        marginHorizontal: 10,
        alignSelf: 'stretch'
    }
};

const logos = _.map([
    'https://jimmified.com/img/logo1.png',
    'https://jimmified.com/img/logo2.png',
    'https://jimmified.com/img/logo3.png',
    'https://jimmified.com/img/logo4.png'
], uri => <Image key={uri} source={{uri}} style={styles.logo}/>);

export default class Logo extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentLogo: 1 };
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Swiper
                    height={200}
                    showsPagination={false}
                    autoplay={true}
                    autoplayTimeout={10}
                >
                    {logos}
                </Swiper>
            </View>);

    }
}