import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    // Add registration logic here
    const userData = {
      username,
      password,
      name,
      email,
      role,
    };
    try {
      // await AsyncStorage.setItem('userData', JSON.stringify(userData));
      // console.log('Registration data saved locally');
      fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      // navigate to login screen
      
      router.navigate("./LoginScreen");
    } catch (error) {
      console.log('Error saving data', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />


      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Administrator" value="Administrator" />
        <Picker.Item label="User" value="User" />
        <Picker.Item label="Employee" value="Employee" />
      </Picker>
      <Button title="Register" onPress={handleRegister} />
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