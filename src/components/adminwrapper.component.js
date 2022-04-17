import { StyleSheet, View, Text, Button, TextInput,ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons"
import { addVoyages, adminLogout, getStations, updateNumberOfPassengersOfStation, getVoyages } from "../utils/interact"
import { useEffect, useState } from 'react';
import { MyText } from "../utils/flatList"
import { StationList } from "../utils/stationList"
import stationData from '../utils/stationsInfo.json';
import { getAllVoyages } from '../utils/getAllVoyages';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { addStation } from "../utils/interact"
import { calculateDistanceMatrix } from "../utils/calculateDistanceMatrix"
import MapView, { Marker,Polyline } from 'react-native-maps';
import {findShortestPaths} from "../utils/warshall_floyd_alg"
import {Picker} from '@react-native-picker/picker';
import MapViewDirections from 'react-native-maps-directions';
import envFile from "../utils/env.json"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function GoStationPage({ navigation, route }) {
  useEffect(() => {
    //window.alert(typeof lat)
  })
  const { stationName, lat, lng, otherNavigation } = route.params;
  const [value, setValue] = useState("")
  return (
    <View style={{ flex: 1, padding: 30 }}>
      <Text style={{
        color: "red",
        fontSize: 25
      }}>İstasyon ({stationName})</Text>

      <View style={{
        paddingTop: 50
      }}>

        <Text style={{
          fontSize: 18,
          color: "blue"
        }}>Yolcu sayısı</Text>
        <TextInput style={{
          padding: 15,
          borderWidth: 1,
          marginBottom: 15
        }} onChangeText={(newText) => setValue(newText)} placeholder="Numara girin" />
        <Button title='Kaydet' onPress={() => addStation(stationName, lat, lng, parseInt(value), otherNavigation)} />

      </View>

    </View>
  )
}

function AddedStationPage({ navigation, route }) {
  const { stationName, otherNavigation } = route.params;
  const [value, setValue] = useState("")
  return (
    <View style={{ flex: 1, padding: 30 }}>
      <Text style={{
        color: "red",
        fontSize: 25
      }}>İstasyon ({stationName})(ekli) </Text>

      <View style={{
        paddingTop: 50
      }}>

        <Text style={{
          fontSize: 18,
          color: "blue"
        }}>Yolcu sayısı güncelle</Text>
        <TextInput style={{
          padding: 15,
          borderWidth: 1,
          marginBottom: 15
        }} onChangeText={(newText) => setValue(newText)} placeholder="Numara girin" />
        <Button title='Kaydet' onPress={() => updateNumberOfPassengersOfStation(stationName, parseInt(value), otherNavigation)} />

      </View>

    </View>
  )
}

export default function AdminWrapper({ navigation }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminComponent} />
      <Stack.Screen name="GoStationPage" component={GoStationPage} />
      <Stack.Screen name="AddedStationPage" component={AddedStationPage} />

    </Stack.Navigator>
  )
}
function AdminComponent({ navigation, route }) {
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
          } else if (route.name === "UserInfo") {
            iconName = focused ? 'person-outline' : 'people';
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
      <Tab.Screen name="UserInfo" component={UserInfo} />
    </Tab.Navigator>

  )
}

