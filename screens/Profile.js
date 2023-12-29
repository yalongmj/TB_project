import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { FIREBASE_AUTH } from '../firebase';

const Profile = ({ navigation }) => {
    return (
        <View style={styles.container}>
           <View style={styles.header}>
                <Text style={styles.headerText}>Profile</Text>
            </View>


            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('ProfileScreen');
                }}>
                    <Image
                        source={require('../assets/images/Cold_sweat.png')}
                        style={styles.profileStyle}
                    />
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 600
                    }}>Hi, "Christian" </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('Symptoms');
            }}>
                <Text style={styles.buttonText}>Symptoms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('MedicationStatus');
            }}>
                <Text style={styles.buttonText}>Medication Status</Text>
            </TouchableOpacity>


            <Text>Rural Health Unit / Hospital Location</Text>

            <Image
                source={require('../assets/images/Body_aches.png')} // Update the image path accordingly
                style={styles.imageStyle}
                resizeMode="cover"
            />

            <View style={styles.reminder} >
                <Text style={{
                    color: "#455154",
                    fontWeight: "bold",
                    fontSize: 20
                }}>Reminder: </Text>
                <Text style={{
                    color: "#455154",
                    fontWeight: "bold",
                    fontSize: 15
                }}>Take your medicine regularly</Text>
            </View>

        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#F7F7F5',
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
    profileContainer: {
        width: '70%',
        height: 120,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#5F7C8E',
        width: '75%',
        padding: 15,
        borderRadius: 5,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    imageStyle: {
        width: '70%',
        height: 150,
        marginBottom: 10,
    },
    profileStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,

    },
    reminder: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: '#ACE3DE',
        width: '75%',
        padding: 20,
        borderRadius: 5,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
