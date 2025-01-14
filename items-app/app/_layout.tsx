import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{headerTitle: 'Task App - Tarun Thomas Eapen',
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}/>;
  // return(
  //   <Stack>
  //     <Stack.Screen name="index"/>
  //     <Stack.Screen name="addItem" options={{ title: 'Item Details' }} />
  //   </Stack>
  // )
}
