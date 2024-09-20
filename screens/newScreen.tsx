import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Todo {
  _id: string;
  task: string;
  completed: boolean;
  userId: string;
}

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
  const [token, setToken] = useState<string>();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchTokenAndTodos = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        setToken(authToken);
        fetchTodos(authToken);
      } else {
        Alert.alert('Error', 'User not authenticated');
      }
    };

    fetchTokenAndTodos();
  }, []);

  const fetchTodos = async (authToken: string) => {
    try {
      const res = await axios.get('https://todo-app-react-native-backend.vercel.app/todos', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTodos(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load todos');
    }
  };

  const addTodo = async () => {
    if (!newTask) {
      return Alert.alert('Error', 'Please enter a task');
    }

    if (!token) {
      return Alert.alert('Error', 'User not authenticated');
    }

    setLoader(true);

    try {
      const res = await axios.post(
        'https://todo-app-react-native-backend.vercel.app/todos',
        { task: newTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos([...todos, res.data]);
      setNewTask('');
    } catch (err: any) {
      console.error(err.response ? err.response.data : err.message, token);
      Alert.alert('Error', err.response?.data?.message || 'Failed to add todo');
    }

    setLoader(false);
  };

  const editTodo = async (id: string) => {
    if (!editTask) {
      return Alert.alert('Error', 'Please enter a task to edit');
    }

    setLoader(true);

    try {
      const res = await axios.put(
        `https://todo-app-react-native-backend.vercel.app/todos/${id}`,
        { task: editTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
      setEditTask('');
      setCurrentTodoId(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to edit todo');
    }

    setLoader(false);
  };

  const deleteTodo = async (id: string) => {
    setLoader(true);

    try {
      await axios.delete(`https://todo-app-react-native-backend.vercel.app/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete todo');
    }

    setLoader(false);
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    setLoader(true);

    try {
      await axios.put(
        `https://todo-app-react-native-backend.vercel.app/todos/${id}`,
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update todo');
    }

    setLoader(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="New Task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.btn} onPress={addTodo}>
          <View style={styles.btnContent}>
            <Icon name="plus" size={20} color="white" />
            <Text style={styles.btnText}>{loader ? 'Loading...' : 'Add Task'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {currentTodoId && (
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Edit Task"
            value={editTask}
            onChangeText={setEditTask}
          />
          <TouchableOpacity style={styles.btn} onPress={() => editTodo(currentTodoId)}>
            <View style={styles.btnContent}>
              <Icon name="edit" size={20} color="white" />
              <Text style={styles.btnText}>{loader ? 'Loading...' : 'Edit Task'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => toggleComplete(item._id, item.completed)}>
              <Icon
                name={item.completed ? 'check-square' : 'square-o'}
                size={20}
                color={item.completed ? 'green' : 'gray'}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.todoText,
                item.completed ? styles.completedTask : undefined,
              ]}
            >
              {item.task}
            </Text>
            <TouchableOpacity onPress={() => { 
              setEditTask(item.task); 
              setCurrentTodoId(item._id); 
            }}>
              <Icon name="edit" size={20} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item._id)}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  heading: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputBox: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    marginRight: 10,
  },
  btn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    marginLeft: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
  },
  todoText: {
    fontSize: 18,
    color: 'black',
    flex: 1,
    marginLeft: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
