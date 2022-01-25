import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Modal, ScrollView, TextInput, Pressable, disableYellowBox } from 'react-native'
import ActionButton from 'react-native-action-button'
import SelectDropdown from 'react-native-select-dropdown'
import DatePicker from 'react-native-date-picker'
import SQLite from 'react-native-sqlite-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

console.disableYellowBox = true;

const db = SQLite.openDatabase(
    {
        name: 'MainDB',
        location: 'default'
    },
    () => { },
    error => { console.log('Error: ', error) }
)

const Todos = ({ navigation, route }) => {

    const [modal, setModal] = useState(false)
    const [startdate, setstartDate] = useState(new Date())
    const [duedate, setdueDate] = useState(new Date())

    const [strstartdate, setstrstartdate] = useState('')
    const [strduedate, setstrduedate] = useState('')

    const [startopen, setstartOpen] = useState(false)
    const [dueopen, setdueOpen] = useState(false)
    const [title, settitle] = useState('')
    const [desc, setdesc] = useState('')
    const [todos, settodos] = useState([])
    const [todosId, settodosId] = useState(null)
    const [isTodosAdded, setisTodosAdded] = useState('')

    const [users, setusers] = useState([])

    const [activeUserID, setactiveUserID] = useState(0)
    const [activeUser, setactiveUser] = useState('Select User')

    useEffect(() => {
        createTable()
        getTodos()
        getUsers()
    }, [activeUserID, activeUser])

    const getUsers = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM  Users WHERE usertoken=?",
                ['logedin'],
                (tx, results) => {
                    if (results.rows.length != 0) {
                        var temp = []
                        for (let i = 0; i < results.rows.length; ++i)
                            temp.push(results.rows.item(i)['email'])
                        setusers(temp)
                    }
                    else setisTodosAdded('Please Select user Or Add new user')
                }
            )
        })
    }

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Todos"
                + "(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT, desc TEXT, start TEXT, due TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP, updated TEXT, status TEXT,user_id INTEGER );"
            )
        })
    }

    const addTodo = () => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO Todos (title, desc, start, due, updated, status, user_id) VALUES (?,?,?,?,?,?,?)",
                [title, desc, strstartdate, strduedate, t, 'false', activeUserID],
                (tx, results) => {
                    results.rowsAffected > 0 ? console.log('Saved') : console.log('Something went wrong')
                }
            )
        })
        getTodos()
    }

    const getTodos = () => {
        if(activeUserID==0) setisTodosAdded('Please select user or Add new user')
        else {db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Todos WHERE user_id=?',
                [activeUserID],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        var temp = []
                        for (let i = 0; i < results.rows.length; ++i)
                            temp.push(results.rows.item(i))
                        settodos(temp)
                        setisTodosAdded('')
                    }
                    else {
                        setisTodosAdded('There are no items in todo list')
                        settodos([])
                    }
                }
            )
        })}
    }

    const setTodoStatusTrue = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE Todos SET status=?, updated=? WHERE id=?",
                ['true', t, id],
                (tx, results) => {
                    results.rowsAffected > 0 ? console.log('Updated to true') : console.log('Something went wrong')
                }
            )
        })
        getTodos()
    }

    const setTodoStatusFalse = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE Todos SET status=?, updated=? WHERE id=?",
                ['false', t, id],
                (tx, results) => {
                    results.rowsAffected > 0 ? console.log('Updated to false') : console.log('Something went wrong')
                }
            )
        })
        getTodos()
    }

    const updateTodo = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE Todos SET title=?, desc=?, start=?, due=?, updated=? WHERE id=?",
                [title, desc, strstartdate, strduedate, t, id],
                (tx, results) => {
                    results.rowsAffected > 0 ? console.log('Updated todo') : console.log('Something went wrong')
                }
            )
        })
        getTodos()
    }

    const deleteTodo = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM Todos WHERE id=?",
                [id],
                (tx, results) => {
                    results.rowsAffected > 0 ? console.log('Deleted') : console.log('Something went wrong')
                }
            )
        })
        getTodos()
    }

    const onSave = (id = 0) => {
        if (id != 0) updateTodo(id)
        else addTodo()
        setModal(false)
    }

    const addItem = (id = 0) => {
        var result = todos.find(todo => {
            return todo.id === id
        })
        if (id != 0) {
            settodosId(result.id)
            settitle(result.title)
            setdesc(result.desc)
            setstrstartdate(result.start)
            setstrduedate(result.due)
        }
        else {
            settodosId('')
            settitle('')
            setdesc('')
            setstrstartdate('')
            setstrduedate('')
        }
        setModal(true)
    }

    const updateUser = (selectedUser) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM  Users WHERE email=?",
                [selectedUser],
                (tx, results) => {
                    setactiveUserID(results.rows.item(0).id)
                }
            )
        })
        setactiveUser(selectedUser)
        console.log(activeUser)
        getTodos()
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const day = days[today.getDay()]

    const t = dd + '/' + mm + '/' + yyyy

    const renderTodos = ({ item }) => (
        <View style={styles.todo}>
            <Pressable onPress={() => addItem(item.id)}>
                <View style={styles.todoDetails}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.itemDate}>Start : {item.start}</Text>
                        <Text style={styles.itemDate}>  Due : {item.due}</Text>
                    </View>
                </View>
            </Pressable>
            <View style={styles.todoBtns}>
                {item.status == "true" ? <Pressable onPress={() => setTodoStatusFalse(item.id)} style={styles.todobtn}><MaterialCommunityIcons name="checkbox-marked-circle-outline" color='#000' size={26} /></Pressable> : <Pressable onPress={() => setTodoStatusTrue(item.id)} style={styles.todobtn}><MaterialCommunityIcons name="checkbox-blank-circle-outline" color='#000' size={26} /></Pressable>}
                <Pressable onPress={() => deleteTodo(item.id)} style={styles.todobtn}>
                    <MaterialCommunityIcons name="delete-forever" color='#000' size={28} />
                </Pressable>
            </View>
        </View >

    )

    return (
        <View style={styles.container}>
            <View style={styles.daybg}>
                <View style={styles.user}>
                    <SelectDropdown
                        data={users}
                        defaultButtonText={activeUser}
                        onSelect={(selectedItem, index) => {
                            updateUser(selectedItem)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                        buttonStyle={styles.userbtn}
                        buttonTextStyle={styles.userbtntext}
                        rowStyle={styles.userbtnrow}
                        rowTextStyle={styles.userbtntextrow}
                    />
                </View>
                <Text style={styles.day}>{day}</Text>
                <Text style={styles.date}>{t}</Text>
            </View>
            {isTodosAdded == '' ? (
                <FlatList
                    data={todos}
                    renderItem={item => renderTodos(item)}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.message}>
                    <Text style={styles.messageTxt}>{isTodosAdded}</Text>
                </View>
            )
            }
            {/* <ActionButton
                buttonColor="#3871f3"
                onPress={() => addItem()}
                buttonText="+"
            /> */}
            <ActionButton buttonColor="#3871f3">
                <ActionButton.Item buttonColor='#C59026' title="New Task" onPress={() => addItem()}>
                    <MaterialCommunityIcons name="clipboard-plus" size={22} color="#fff" />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#C59026' title="New User" onPress={() => navigation.navigate('Register')}>
                    <MaterialCommunityIcons name="account-plus" size={22} color="#fff" />
                </ActionButton.Item>
            </ActionButton>

            <DatePicker
                modal
                title='Set start date'
                open={startopen}
                date={startdate}
                onConfirm={(date) => {
                    setstartOpen(false)
                    setstartDate(date)
                    setstrstartdate(String(startdate.getDate()).padStart(2, '0') + '/' + String(startdate.getMonth() + 1).padStart(2, '0') + '/' + startdate.getFullYear())
                }}
                onCancel={() => {
                    setstartOpen(false)
                }}
                minimumDate={new Date("2022-01-01")}
            />
            <DatePicker
                modal
                title='Set due date'
                open={dueopen}
                date={duedate}
                onConfirm={(date) => {
                    setdueOpen(false)
                    setstrduedate(String(duedate.getDate()).padStart(2, '0') + '/' + String(duedate.getMonth() + 1).padStart(2, '0') + '/' + duedate.getFullYear())
                    setdueDate(date)
                }}
                onCancel={() => {
                    setdueOpen(false)
                }}
                minimumDate={new Date("2022-01-01")}
            />

            <Modal
                visible={modal}
                onRequestClose={() => {
                    setModal(false)
                }}>
                <ScrollView style={styles.modalContainer}>
                    <TextInput placeholder='Input Title' style={styles.inputTitle} value={title} onChangeText={settitle} />
                    <TextInput placeholder='Input description' style={styles.inputDesc} multiline={true} value={desc} onChangeText={setdesc} />
                </ScrollView>
                <View style={styles.btn}>
                    <Pressable onPress={() => setstartOpen(true)}><Text style={styles.btnTxt}>Start {strstartdate}</Text></Pressable>
                    <Pressable onPress={() => setdueOpen(true)}><Text style={styles.btnTxt}>Due {strduedate}</Text></Pressable>
                    <Pressable onPress={() => onSave(todosId)}><Text style={styles.btnTxt}>Save</Text></Pressable>
                </View>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    daybg: {
        backgroundColor: '#3871f3',
        height: '20%',
    },
    userbtn: {
        backgroundColor: '#3871f3',
        alignSelf: 'flex-end'
    },
    userbtntext: {
        color: '#ffffff'
    },
    userbtnrow: {
        backgroundColor: '#ffffff',
        alignSelf: 'flex-end'
    },
    userbtntextrow: {
        color: '#3871f3'
    },
    day: {
        color: '#ffffff',
        fontSize: 30,
        marginHorizontal: 30
    },
    date: {
        color: '#ffffff',
        fontSize: 20,
        marginHorizontal: 30
    },
    todo: {
        justifyContent: 'space-between',
        marginVertical: 6,
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderRadius: 10
    },
    itemTitle: {
        fontSize: 20,
        paddingBottom: 4
    },
    itemDate: {
        fontSize: 16
    },
    todoDetails: { flexDirection: 'column', width: 270 },
    list: { marginVertical: 8 },
    todobtn: { marginVertical: 10, paddingHorizontal: 5 },
    todoBtns: { flexDirection: 'row' },
    modalContainer: {
        flex: 1,
        padding: 20
    },
    inputTitle: {
        fontSize: 26,
        fontWeight: '500'
    },
    inputDesc: {
        fontSize: 16,
        marginBottom: 20
    },
    btn: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10 },
    btnTxt: { color: 'black', fontWeight: '600', fontSize: 16 },
    user: { flexDirection: 'row', justifyContent: 'flex-end' },
    message: { justifyContent: 'center', alignItems: 'center', flex: 1 },
    messageTxt: { fontSize: 25 },
});

export default Todos