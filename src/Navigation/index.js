import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import Register from '../Screens/Register'
import Todos from '../Screens/Todos'
import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase(
    {
        name: 'MainDB',
        location: 'default'
    },
    () => { },
    error => { console.log('Error: ', error) }
)

const Stack = createNativeStackNavigator()

const Navigation = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Todos" component={Todos} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
