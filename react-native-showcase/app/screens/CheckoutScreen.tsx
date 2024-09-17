import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Position } from '../models/Position';
import { router } from 'expo-router';


export default function CheckoutScreen() {
    const [positions, setPositions] = useState<Position[]>([]);


    useEffect(() => {
        const loadItems = async () => {
            // Fetch items from your backend or database
            AsyncStorage.getItem('cart').then((data) => {
                if (data) {
                    let poss = JSON.parse(data) as Position[];
                    setPositions(poss);
                } else {
                    setPositions([]);
                }
            });
        };

        loadItems();
    }, []);

    const handleQuantityChange = (id: number, quantity: string) => {
        if (quantity === '') {
            quantity = '0';
        }
        const newPositions = positions.map((position) => {
            if (position.id === id) {
                position.quantity = parseInt(quantity, 10);
            }
            return position;
        });
        setPositions(newPositions);
    };

    const handleCheckout = async () => {

        const userId = await AsyncStorage.getItem('userId');
        fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, positions }),
        }).then(response => response.json())
            .then(data => {
                console.log('Success Order Sent:Your order has been successfully sent.');
                
            })
            .catch((error) => {
                console.error('Error:', error);

            }).then(() => { setPositions([]); AsyncStorage.setItem('cart', JSON.stringify([])); router.navigate('./DashBoardScreen'); }); 
        // Add your logic to handle the checkout process
    };

    const calculateTotalPrice = (position: Position) => {
        return (position.price * position.quantity).toFixed(2);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <FlatList
                data={positions}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemText}>Price: ${item.price.toFixed(2)}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            keyboardType="numeric"
                            value={item.quantity.toString()}
                            onChangeText={(text) => handleQuantityChange(item.id, text)}
                        />
                        <Text style={styles.itemText}>Total: ${calculateTotalPrice(item)}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <Button title="Checkout" onPress={handleCheckout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 8,
        paddingHorizontal: 8,
        width: 60,
    },
});