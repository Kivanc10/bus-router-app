import { StyleSheet, View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons"
import { addVoyages, adminLogout, getStations } from "../utils/interact"
import { useEffect, useState } from 'react';
import { MyText } from "../utils/flatList"
import {StationList} from "../utils/stationList"
import stationData from '../utils/stationsInfo.json';
import { getAllVoyages } from '../utils/getAllVoyages';

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

      <Tab.Screen name="AdminHome" component={AdminHome} />
      <Tab.Screen name="AdminDetail" component={AdminDetail} />
    </Tab.Navigator>

  )
}

function getStationDatas(stations,setStations) {
  getStations().then(data => {
    //window.alert(JSON.stringify(data))
    //window.alert(typeof data)
    let temp = []
    data.map((e) => {
     // window.alert(JSON.stringify(e))
      temp.push(e.name)
    })
    setStations(temp)
    //window.alert(temp)
  }).catch((e) => window.alert(e))
}

function getAllLocations(locations,setLocations) {
  getStations().then(data => {
    let locs = []
    data.map((e) => {
      //let temp = []
      locs.push([e.lat,e.lng])
    })
    setLocations(locs)
  }).catch((e) => window.alert(e))
}

function getAllPassengers(passengers,setPassengers) {
  getStations().then(data => {
    let pass = []
   //window.alert(JSON.stringify(data))
    data.map((e) => {
      pass.push({
        lat : e.lat,
        lng : e.lng,
        passengers : e.passengers
      })
    })
    setPassengers(pass)
  })
}

function AdminHome({ navigation, route }) {
  //const {username} = route.params;
  const [stations, setStations] = useState([])
  const [lat,setLat] = useState(0)
  const [lng,setLng] = useState(0)
  const [locations,setLocations] = useState([])
  const [passengers,setPassengers] = useState([])
  const [passenger,setPassenger] = useState(-1)

  //const [city,setCity] = useState("")
  useEffect(() => {
    if (route.params?.run) {
      //window.alert("ever run var 2")
      getStationDatas(stations,setStations)
    }
    getStationDatas(stations,setStations)
    getAllLocations(locations,setLocations)
    getAllPassengers(passengers,setPassengers)
    if (route.params?.lat && route.params?.lng){
      //window.alert("lat var dude")
      setLat(route.params.lat)
      setLng(route.params.lng)
      //setCity(route.params.name)
      passengers.map((e) => {
        if (e.lat == route.params.lat && e.lng == route.params.lng) {
          //setPassengers(e.passengers)
          //window.alert(e.passengers)
          setPassenger(e.passengers)
          //setPassenger(e.passengers)
         // window.alert(passenger)
        }
      })
    }
    getAllVoyages()
  }, [route.params?.run,route.params?.lat,route.params?.lng])

  if (route.params?.run) {
    //window.alert("ever run var 2 out")
    getStationDatas(stations,setStations)
    navigation.setParams({
      run: false
    })
    navigation.navigate({
      name : "AdminDetail",
      params : {run2 : true},
      merge : true
    })
  }

  return (
    <View style={styles.container}>
      {stations.length > 0 && (
        // <Text>{JSON.stringify(stations)}</Text>
        stations.map((e, i) => (
          <View style={{ flexDirection: "row" }}>
            <StationList key={i} text={e} navigation={navigation} />
          </View>
        ))
      )}
      {passenger!=-1 && lat != 0 && lng != 0 && (
        <Text> lat : {lat} lng : {lng} yolcu: {passenger}</Text>
      )}

      {locations.length > 0 && locations.map((e) => (
        <Text style={{color : "blue"}}>{e[0] + " " + e[1]}</Text>
      ))}
      <Button title='sefer yenile' onPress={() => addVoyages()} />
      <Button title="Logout" onPress={() => adminLogout(navigation)} />
    </View>
  )
}

function AdminDetail({ navigation, route }) {
  const [stations, setStations] = useState([])
  useEffect(() => {
    getStationDatas(stations, setStations)
    if (route.params?.run2) {
      window.alert("detail aktif")
    }
  }, [])

  if (route.params?.run2) {
     window.alert("run2 aktif")
     getStationDatas(stations,setStations)
     navigation.setParams({
       run2 : false
     })
   }
   
  return (
    <View style={styles.container}>
      <Text>Inside detail page</Text>
      {Object.keys(stationData).map((e, i) => (
        stations.includes(e) ? <MyText key={i} navigation={navigation} text={e + "(ekli)"} /> : <MyText key={i} navigation={navigation} text={e} />
      ))}
      <Button
        title='Istasyon ekle'
        onPress={() => {
          navigation.navigate("AdminHome")
        }}
      />
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
