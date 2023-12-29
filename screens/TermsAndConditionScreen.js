import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet,BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TermsAndConditionsScreen = ({ navigation }) => {
  useEffect(() => {
    checkTermsAndConditions();
  }, []);

  const checkTermsAndConditions = async () => {
    const acceptedTerms = await AsyncStorage.getItem('acceptedTerms');
    if (acceptedTerms) {
      navigation.navigate('Login');
    }
  };

  const handleAccept = async () => {
    await AsyncStorage.setItem('acceptedTerms', 'true');
    navigation.navigate('Login');
  };

  const handleDisagree = () => {
    BackHandler.exitApp(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.termsText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero in metus
        consequat, sed facilisis est varius. Vestibulum feugiat enim id tellus tempor, vitae
        consectetur metus tincidunt.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Agree" onPress={handleAccept} />
        <Button title="Disagree" onPress={handleDisagree} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  termsText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});

export default TermsAndConditionsScreen;
