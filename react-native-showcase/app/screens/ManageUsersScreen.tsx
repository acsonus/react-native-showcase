import { useEffect, useState } from "react";
import User from "../models/User";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
export default function ManageUserScreen() {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {

        const fetchUsers = async () => {
            try {
                console.log('Fetching users');
                fetch(`http://localhost:3000/users`).then((response) => {
                    response.json().then((data) => {
                        setUsers(data);
                    });
                });
            } catch (error) { console.log('Error fetching data', error); }
        }


        fetchUsers();

    }, []);
    function handleDeleteUser(item: User): void {
        console.log('Deleting user', item);
        fetch(`http://localhost:3000/users/${item.id}`, {method: 'DELETE'}).then(() => {
            setUsers(users.filter((user) => user.id !== item.id));
        });
    }

    function handleEditUser(item: User): void {
        console.log('Editing user', item);
        router.push({
            pathname: './UserDetailsScreen',
            //params: { id:item.id, username:item.username, name:item.name, email:item.email,avatar:item.avatar, role:item.role}
            params: {'user':JSON.stringify(item)}
        });
    }

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Manage Users</Text>
            <FlatList style={styles.list}
                data={users}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemText}>{item.email}</Text>
                        <View style={styles.buttonGroup}>
                            <Button title="Edit" onPress={() => handleEditUser(item)} />
                            <Button title="Delete" onPress={() => handleDeleteUser(item)} />
                        </View>
                    </View>
                )}
            />
        </View>

    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        alignItems: 'center',
        fontSize: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});