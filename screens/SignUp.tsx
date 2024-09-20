import axios from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SignUp() {
  const [model, setModel] = useState<{ password: string; name: string;  email: string }>({
    password: '',
    name: '',
    email: '',
  });
  const [loader, setLoader] = useState(false);

  const nav=useNavigation();
  const SignUpUser = async() => {
    try {
      const res =    await axios.post("https://todo-app-react-native-backend.vercel.app/auth/register", model)
       await AsyncStorage.setItem('authToken', res.data.token);
       Alert.alert("SuccessFulyy Registered");
       setLoader(false);
      nav.navigate('new');
    } 
      catch(err:any){
        Alert.alert("Error", err.message);
        setLoader(false);
      };
  };
  const LoginUser=()=>{
    nav.navigate('login')
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.mainHeading}>SignUp</Text>
        <View style={styles.inputBox}>
        <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => setModel({ ...model, name: text })}
            value={model.name}
          />
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
        <TouchableOpacity style={styles.btn} onPress={SignUpUser}>
          <View style={styles.btnContent}>
            <Icon name="user-plus" size={20} color="white" />
            <Text style={styles.btnText}>{loader ? 'Loading...' : 'SignUp'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={LoginUser}>
          <View style={styles.btnContent}>
            <Icon name="sign-in" size={20} color="white" />
            <Text style={styles.btnText}>{loader ? 'Loading...' : 'Login'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
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
