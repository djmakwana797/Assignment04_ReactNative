import React, { useState } from 'react'
import { View, Text, StyleSheet, ToastAndroid } from 'react-native'
import CustomInput from '../../Components/CustomInput'
import CustomButtom from '../../Components/CustomButton'
import CustomError from '../../Components/CustomError'
import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase(
    {
        name: 'MainDB',
        location: 'default'
    },
    () => { },
    error => { console.log('Error: ', error) }
)

const Login = ({ navigation }) => {

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const [emailError, setemailError] = useState('')
    const [passwordError, setpasswordError] = useState('')

    const userToken = 'logedin'

    const validateEmail = (email) => {
        setemail(email)
        if (email.trim().length > 0) setemailError("")
        else setemailError("Email is required")
    }

    const validatepassword = (pass) => {
        setpassword(pass)
        if (pass.length > 0) setpasswordError("")
        else setpasswordError("Password is required")
    }

    const updateUser = (e) => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE Users SET usertoken=? WHERE email=?",
                [userToken, e],
                (tx, results) => {
                    results.rowsAffected > 0 ? ToastAndroid.show('LogedIn..', ToastAndroid.SHORT) : ToastAndroid.show('Something went wrong..', ToastAndroid.SHORT)
                }
            )
        })
    }

    const loginPressed = () => {
        if (email == '') setemailError('Email is requierd')
        if (password == '') setpasswordError('Password is requierd')
        if (email != '' && password != '') {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM Users WHERE email=? AND password=?",
                    [email, password],
                    (tx, results) => {
                        if (results.rows.length > 0) {
                            updateUser(email)
                            navigation.replace('Todos', { id: results.rows.item(0).id, email: email })
                        }
                        else ToastAndroid.show('Invalid email or password..', ToastAndroid.SHORT)
                    }
                )
            })
        }
    }

    const onRegister = () => {
        navigation.navigate('Register')
        setemail('')
        setpassword('')
        setemailError('')
        setpasswordError('')
    }

    return (
        <View style={styles.container}>
            <CustomInput placeholder={"Enter your email"} value={email} setValue={email => validateEmail(email)} label="Email" />
            {emailError != '' ? <CustomError message={emailError} /> : null}

            <CustomInput placeholder={"Enter your password"} value={password} setValue={pass => validatepassword(pass)} label="Password" secureTextEntry={true} />
            {passwordError != '' ? <CustomError message={passwordError} /> : null}

            <CustomButtom text="LOGIN" onPress={() => loginPressed()} />
            <CustomButtom text="Don't have an account? Register here" type='TERTIARY' onPress={() => onRegister()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    }
})

export default Login
