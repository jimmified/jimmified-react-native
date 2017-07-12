import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function IconButton(props) {
    return (
            <Ionicons {...props}/>
    );
}

IconButton.defaultProps = {
    onPress: _.noop
};

IconButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    size: PropTypes.number,
    color: PropTypes.string
};