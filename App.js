import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./src/components/login.component"
import Register from './src/components/register.component';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Home from './src/components/home.component';
import Inside from './src/components/inside.component';
import Admin from "./src/components/admin.component"
import AdminWrapper from './src/components/adminwrapper.component';

const Stack = createNativeStackNavigator();



function IntroPage({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}



function Wrapper({ navigation, route }) {

  useEffect(() => {
    if (route.params?.isLoggedIn) {
      setIsLoggedIn(true)
      // let username = route.params.username;
      // alert(JSON.stringify(route.params.username))
    } else if (!route.params?.isLoggedIn) {
      setIsLoggedIn(false)
    }
    if(route.params?.isAdmin) {
      setIsAdmin(true)
    }else if(!route.params?.isAdmin){
      setIsAdmin(false)
    }
  }, [route.params?.isLoggedIn,route.params?.isAdmin])
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAdmin,setIsAdmin] = useState(false)
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAdmin === true && (
        <Stack.Screen name='AdminWrapper' component={AdminWrapper}/>
      )}
      {isLoggedIn === false && isAdmin === false && (
        <Stack.Screen name="IntroPage" component={IntroPage} />

      )}
      {isLoggedIn == true && isAdmin === false && (
        <Stack.Screen name='Inside' initialParams={{ username: route.params.username }} component={Inside} />
      )}
      
    </Stack.Navigator>

  )
}

export default function App({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // isLoggedIn
  })
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name='Inside' component={Inside} /> */}
        {/* method 2 */}
        <Stack.Screen name='Wrapper' component={Wrapper} />
      </Stack.Navigator>
    </NavigationContainer>
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