function getStationDatas(stations, setStations) {
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

function getStationLocs(locs,setLocs) {
  let arr = []
  getStations().then(data => {
    data.map((e) => {
      let t= {}
      t["name"] = e.name
      t["lat"] = e.lat
      t["lng"] = e.lng
      t["passengers"] = e.passengers
      arr.push(t)
    })
    setLocs(arr)
  })
}

function getAllLocations(locations, setLocations) {
  getStations().then(data => {
    let locs = []
    data.map((e) => {
      //let temp = []
      locs.push([e.lat, e.lng])
    })
    setLocations(locs)
  }).catch((e) => window.alert(e))
}

function getAllPassengers(passengers, setPassengers) {
  getStations().then(data => {
    let pass = []
    //window.alert(JSON.stringify(data))
    data.map((e) => {
      pass.push({
        lat: e.lat,
        lng: e.lng,
        passengers: e.passengers
      })
    })
    setPassengers(pass)
  })
}

function getVoyages_(voyageData, setVoyageData) {
  getVoyages().then(data => {
    //window.alert(JSON.stringify(data))
    setVoyageData(data)
  })
}



function UserInfo({ navigation }) {
  return (
    <View style={{

    }}>
      <Button title="Logout" onPress={() => adminLogout(navigation)} />
    </View>
  )
}



function AdminHome({ navigation, route }) {
  //const {username} = route.params;
  const [stations, setStations] = useState([])
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [locations, setLocations] = useState([])
  const [passengers, setPassengers] = useState([])
  const [passenger, setPassenger] = useState(-1)
  const [voyageData, setVoyageData] = useState([])
  const [locs,setLocs] = useState([])
  const [selectedCity,setSelectedCity] = useState("")
  const [destinationCity,setDestinationCity] = useState("")
  const [distanceMtrx,setDistanceMtrx] = useState([])
  const [distanceMtrxKeys,setDistanceMtrxKeys] = useState([])
  const [currentRoute,setCurrentRoute] = useState([
    {
      lat : 0,
      lng : 0
    }
  ])
  const [totalPassengers,setTotalPassengers] = useState(0)
  //const [city,setCity] = useState("")
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.02,
  })
  const [mapRegion, setmapRegion] = useState({
    latitude: 40.766666,
    longitude: 29.916668,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (route.params?.run) {
      //window.alert("ever run var 2")
      getStationDatas(stations, setStations)
    }
    getStationDatas(stations, setStations)
    getAllLocations(locations, setLocations)
    getAllPassengers(passengers, setPassengers)
    if (route.params?.lat && route.params?.lng) {
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
    getVoyages_(voyageData, setVoyageData)
    //window.alert(voyageData.length)
    getStationLocs(locs,setLocs)
    //window.alert(JSON.stringify(locs))
    let distanceMatrix = Object.values(calculateDistanceMatrix(voyageData,stations))
    setDistanceMtrx(distanceMatrix)
    setDistanceMtrxKeys(Object.keys(calculateDistanceMatrix(voyageData,stations)))
    //window.alert(distanceMtrxKeys)
    //window.alert(findShortestPaths(distanceMatrix,2,0)) // --
    // if (stationData.length !== distanceMatrix.length){
    //   calculateDistanceMatrix(voyageData,stationData)
    // }
    // window.alert(`API KEY -_> ` + JSON.stringify(envFile["maps-api-key"]))
    //window.alert(JSON.stringify(x))
  }, [route.params?.run, route.params?.lat, route.params?.lng])

  if (route.params?.run) {
    //window.alert("ever run var 2 out")
    getStationDatas(stations, setStations)
    navigation.setParams({
      run: false
    })
    navigation.navigate({
      name: "AdminDetail",
      params: { run2: true },
      merge: true
    })
  }

  return (
    <View style={styles.container2}>
      <MapView
        style={{ height: "75%", width: "100%" }}
        //onRegionChange = {region => setRegion(region)}
        initialRegion={{
          latitude: 40.766666,
          longitude: 29.916668,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {/* <Marker coordinate={mapRegion} title="Marker" /> */}
        {locs.length > 0 && locs.map((e, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: e.lat, 
              longitude: e.lng, 
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            title={e.name + " istasyonu"}
            description={e.passengers + " yolcu var"}
          />
        ))}
        {currentRoute.length > 1 && (
          <MapViewDirections 
          origin={currentRoute[0].coordinates}
          waypoints = {currentRoute.length > 2 ? currentRoute.slice(1,-1).map((e) => e.coordinates) : undefined}
          destination = {currentRoute[currentRoute.length-1].coordinates}
          apikey = {envFile["maps-api-key"]}
          strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onError = {(err) => {
              window.alert("an error occured dude")
            }}
          />
          
        )}
      </MapView>
    <ScrollView>
    <Button title='sefer yenile' onPress={() => addVoyages()} />
      <View style={{padding : 5}}>
      <Button title='Şehir yenile' onPress={() => {
        setDistanceMtrxKeys(Object.keys(calculateDistanceMatrix(voyageData,stations)))
      }} />
      </View>
      <View style={{
        padding : 25
      }}>
        {/* <Button title='Matris getir' onPress={() => window.alert(JSON.stringify(calculateDistanceMatrix(voyageData,stations)))} /> */}
        <View style={{padding : 10,flexDirection : "row"}}>
          <View style={{flexGrow : 3}}>
            <Text style={{fontWeight : "bold",color : "red"}}>Başlangıç</Text>
          <Picker
          selectedValue={selectedCity}          
           onValueChange={(itemValue, itemIndex) => {
            setSelectedCity(itemValue)
                        
           }}>
            {distanceMtrxKeys.map((e) => (
              <Picker.Item label={e} value={e} />
            ))}
          </Picker>
          </View>
          <View style={{flexGrow : 3}}>
          <Text style={{fontWeight : "bold",color : "red"}}>Varış</Text>
            <Picker
            selectedValue={destinationCity}
            onValueChange={(itemValue,itemIndex) => {
              setDestinationCity(itemValue)
            }}
            >
            {distanceMtrxKeys.map((e) => (
              <Picker.Item label={e} value={e} />
            ))}
            </Picker>
          </View>          
        </View>
        <View style={{flexDirection : "row"}}>
        <View style={{flexGrow : 3,marginRight : 2}}>
            <Button title='Rota bul' onPress={() => {
              if (selectedCity !== "" && destinationCity !== "") {
                let fromIndex = distanceMtrxKeys.indexOf(selectedCity)
                let destinationIndex = distanceMtrxKeys.indexOf(destinationCity)
                let path = findShortestPaths(distanceMtrx,fromIndex,destinationIndex)
                //window.alert(`from -> ${selectedCity} , to -> ${destinationCity} , path -> ${JSON.stringify(path)}}`)
                //window.alert(JSON.stringify(path))
               // window.alert(JSON.stringify(distanceMtrxKeys))
               let routes = []
                 path.forEach((e) => {
                   let tempCity = distanceMtrxKeys[e]
                    // window.alert(tempCity)
                     locs.forEach((e_) => {
                       if (e_.name === tempCity) {
                         //window.alert(JSON.stringify(e_))
                         routes.push({
                           coordinates : {                        
                             latitude: e_.lat, 
                             longitude: e_.lng, 
                             latitudeDelta: 0.0922,
                             longitudeDelta: 0.0421
                           },
                           name : e_.name,
                           passengers : e_.passengers
                         })
                       }
                     })
                   })
                  //  window.alert("founded --> " + JSON.stringify(routes))
                   setCurrentRoute(routes)
                   let tp = 0;
                   routes.map((e) => tp += e.passengers)
                   setTotalPassengers(tp)
              }else{
                window.alert("Önce başlangıç ve bitiş şehirlerini seçin,lütfen")
              }
            }} />
          </View>
          <View style={{flexGrow : 3,marginLeft : 5}}>
          <Button title='Rota temizle' onPress={() => {
              //window.alert(selectedCity + " " + destinationCity)
              setDestinationCity("")
              setSelectedCity("")
              setCurrentRoute([{lat : 0,lng : 0}])
              window.alert("temizlendi")
            }} />
          </View>
        </View>
        
            <Text style={{color : "red",padding : 15}}>{"Toplam yolcu sayısı = " + totalPassengers}</Text>
            <View style={{padding : 5,flexDirection : "column"}} >
            {currentRoute.length > 1 && currentRoute.map((e) => (
              <Text style={{color : "blue",fontWeight : "bold"}}>{e.name + " istasyonu " + e.passengers + " yolcu"}</Text>
            ))}
            </View>
      </View> 
    </ScrollView>
    </View>
    // <View style={styles.container}>
    //   {stations.length > 0 && (
    //     // <Text>{JSON.stringify(stations)}</Text>
    //     stations.map((e, i) => (
    //       <View style={{ flexDirection: "row" }}>
    //         <StationList key={i} text={e} navigation={navigation} />
    //       </View>
    //     ))
    //   )}
    //   {passenger!=-1 && lat != 0 && lng != 0 && (
    //     <Text> lat : {lat} lng : {lng} yolcu: {passenger}</Text>
    //   )}

    //   {locations.length > 0 && locations.map((e) => (
    //     <Text style={{color : "blue"}}>{e[0] + " " + e[1]}</Text>
    //   ))}
    //   {/* <View style={{
    //     borderRadius : 15,
    //     margin : 15
    //   }}>
    //   <Button title='sefer yenile' onPress={() => addVoyages()} />
    //   </View> */}
    

    // </View>
    
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
    //window.alert("run2 aktif")
    getStationDatas(stations, setStations)
    navigation.setParams({
      run2: false
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
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    //backgroundColor: '#fff',

  },
});
