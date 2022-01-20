import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const CustomError = ({message}) => {
    return (
        <View style={styles.root} animation="fadeInLeft" duration={500}>
            <Text style={styles.text}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        alignContent: 'flex-start' 
    },
    text:{
        color : '#ff3333',
        marginBottom: 6,
    }
})

export default CustomError
