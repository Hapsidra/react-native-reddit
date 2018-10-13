/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Dimensions, SafeAreaView, Linking} from 'react-native';
import Video from 'react-native-video';

const date = new Date();
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
        renderItem={({item}) => 
        <View style={styles.post}>
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <View style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-around"
            }}>
              <Text style={styles.name}>{item.data.subreddit_name_prefixed}</Text>
              <Text style={styles.name}>u/{item.data.author}</Text>
            </View>
            <Text style={styles.time}>{Math.round((date.getTime() - new Date(item.data.created_utc * 1000).getTime()) / 1000 / 60 / 60)} hours ago</Text>
          </View>
          <Text style={styles.title}>{item.data.title}</Text>
          {
            item.data.is_video? 
          <Video source={{uri: item.data.media.reddit_video.fallback_url || item.data.preview.reddit_video_preview.fallback_url}}
            paused={true}
            controls={true}
            onBuffer={this.onBuffer}
            ref={(ref) => {
              this.player = ref
            }}  
            style={{
              width: window.width,
              height: item.data.preview ? (window.width * (item.data.preview.images[0].source.height / item.data.preview.images[0].source.width)) : 0
            }}
          />:
          item.data.preview && item.data.preview.reddit_video_preview && item.data.preview.reddit_video_preview.is_gif?
          <Video source={{uri: item.data.preview.reddit_video_preview.fallback_url}}
            paused={true}
            controls={true}
            onBuffer={this.onBuffer}
            ref={(ref) => {
              this.player = ref
            }}  
            style={{
              width: window.width,
              height: item.data.preview ? (window.width * (item.data.preview.images[0].source.height / item.data.preview.images[0].source.width)) : 0
            }}
          />:
          item.data.url.endsWith(".jpg") ?
          <Image
            resizeMode='contain'
            source={{
              uri: item.data.url
            }}
            style={{
              width: window.width,
              height: item.data.preview ? (window.width * (item.data.preview.images[0].source.height / item.data.preview.images[0].source.width)) : 0
            }}
          />:
          item.data.url?
          <Text style={{color: 'blue'}}
            onPress={() => Linking.openURL(item.data.url)}>
            {item.data.url}
          </Text>
          : null
          }
          <View style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              margin: 2
            }}>
              <Text style={styles.button}>Score {item.data.score}</Text>
              <Text style={styles.button}>Comments {item.data.num_comments}</Text>
            </View>
        </View>
        }
      />
    </SafeAreaView>
    )
  }
}
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
  },
  title: {
    fontFamily: "Avenir Next",
    fontSize: 18,
    color: "black"
  },
  time: {
    fontFamily: "Avenir Next",
    color: "#A9A9A9",
    fontSize: 13,
  },
  name: {
    fontFamily: "Avenir Next",
    color: "#696969",
    fontSize: 14,
  },
  button: {
    fontFamily: "Avenir Next",
  },
  post: {
    backgroundColor: "white",
    marginBottom: 10
  }
});
