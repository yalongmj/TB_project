import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Video } from 'expo-av';
import { FIREBASE_AUTH } from '../firebase';

const HomeScreen = () => {
  const [users, setUsers] = useState([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>


      <Text>Email: {FIREBASE_AUTH.currentUser?.email}</Text>
      <Text>UID: {FIREBASE_AUTH.currentUser?.uid}</Text>

      <Video
        source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  video: {
    width: 300,
    height: 200,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
  },
  header: {
    backgroundColor: 'green',
    width: '100%',
    minHeight: '20%',
    position: 'relative',
    paddingBottom: 20,
    borderRadius: 20,
    marginBottom: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 3
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})