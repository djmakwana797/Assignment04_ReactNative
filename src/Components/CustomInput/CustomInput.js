import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, multiline, number, label }) => {
    return (
        <>
            <View style={styles.label}>
                <Text>{label}</Text>
            </View>
            <View style={styles.container}>
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    numberOfLines={number}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',

        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 10,
        marginVertical: 10,
    },
    label: {
        marginHorizontal: 5
    }
})

export default CustomInput
