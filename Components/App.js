/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Dimensions, SafeAreaView, Linking} from 'react-native';
import Post from './Post'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    fetch('https://www.reddit.com/top.json')
    .catch((reason) => {
      console.log(reason);
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson.data.children  
      })
      console.log(responseJson);
    })
  }

  onBuffer() {
    console.log("onBuffer");
  }
  
  render() {
    if (this.state.isLoading) {
      return(
        <SafeAreaView style={styles.container}>
          <ActivityIndicator/>
        </SafeAreaView>
      )
    }
    console.log(this.state.dataSource);
    return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={this.state.dataSource}
        renderItem={({item}) => <Post {...item}/>}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
  }
});
