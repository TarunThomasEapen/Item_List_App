import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-get-random-values'
import { nanoid } from 'nanoid';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const ListScreen = ({ navigation, route }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        if (isMounted) {
          // setItems(items.map(([key, value]) => JSON.parse(value)));
          const parsedItems = items.map(([key, value]) => {
            try {
              return JSON.parse(value);
            } catch {
              return null; // Ignore invalid entries
            }
          }).filter((item) => item && item.id); // Ensure each item is valid and has an ID
          setItems(parsedItems);
        }
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteItem = async (id) => {
    try {
      await AsyncStorage.removeItem(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('AddItem', { item })}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const AddItemScreen = ({ navigation, route }) => {
  console.log('Button pressed');
  const [name, setName] = useState(route.params?.item?.name || '');
  const [description, setDescription] = useState(route.params?.item?.description || '');

  const handleAddOrEditItem = async () => {
    console.log('Button pressed inside');
    const newItem = {
      id: route.params?.item?.id || nanoid(),
      name,
      description,
    };
    console.log('Here');
    try {
      if(newItem.name === '' || newItem.description === '') {
        console.log('Please enter name and description');
        alert('Please enter name and description');
        return;
      }
      console.log('newItem:', newItem);
      // Get all the keys
      const keys = await AsyncStorage.getAllKeys();
      // Get all the items
      const items = await AsyncStorage.multiGet(keys);
      console.log('items:', items);
      await AsyncStorage.setItem(newItem.id, JSON.stringify(newItem));
      navigation.navigate('List');
    } catch (error) {
        console.log('Failed to save the item:', error);
        console.error('Failed to save the item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrEditItem}>
        <Text style={styles.addButtonText}>
          {route.params?.item ? 'Edit Item' : 'Add Item'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="List" component={ListScreen} options={{ title: 'Item List' }} />
      <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Item Details' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
