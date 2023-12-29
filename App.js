import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TermsAndConditionsScreen from './screens/TermsAndConditionScreen';
import LoginScreen from './screens/LoginScreen';
import BottomTabNavigator from './screens/BottomNavigator';
import RegisterScreen from './screens/RegisterScreen';
import MedicationStatusScreen from './screens/MedicationStatusScreen'
import ProfileScreen from './screens/ProfileScreen'
import ListScreen from './screens/ListScreen'


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'TermsAndConditions'}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditionsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MedicationStatus"
          component={MedicationStatusScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Symptoms"
          component={ListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
