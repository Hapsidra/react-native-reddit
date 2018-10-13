/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Dimensions} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }
  componentDidMount() {
    console.log("did mount");
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
  render() {
    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, padding: 20, justifyContent: 'center'}}>
          <ActivityIndicator/>
        </View>
      )
    }
    console.log('got');
    console.log(this.state.dataSource);
    return (<View style={styles.container}>
      <FlatList
        style={styles.list}
        data={this.state.dataSource}
        renderItem={({item}) => 
        <View style={styles.post}>
          {
          <Image
            resizeMode='contain'
            source={{
              uri: item.data.url
            }}
            style={{
              backgroundColor: "black",
              width: window.width,
              height: item.data.preview ? (window.width * (item.data.preview.images[0].source.height / item.data.preview.images[0].source.width)) : 0
            }}
          />
          }
          <Text style={styles.title}>{item.data.title}</Text>
        </View>
        }
      />
    </View>)
  }
}

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  list: {
    paddingTop: 40
  },
  post: {
    marginBottom: 20
  }
});
