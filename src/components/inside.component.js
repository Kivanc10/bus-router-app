import { StyleSheet, View, Text ,Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons  from "@expo/vector-icons/Ionicons"



const Tab = createBottomTabNavigator();

export default function Inside({ navigation, route }) {
    const {username} = route.params;
   // alert("Inside username --> " + username)
    return (       
             <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Detail') {
              iconName = focused ? 'ios-albums' : 'ios-albums-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
          
                <Tab.Screen name="Home" initialParams={{username : username}}  component={InsideHome} />
                <Tab.Screen name="Detail" component={InsideDetail} />
            </Tab.Navigator>
       
    )
}

function InsideHome({ navigation,route }) {
    const {username} = route.params;
  
    return (
        <View style={styles.container}>
            <Text>Inside Home page  {username} </Text>
            <Button title="Logout" onPress = {() => {
                navigation.navigate({
                    name : "Wrapper",
                    params : {isLoggedIn : false},
                    merge : true
                })
            }} />
        </View>
    )
}

function InsideDetail({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Inside detail page</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})