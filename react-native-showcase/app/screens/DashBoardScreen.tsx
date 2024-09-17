import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Item from '../models/Item';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data');
        const userId = await AsyncStorage.getItem('userId');
        fetch(`http://localhost:3000/users/${userId}`).then((response) => {
          response.json().then((data) => {
            setUserData(data);
          });
        });

      } catch (error) {
        console.log('Error fetching data', error);
        return null
      }
    }
    fetchUserData();

  }, []);
  useEffect(() => {
    setItems(null);
    const loadItems = async () => {
      const userId = await AsyncStorage.getItem('userId');
      fetch(`http://localhost:3000/items/all`).then((response) => {
        response.json().then((data) => {
          setItems(itemList => data);
        });
      });
    }

    const loadUserOrders = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetching user orders');
      fetch(`http://localhost:3000/items/ordered`).then((response) => {
        response.json().then((data) => {
          setItems(itemList => data);
        });
      });
    }
    if (userData) {
      if (userData.role === 'User') {
        loadItems();
      } else if (userData.role === 'Employee') {
        loadUserOrders();
      }
    }
  }, [userData]);





  const handleAddToCart = (item: Item) => {

    AsyncStorage.getItem('cart').then((data) => {
      const cart = data ? JSON.parse(data) : [];
      const existingItem = cart.find((cartItem: Item) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
      AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log(`Added 1 of ${item.name} to cart`);
    });

    // Add your logic to handle adding items to the cart
  };



  function handleDeliver(item: Item): void {


    fetch(`http://localhost:3000/items/deliver`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) }).then((response) => {
      console.log(`Delivered ${item.id} to user`);
    });
    if (items)
      setItems(items.filter((i) => i.id !== item.id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {userData ? (
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Hello: {userData.name}</Text>
          <Text style={styles.text}>You are: {userData.role}</Text>

          {userData.role === 'User' && (
            <>
              <Link href="./CheckoutScreen"> Checkout </Link>

              <FlatList style={styles.list}
                data={items}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={styles.itemText}>Price: ${item.price.toFixed(2)}</Text>
                    <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />

            </>
          )}
          {userData.role === 'Employee' && (

            <>

              <FlatList style={styles.list}
                data={items}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Button title="Deliver" onPress={() => handleDeliver(item)} />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />

            </>

          )
          }



          {userData.role === 'Administrator' && (
            <>
              <Link href="./ManageItemsScreen"> Manage Items </Link>
              <Link href="./ManageUsersScreen"> Manage Users </Link>
              <FlatList style={styles.list}
                data={items}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={styles.itemText}>Price: ${item.price.toFixed(2)}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </>

          )
          }
        </SafeAreaView>
      ) : (
        <Text style={styles.text}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    height: 200
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
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