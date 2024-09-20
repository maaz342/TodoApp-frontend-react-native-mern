import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
export default function Login() {
  const [model, setModel] = useState<{ password: string; email: string }>({
    password: '',
    email: ''
  });
  const [loader, setLoader] = useState(false);
  const nav=useNavigation();

  const LoginUser = async () => { 
    setLoader(true);
    try {
      const res = await axios.post("https://todo-app-react-native-backend.vercel.app/auth/login", model);
      await AsyncStorage.setItem('authToken', res.data.token);
      Alert.alert("SuccessFulyy Logged In");
      setLoader(false);
      nav.navigate('new');
    } catch (err: any) {
      Alert.alert("Error", err.message);
      setLoader(false);
    };
  };
  const SignUpUser=()=>{
    nav.navigate('SignUp')
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.mainHeading}>Login</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setModel({ ...model, email: text })}
            value={model.email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => setModel({ ...model, password: text })}
            value={model.password}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={LoginUser}>
          <View style={styles.btnContent}>
            <Icon name="sign-in" size={20} color="white" />
            <Text style={styles.btnText}>{loader ? 'Loading...' : 'Login'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={SignUpUser}>
          <View style={styles.btnContent}>
            <Icon name="user-plus" size={20} color="white" />
            <Text style={styles.btnText}>{loader ? 'Loading...' : 'SignUp'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
  },
  mainHeading: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputBox: {
    paddingVertical: 20,
  },
  input: {
    padding: 10,
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    padding: 20,
    backgroundColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop:10,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    marginLeft: 10,
  },
});
