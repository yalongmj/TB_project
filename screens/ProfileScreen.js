import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState('')
  const [userLoaded, setUserLoaded] = useState(false);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getCurrentUserID = () => {
      onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          setUser(user);
        } else {
          console.log('No user is signed in');
        }
        setUserLoaded(true);
      });
    };
    getCurrentUserID();
  }, []);

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handleChangePassword = async () => {
    sendPasswordResetEmail(FIREBASE_AUTH, user.email)
      .then(() => {
        showToast('info', 'Password Reset', 'Password reset email sent successfully.')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showToast('info', 'Error sending password reset email', errorMessage)
      });
  };

  const handleChooseImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setLoading(true);

        const storageRef = ref(getStorage(), `profile/${user.uid}`);
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        fetchImageUrl();
        showToast('success', 'Image uploaded', 'Profile picture updated');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
      showToast('error', 'Error uploading image', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchImageUrl = async () => {
    try {
      const storageRef = ref(getStorage(), `profile/${user.uid}`);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL); // Log the URL here
      setImage(downloadURL);
    } catch (error) {
      console.error('Error fetching image URL: ', error);
      // showToast('error', 'Error fetching image URL', error.message);
    }
  };


  useEffect(() => {
    fetchImageUrl();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Profile</Text>
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Image source={require('../assets/no.jpeg')} style={styles.image} />
      )}

      <Text style={{
        fontSize: 30,
        marginTop: 10,
        color: '#00796B',
        marginBottom: 10
      }}>{user.email}</Text>


      <TouchableOpacity style={styles.uploadButton} onPress={handleChooseImage}>
        <FontAwesome name="upload" size={20} color="#5F7C8E" />
        <Text style={styles.uploadText}> Update Profile Picture</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => {
        // console.log(user)
        navigation.navigate('Login')
      }}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>




      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: "green",
    width: '100%',
    minHeight: "20%",
    position: "relative",
    paddingBottom: "20px",
    borderRadius: 20,
    marginBottom: 40
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePasswordButton: {
    backgroundColor: "#00796B",
    width: '70%',
    padding: 15,
    borderRadius: 5,
    color: 'FFFFFF',
    marginTop: 100,
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: 'red',
    width: '70%',
    padding: 15,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
