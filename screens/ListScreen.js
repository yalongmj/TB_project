import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useState, useEffect } from 'react';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';


const data = [
  { name: 'Body Aches', hasStatus: true, icon: require('../assets/images/Body_aches.png') },
  { name: 'Bruising or Yellow Skin', hasStatus: true, icon: require('../assets/images/Bruising_or_yellow_skin.png') },
  { name: 'Cold Sweat', hasStatus: true, icon: require('../assets/images/Cold_sweat.png') },
  { name: 'Diarrhea', hasStatus: true, icon: require('../assets/images/Diarrhea_.png') },
  { name: 'Dizziness', hasStatus: true, icon: require('../assets/images/Dizziness_.png') },
  { name: 'Fever', hasStatus: true, icon: require('../assets/images/Fever.png') },
  { name: 'Headache', hasStatus: true, icon: require('../assets/images/Headache_.png') },
  { name: 'Insomnia', icon: require('../assets/images/Insomnia_.png') },
  { name: 'Itchy Skin', hasStatus: true, icon: require('../assets/images/Itchy_skin.png') },
  { name: 'Loss of Appetite', hasStatus: true, icon: require('../assets/images/Loss_of_appetite.png') },
  { name: 'Nausea', hasStatus: true, icon: require('../assets/images/Nausea_.png') },
  { name: 'Restlessness', hasStatus: true, icon: require('../assets/images/Restlessness_.png') },
  { name: 'Skin Rashes', hasStatus: true, icon: require('../assets/images/Skin_rashes.png') },
  { name: 'Upset Stomach', hasStatus: true, icon: require('../assets/images/Upset_stomach.png') },
  { name: 'Vertigo', hasStatus: true, icon: require('../assets/images/Vertigo_.png') },
  { name: 'Vomiting', hasStatus: true, icon: require('../assets/images/Vomiting_.png') },
];

const ListScreen = () => {
  const [userID, setUserID] = useState('');
  const [userLoaded, setUserLoaded] = useState(false);

  const [symptoms, setSymptoms] = useState([]);

  // Updated state for the checkboxes
  const [checkedItems, setCheckedItems] = useState([]);


  useEffect(() => {
    const getCurrentUserID = () => {
      onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          setUserID(user.uid);
        } else {
          console.log('No user is signed in');
        }
        setUserLoaded(true);
      });
    };

    getCurrentUserID();
  }, []);

  useEffect(() => {
    if (userLoaded && userID !== '') {
      fetchSymptoms();
    }
  }, [userLoaded, userID]);

  useEffect(() => {

  }, []);

  const fetchSymptoms = async () => {
    const symptomsCollection = collection(FIREBASE_DB, `users/${userID}/symptoms`);
    const snapshot = await getDocs(symptomsCollection);

    const symptoms = [];
    const checked = {};

    snapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      symptoms.push(data);
      checked[data.id] = data.isChecked; // Assuming isChecked is the property from the database
    });

    setSymptoms(symptoms);
    setCheckedItems(checked);
  };

  const toggleChecked = async (item) => {
    console.log(item)
    // Update local state
    const updatedCheckedItems = { ...checkedItems, [item.id]: !checkedItems[item.id] };
    setCheckedItems(updatedCheckedItems);

    // Update in Firebase
    const symptomsDocRef = doc(FIREBASE_DB, `users/${userID}/symptoms/${item.id}`);
    await updateDoc(symptomsDocRef, { isChecked: updatedCheckedItems[item.id] });
  };


  const renderItem = ({ item }) => {
    const foundSymptom = data.find(symptom => symptom.name === item.symptom);

    if (foundSymptom) {
      return (
        <View style={styles.listItem}>
          <View style={styles.itemContent}>
            <Image source={foundSymptom.icon} style={styles.icon} />
            <Text style={styles.itemName}>{item.symptom}</Text>
          </View>
          <Checkbox
            style={styles.checkbox}
            value={checkedItems[item.id] || false} // Use the value from the local state
            onValueChange={() => toggleChecked(item)}
          />
        </View>
      );
    } else {
      // Handle the case where the symptom is not found in the data array
      return (
        <View style={styles.listItem}>
          <Text>Symptom not found</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={symptoms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8, // Adjust the vertical padding to create space between items
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  itemName: {
    marginLeft: 10,
    fontSize: 16,
  },
  checkbox: {
    marginRight: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'lightgray', // Optional: Add a separator between items
  },
});

export default ListScreen;
