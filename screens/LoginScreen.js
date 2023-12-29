import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import { useNavigation } from '@react-navigation/core'
import Toast from 'react-native-toast-message';


const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()


    const showToast = (type, text1, text2) => {
        Toast.show({
            type,
            text1,
            text2,
        });
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                const user = userCredential.user; // maybe put this to async storage

                navigation.navigate('Home');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showToast('error', 'Account Error', "Invalid Login Credentials")
            });
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding">

            <View style={styles.header}>
                <Text style={styles.headerText}>Login</Text>
            </View>


            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/logo1.png')}
                    style={styles.logo}
                />
            </View>

            <View style={{
                width: "80%"
            }}>
                <Text style={{
                    fontSize: 32,
                    alignSelf: "flex-start",
                    marginBottom: 30
                }}>Sign In</Text>
            </View>

            <View style={styles.inputContainer}>
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
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                    <Text>Don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.buttonOutlineText}>Sign Up here</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Toast ref={(ref) => Toast.setRef(ref)} />
        </KeyboardAvoidingView>
    )
}
export default LoginScreen

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
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    inputContainer: {
        width: '80%',
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
    linkContainer: {
        display: "flex",
        flexDirection: 'row',
        gap: 5,
        marginTop: 30
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
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
})