import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LoginScreen() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),

    }).then((response) => {
      console.log(response);
      if (response.status === 404) {
        console.log('Invalid credentials');
        return;
      } else {
        response.json().then((data) => {
          console.log(data);
          AsyncStorage.setItem('userId', data.id.toString());
          router.navigate('./DashBoardScreen');
        });

      }

    }).catch((error) => { console.log('Error logging in', error); });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
