import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const newScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>newScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default newScreen;
