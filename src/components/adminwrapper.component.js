import { StyleSheet, View, Text ,Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons  from "@expo/vector-icons/Ionicons"
import {adminLogout} from "../utils/interact"



const Tab = createBottomTabNavigator();

export default function AdminWrapper({ navigation, route }) {  
   // alert("Inside username --> " + username)
    return (       
             <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'AdminHome') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'AdminDetail') {
              iconName = focused ? 'ios-albums' : 'ios-albums-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
          
                <Tab.Screen name="AdminHome"  component={AdminHome} />
                <Tab.Screen name="AdminDetail" component={AdminDetail} />
            </Tab.Navigator>
       
    )
}


function AdminHome({ navigation,route }) {
    //const {username} = route.params;
  
    return (
        <View style={styles.container}>
            <Text>Inside Home page </Text>
            <Button title="Logout" onPress = {() => adminLogout(navigation)} />
        </View>
    )
}

function AdminDetail({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Inside detail page</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  