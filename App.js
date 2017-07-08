import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Login from './src/views/login';

export default class App extends React.Component {
  render() {
    return (
        <Login/>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
});
