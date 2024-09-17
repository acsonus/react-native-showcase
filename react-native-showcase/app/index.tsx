import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View>
      <Link href={{ pathname: "/screens/LoginScreen" }}>Login</Link>
      <Link href={{ pathname: "/screens/RegisterScreen" }}>Register</Link>
    </View>
  );
}