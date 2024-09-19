import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import newScreen from './screens/newScreen';
import SignUp from './screens/SignUp';
import Login from './screens/login';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="new" component={newScreen} />
          <Stack.Screen name="login" component={Login} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
