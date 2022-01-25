import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native'
import CustomInput from '../../Components/CustomInput'
import CustomButton from '../../Components/CustomButton'
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

const Register = ({navigation}) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const userToken = 'false'

    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordReapeatError, setPasswordReapeatError] = useState('')

    useEffect(() => {
        createTable()
    }, [])

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Users"
                + "(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, email TEXT, password TEXT, usertoken TEXT);"
            )
        })
    }

    const addUser = () => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO Users (name, email, password, usertoken) VALUES (?,?,?,?)",
                [username, email, password, userToken],
                (tx, results) => {
                    console.log(results)
                    results.rowsAffected > 0 ? ToastAndroid.show('Registered Successfully', ToastAndroid.SHORT) : console.log('Something went wrong')
                }
            )
        })
    }

    const onRegisterPressed = () => {
        if(username=='') setUsernameError('Username is required') 
        if(email=='') setEmailError('Email is required') 
        if(password=='') setPasswordError('Password is required')
        if(passwordRepeat=='') setPasswordReapeatError('Password confirmation required')
        if(username!="" && email!="" && password!="" && passwordRepeat!=""){
            addUser()
            navigation.navigate('Login')
        }
    }

    const onLoginPressed = () => {
        navigation.navigate('Login')
    }

    const validateUname = (uname) =>{
        setUsername(uname)
        if(uname.trim().length <= 4) setUsernameError("Username must be 4 character long")
        else setUsernameError("")
    }
    const validateEmail = (email) =>{
        setEmail(email)
        const emailRegex = /\S+@\S+\.\S+/
        if(emailRegex.test(email)) setEmailError("")
        else setEmailError("Please enter valid email id")
    }
    const validatePassword = (pass) =>{
        setPassword(pass)
        if(pass.length < 6 ) setPasswordError("Password must be 6 character long")
        else setPasswordError("")
    } 
    const validadeRepeatPassword = (rpass) =>{
        setPasswordRepeat(rpass)
        if(rpass==password) setPasswordReapeatError("")
        else setPasswordReapeatError("Password did not match")
    } 

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Create an account</Text>
            <CustomInput placeholder="Username" value={username} setValue={(uname)=>validateUname(uname)} label="Username"/>
            {usernameError!=''? <CustomError message={usernameError}/> : <></> }

            <CustomInput placeholder="Email" value={email} setValue={(email)=>validateEmail(email)} label="Email"/>
            {emailError!=''? <CustomError message={emailError}/>:<></>}

            <CustomInput placeholder="Password" value={password} setValue={(pass)=>validatePassword(pass)} secureTextEntry={true} label="Password"/>
            {passwordError!=''? <CustomError message={passwordError}/>:<></>}

            <CustomInput placeholder="Repeat Password" value={passwordRepeat} setValue={(rpass)=>validadeRepeatPassword(rpass)} secureTextEntry={true} label="Repeat password"/>
            {passwordReapeatError!=''? <CustomError message={passwordReapeatError}/>:<></>}

            <CustomButton text="Register" onPress={onRegisterPressed}/>

            <CustomButton text="Have an account? Login" onPress={onLoginPressed} type="TERTIARY"/>
        </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 20
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color: '#051c60',
        margin: 10,
        alignSelf: 'center'
    },
})

export default Register
