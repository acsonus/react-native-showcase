import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import Item from '../models/Item';

export default function ManageItemsScreen() {
    const [items, setItems] = useState<Item[]>([]);
    useEffect(() => {
        fetchItems();
    },[]);

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );
    const fetchItems = async () => {
        try {
            console.log('Fetching items');
            fetch(`http://localhost:3000/items/all`).then((response) => {
                response.json().then((data) => {
                    setItems(data);
                });
            });
        } catch (error) { console.log('Error fetching data', error); }
    }
    function handleDeleteItem(item: Item): void {
        console.log('Deleting item', item);
        fetch(`http://localhost:3000/items/delete/${item.id}`, { method: 'DELETE' }).then(() => {
            setItems(items.filter((item) => item.id !== item.id));
        });
    }
    function handleEditItem(item: Item): void {
        console.log('Editing item', item);
        router.push({
            pathname: './ItemDetailsScreen',
            params: { 
                'item': JSON.stringify(item)
            }
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Items</Text>
            <FlatList style={styles.list}
                data={items}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name + " " + item.description + " " + item.price + "$"}</Text>
                        <View style={styles.buttonGroup}>
                            <Button title="Edit" onPress={() => handleEditItem(item)} />
                            <Button title="Delete" onPress={() => handleDeleteItem(item)} />
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
        backgroundColor: '#fff',
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
    },
    itemText: {
        fontSize: 16,
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});