import { useEffect, useState } from "react";
import User from "../models/User";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";


export default function EditUserScreen() {
    const [user, setUser] = useState<User>({ id: 0, name: '', email: '', username: '', password: '', avatar: '', role: '' });
    const router = useRouter();
    const params = useLocalSearchParams();
    useEffect(() => {
        setUser(JSON.parse(params.user.toString()));
    }, []);
    const handleSave = () => {
        console.log('Saving user', user);
        fetch(`http://localhost:3000/users/${user.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then(() => {
            router.navigate("./ManageUsersScreen");
        }).catch((error) => { console.log('Error saving user', error); });  
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit User</Text>
            <Text style={styles.itemText}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
            />
            <Text style={styles.itemText}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
            />
            <Text style={styles.itemText}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={user.username}
                onChangeText={(text) => setUser({ ...user, username: text })}
            />
            <Text style={styles.itemText}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={user.password}
                onChangeText={(text) => setUser({ ...user, password: text })}
            />
            <Picker
                selectedValue={user.role}
                style={styles.input}
                onValueChange={(text) => setUser({ ...user, role: text })}
            >
                <Picker.Item label="Administrator" value="Administrator" />
                <Picker.Item label="User" value="User" />
                <Picker.Item label="Employee" value="Employee" />
            </Picker>
            <Button title="Save" onPress={handleSave} />
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
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
});