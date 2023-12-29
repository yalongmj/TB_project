import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button, Image, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const CalendarScreen = () => {
    const [userID, setUserID] = useState('')
    const [userLoaded, setUserLoaded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const [medicine, setMedicine] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState(0);
    const [pickedImage, setPickedImage] = useState(null);

    const [clickedDate, setClickedDate] = useState('');

    const [medicinesList, setMedicinesList] = useState([]);
    const [imageUrls, setImageUrls] = useState({});


    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const handleTimeChange = (event, selected) => {

        if (Platform.OS === 'android') {
            if (event.type === 'set') {
                const selectedDate = new Date(event.nativeEvent.timestamp);
                setSelectedTime(selectedDate);
                calculateTimeDifference(selectedDate);
            }
            setShowTimePicker(false);
        } else {
            const selectedDate = selected || new Date();
            setSelectedTime(selectedDate);
            calculateTimeDifference(selectedDate);
        }
    };

    const calculateTimeDifference = (selected) => {
        const timeDifference = Math.floor((selected.getTime() - Date.now()) / 1000);
        // console.log('Time difference:', timeDifference);
        setTime(timeDifference)

    };
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'notification.wav'
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
            token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    useEffect(() => {
        const getCurrentUserID = () => {
            onAuthStateChanged(FIREBASE_AUTH, (user) => {
                if (user) {
                    setUserID(user.uid);
                } else {
                    console.log('No user is signed in');
                }
                // Set the userLoaded state to true after setting the ID
                setUserLoaded(true);
            });
        };

        getCurrentUserID();
    }, []);

    useEffect(() => {
        // Fetch data only if the user ID is loaded and not empty
        if (userLoaded && userID !== '') {
            fetchMedicines();
        }
    }, [userLoaded, userID]);

    useEffect(() => {
        const fetchImageUrls = async () => {
            const urls = {};
            for (const med of medicinesList) {
                const url = await fetchImageUrl(med.imgURL);
                urls[med.id] = url;
            }
            setImageUrls(urls);
        };

        fetchImageUrls();
    }, [medicinesList]);

    const fetchMedicines = async () => {
        const userMedsCollection = collection(FIREBASE_DB, `users/${userID}/medicines`);
        const snapshot = await getDocs(userMedsCollection);

        const medicines = [];
        snapshot.forEach((doc) => {
            medicines.push({ id: doc.id, ...doc.data() });
        });
        setMedicinesList(medicines);
    };

    const toggleModal = () => {
        console.log(imageUrls, "WAKWKAWWK")
        setModalVisible(!isModalVisible);
    };

    const saveDataToFirebase = async () => {
        const userMedsCollection = collection(FIREBASE_DB, `users/${userID}/medicines`);

        try {
            await addDoc(userMedsCollection, {
                medicine: medicine,
                time: selectedTime,
                date: clickedDate,
                dosage: dosage,
                imgURL: `${medicine}-${clickedDate}-${time}-${userID}`
            });
            console.log('Medicine data added for user ID: ', userID);
        } catch (e) {
            console.error('Error adding medicine data: ', e);
        }


        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
                sound: "notification.wav"
            },
            trigger: {
                seconds: time,
                channelId: 'default',
            },
        });

        setMedicine("");
        setTime(0);
        toggleModal();
        fetchMedicines();
    };

    const deleteMedicine = async (med) => {
        try {
            const docRef = doc(FIREBASE_DB, `users/${userID}/medicines`, med.id);
            await deleteDoc(docRef);
            console.log('Medicine deleted with ID: ', med.id);

            // Delete the image from Firebase Storage
            const desertRef = ref(FIREBASE_STORAGE, med.imgURL);
            deleteObject(desertRef).then(() => {
                console.log("image delete successfuly")
            }).catch((error) => {
                console.log(`Uh-oh, an error occurred! ${error}`)
            });

        } catch (e) {
            console.error('Error deleting medicine or image: ', e);
        }

        fetchMedicines(); // Refresh the medicine list after deleting a medicine
    };


    const handleChooseImage = async (medicineId) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        try {
            const storageRef = ref(
                FIREBASE_STORAGE,
                `${medicineId}-${clickedDate}-${time}-${userID}`
            );

            const response = await fetch(result.uri);
            const blob = await response.blob();

            // Upload image to storage
            await uploadBytes(storageRef, blob);
            console.log('Image uploaded successfully.');

            // Get the download URL of the uploaded image
            // const downloadURL = await getDownloadURL(storageRef);

            const docRef = doc(FIREBASE_DB, `users/${userID}/medicines`, medicineId); // Replace with your collection and document ID
            await updateDoc(docRef, {
                imgURL: `${medicineId}-${clickedDate}-${time}-${userID}`,
            });

            console.log('Document updated with image URL');
        } catch (error) {
            console.error('Error updating document with image URL: ', error);
        }
        fetchMedicines();
    };


    const fetchImageUrl = async (imgURL) => {
        try {
            const storageRef = ref(FIREBASE_STORAGE, imgURL);
            const url = await getDownloadURL(storageRef);
            console.log(url);
            return url;
        } catch (error) {
            console.error('Error fetching image URL: ');
            return null;
        }
    };



    const customMarkedDates = {
        '2023-11-20': { selected: true, selectedColor: 'blue', marked: true },
        '2023-11-24': { customStyles: { backgroundColor: 'red' } },
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Calendar</Text>
            </View>

            <Calendar
                // Configure your calendar here
                // markedDates={customMarkedDates}
                style={styles.calendar}
                onDayPress={(day) => {
                    setClickedDate(day.dateString);
                    toggleModal();
                }}
            />

            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <TouchableOpacity onPress={toggleModal} style={styles.exitContainer}>
                            <Text style={styles.exit}>X</Text>
                        </TouchableOpacity>


                        <Text style={styles.label}>Medicine:</Text>
                        <TextInput
                            style={styles.input}
                            value={medicine}
                            onChangeText={text => setMedicine(text)}
                            placeholder="Enter medicine name"
                        />

                        <Text style={styles.label}>Dosage:</Text>
                        <TextInput
                            style={styles.input}
                            value={dosage}
                            onChangeText={text => setDosage(text)}
                            placeholder="Enter dosage"
                        />

                        <Text style={styles.label}>Time:</Text>
                        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.time}>
                            <Text style={{ flex: 1, textAlignVertical: 'center' }}>
                                {selectedTime.toLocaleTimeString()}
                            </Text>
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                onChange={handleTimeChange}
                            />
                        )}

                        <TouchableOpacity onPress={saveDataToFirebase} style={styles.button}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>

                        <ScrollView>
                            <View>
                                <View style={styles.medicineContainer}>

                                    {medicinesList.map((med, index) => {
                                        if (med.date === clickedDate) {
                                            return (
                                                <View key={med.id} style={styles.medicineItem}>
                                                    <View style={{ flexDirection: 'column', gap: 15 }}>
                                                        <Text>{med.medicine}</Text>
                                                        {/* <Text>{JSON.stringify(med.time, null, 4)}</Text> */}
                                                        <Text>{med.dosage}</Text>
                                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleChooseImage(med.id)}>
                                                            <FontAwesome name="upload" size={20} color="#5F7C8E" />
                                                            <Text style={{ color: '#5F7C8E' }}> Upload Image</Text>
                                                        </TouchableOpacity>
                                                    </View>


                                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                                        <Image
                                                            source={{ uri: imageUrls[med.id] }}
                                                            style={{ width: 100, height: 100, marginRight: 10 }}
                                                        />
                                                        <TouchableOpacity onPress={() => deleteMedicine(med)}>
                                                            <Text style={{ color: 'red' }}>Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>


                                                </View>
                                            );
                                        }
                                    })}

                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* <View>

                <Text>Display Events here</Text>

            </View> */}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
    calendar: {
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        height: 600,
        width: '80%',
    },
    label: {
        marginLeft: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        width: '90%', // Adjust width as needed
        paddingHorizontal: 10,
        borderRadius: 5, // Add border radius for a rounded look
        fontSize: 16, // Adjust font size
        backgroundColor: '#EAEAEA',
        marginTop: 10,
        alignSelf: 'center',
    },
    button: {
        alignSelf: 'center',
        width: '65%',
        backgroundColor: '#5F7C8E',
        borderRadius: 10, // Adding border radius for rounded corners
        padding: 16,
        alignItems: 'center', // Center content horizontally
        marginTop: 15
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exitContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#5F7C8E',
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center the content vertically and horizontally
        width: 30, // Adjust width and height as needed
        height: 30,
    },
    exit: {
        color: 'white',
        // fontWeight: 'bold',
        fontSize: 20,
    },
    medicineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginTop: 10,
        marginHorizontal: 'auto',
        width: '90%',
        borderRadius: 15,
        alignSelf: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#00756A',
        backgroundColor: '#red'
    },
    deleteButton: {
        color: 'red',
    },
    medicineContainer: {
        maxHeight: 310,
        // backgroundColor: 'red',
        marginTop: 20,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF'
    },
    time: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 16,
        marginTop: 10,
        alignSelf: 'center',
    }
});

export default CalendarScreen;
