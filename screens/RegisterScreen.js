import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { useNavigation } from '@react-navigation/core'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message';


const RegisterScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const navigation = useNavigation()

    const showToast = (type, text1, text2) => {
        Toast.show({
            type,
            text1,
            text2,
        });
    };

    const handleSignUp = () => {

        if (password.length < 5) {
            showToast('info', 'Password Length', 'Password Length should be 5 above')
            return;
        }
        createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await setDoc(doc(FIREBASE_DB, "users", user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                });

                const userSymptomCollection = collection(FIREBASE_DB, `users/${user.uid}/symptoms`);
                const symptoms = ["Body Aches", "Bruising or Yellow Skin", "Cold Sweat", "Diarrhea", "Dizziness",
                    "Fever", "Headache", "Insomnia", "Itchy Skin", "Loss of Appetite", "Nausea", "Restlessness", "Skin Rashes",
                    "Upset Stomach", "Vertigo", "Vomiting"];

                symptoms.forEach(async (symptom) => {
                    await addDoc(userSymptomCollection, {
                        symptom: symptom,
                        isChecked: false
                    });
                });

                showToast('success', 'Account Created', 'Account successfully created')

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showToast('error', 'Account Error', errorMessage)
            });
    }


    return (
        <View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding">


                <View style={styles.header}>
                    <Text style={styles.headerText}>Register</Text>
                </View>

                <View style={{
                    width: "80%"
                }}>
                    <Text style={{
                        fontSize: 32,
                        alignSelf: "flex-start",
                        marginBottom: 30
                    }}>Register</Text>
                </View>

                <View style={styles.inputContainer}>

                    <TextInput
                        placeholder="First name"
                        value={firstName}
                        onChangeText={text => setFirstName(text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Last name"
                        value={lastName}
                        onChangeText={text => setLastName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleSignUp} // Call handleSignUp function when the Register button is pressed
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>


                    <View style={styles.linkContainer}>
                        <Text>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.buttonOutlineText}>Sign In here</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>



            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    )
}
export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: '#EAEAEA',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#5F7C8E',
        width: '100%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    linkContainer: {
        display: "flex",
        flexDirection: 'row',
        gap: 5,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
})