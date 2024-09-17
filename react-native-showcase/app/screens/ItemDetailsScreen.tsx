import { useEffect, useState } from "react";
import User from "../models/User";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Item from "../models/Item";

export default function ItemDetailsScreen() {
    const [item, setItem] = useState<Item>({ id: 0, name: '', description: '', price: 0, image: '', category: '' });
    const router = useRouter();
    const params = useLocalSearchParams();
    useEffect(() => {
        setItem(JSON.parse(params.item.toString()));
    }, []);
    const handleSave = () => {
        console.log('Saving item', item);
        fetch(`http://localhost:3000/items/update`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        }).then(() => {
            console.log('Item saved');
            router.navigate('./ManageItemsScreen');
        }).catch((error) => {   console.log('Error saving item', error); });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Item</Text>
            <Text style={styles.itemText}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={item.name}
                onChangeText={(text) => setItem({ ...item, name: text })}
            />
            <Text style={styles.itemText}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={item.description}
                onChangeText={(text) => setItem({ ...item, description: text })}
            />
            <Text style={styles.itemText}>Price</Text>
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={item.price.toString()}
                onChangeText={(text) => setItem({ ...item, price: Number(text) })}
            />
               <TextInput
                style={styles.input}
                placeholder="Category"
                value={item.category.toString()}
                onChangeText={(text) => setItem({ ...item, category:text })}
            />
    
            <Button title="Save" onPress={handleSave} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 16,
        margin: 5,
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
    },
    
});