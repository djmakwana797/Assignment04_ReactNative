import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

const CustomButton = ({onPress, text, type="PRIMARY"}) => {
    return (
        <Pressable 
            style={[styles.container, styles[`container_${type}`]]} 
            onPress={onPress}> 
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{

        width: '100%',

        padding: 12,
        marginVertical: 5,

        alignItems: 'center',
        borderRadius: 5,
    },

    container_PRIMARY: {
        backgroundColor: '#3871f3',
    },

    container_TERTIARY: {
    },

    text:{
        fontSize: 15,
        color: 'white',
        fontWeight:'bold',
    },

    text_TERTIARY:{
        color: 'gray'
    }
})

export default CustomButton
