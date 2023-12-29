import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect


const MedicationStatusScreen = () => {
    const [userID, setUserID] = useState('');
    const [userLoaded, setUserLoaded] = useState(false);
    const [medicines, setMedicines] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
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
        }, [])
    );


    useFocusEffect(
        React.useCallback(() => {
            if (userLoaded && userID !== '') {
                fetchData();
            }
        }, [userLoaded, userID])
    );

    const fetchData = async () => {
        try {
            const userMedsCollection = collection(FIREBASE_DB, `users/${userID}/medicines`);
            const snapshot = await getDocs(userMedsCollection);

            const medicines = [];
            snapshot.forEach((doc) => {
                medicines.push({ id: doc.id, ...doc.data() });
            });

            setMedicines(medicines);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const missedMedicines = medicines.filter((medicine) => !medicine.imgURL);
    const completedMedicines = medicines.filter((medicine) => medicine.imgURL);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Medication Status</Text>
            </View>


            <View style={styles.completedContainer}>
                <View style={styles.completedTitleContainer}>
                    <Text style={styles.completedTitleText}>Completed</Text>
                </View>
                <View style={styles.completedMedicinesContainer}>
                    <ScrollView>
                        {completedMedicines.map((medicine) => (
                            <View style={styles.completedMedicineContainer} key={medicine.id}>
                                <Text style={styles.completedMedicineText}>Date: {medicine.date}</Text>
                                <Text style={styles.completedMedicineText}>Medicine: {medicine.medicine}</Text>
                                <Text style={styles.completedMedicineText}>Time: {medicine.time}</Text>
                                <Image
                                    source={{ uri: medicine.imgURL }}
                                    style={styles.completedMedicineImage}
                                />
                            </View>
                        ))}

                    </ScrollView>
                </View>
            </View>

            <View style={styles.missedContainer}>
                <View style={styles.missedTitleContainer}>
                    <Text style={styles.missedTitleText}>Missed</Text>
                </View>
                <View style={styles.completedMedicinesContainer}>
                    <ScrollView>
                        {completedMedicines.map((medicine) => (
                            <View style={styles.completedMedicineContainer} key={medicine.id}>
                                <Text style={styles.completedMedicineText}>Date: {medicine.date}</Text>
                                <Text style={styles.completedMedicineText}>Medicine: {medicine.medicine}</Text>
                                <Text style={styles.completedMedicineText}>Time: {medicine.time}</Text>
                                <Image
                                    source={{ uri: medicine.imgURL }}
                                    style={styles.completedMedicineImage}
                                />
                            </View>
                        ))}

                    </ScrollView>
                </View>
            </View>


            {/* <FlatList
                data={medicines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.medicineContainer}>
                        <Text>Date: {item.date}</Text>
                        <Text>Medicine: {item.medicine}</Text>
                        <Text>Time: {item.time}</Text>
                        {item.imgURL ? <Image source={{ uri: item.imgURL }} style={styles.image} /> : <Text>Missed!</Text>}
                    </View>
                )}
            /> */}

            {/* <Button title="Debug" onPress={() => { console.log(medicines, "askdakdjajskd") }} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        // justifyContent: 'center',
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
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    medicineContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 8,
    },
    completedContainer: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        minHeight: 100,
        borderRadius: 15,
        ...Platform.select({
            android: {
                elevation: 5,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            },
        }),
    },
    completedTitleContainer: {
        padding: 16,
        margin: 0,
        backgroundColor: '#ACE3DE',
        width: '100%',
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    completedTitleText: {
        color: '#00756A',
        fontSize: 20,
        fontWeight: 'bold'
    },
    completedMedicinesContainer: {
        maxHeight: 200,
    },
    completedMedicineContainer: {
        marginTop: 10,
        marginHorizontal: 'auto',
        width: '90%',
        borderRadius: 15,
        alignSelf: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#00756A',
    },
    completedMedicineText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    completedMedicineImage: {

    },
    missedContainer: {
        marginTop: 15,
        backgroundColor: '#FFFFFF',
        width: '90%',
        minHeight: 100,
        borderRadius: 15,
        ...Platform.select({
            android: {
                elevation: 5,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            },
        }),
    },
    missedTitleContainer: {
        padding: 16,
        margin: 0,
        backgroundColor: '#FFCFCF',
        width: '100%',
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    missedTitleText: {
        color: '#D12846',
        fontSize: 20,
        fontWeight: 'bold'
    },

});

export default MedicationStatusScreen;



