import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons"
import { adminLogout, logoutForUser, getVoyages, getStations } from "../utils/interact"
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import envFile from "../utils/env.json"
import { useEffect, useState } from 'react';
import { calculateDistanceMatrix } from "../utils/calculateDistanceMatrix"
import { Picker } from '@react-native-picker/picker';
import { findShortestPaths } from "../utils/warshall_floyd_alg"


const Tab = createBottomTabNavigator();

export default function Inside({ navigation, route }) {
  const { username } = route.params;
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

      <Tab.Screen name="Home" initialParams={{ username: username }} component={InsideHome} />
      <Tab.Screen name="Detail" component={InsideDetail} />
    </Tab.Navigator>

  )
}

function getVoyages_(voyageData, setVoyageData) {
  getVoyages().then(data => {
    //window.alert(JSON.stringify(data))
    setVoyageData(data)
  })
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

function getStationLocs(locs, setLocs) {
  let arr = []
  getStations().then(data => {
    data.map((e) => {
      let t = {}
      t["name"] = e.name
      t["lat"] = e.lat
      t["lng"] = e.lng
      t["passengers"] = e.passengers
      arr.push(t)
    })
    setLocs(arr)
  })
}

function InsideHome({ navigation, route }) {
  const [distanceMtrx, setDistanceMtrx] = useState([])
  const [distanceMtrxKeys, setDistanceMtrxKeys] = useState([])
  const [voyageData, setVoyageData] = useState([])
  const [stations, setStations] = useState([])
  const [locs, setLocs] = useState([])
  const [selectedCity, setSelectedCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")
  const [totalKm, setTotalKm] = useState(0)
  const [currentRoute, setCurrentRoute] = useState([
    {
      lat: 0,
      lng: 0
    }
  ])
  const [totalPassengers, setTotalPassengers] = useState(0)


  const { username } = route.params;
  useEffect(() => {

    getStationDatas(stations, setStations)
    getVoyages_(voyageData, setVoyageData)
    let distanceMatrix = Object.values(calculateDistanceMatrix(voyageData, stations))
    setDistanceMtrx(distanceMatrix)
    setDistanceMtrxKeys(Object.keys(calculateDistanceMatrix(voyageData, stations)))
    getStationLocs(locs, setLocs)

    //window.alert(distanceMtrx)
  }, [route.params?.username])
  return (

    <View style={styles.container}>
      <View style={{ padding: 15 }}>
        <Text style={{ fontWeight: "bold" }}>Kullanıcı {username} </Text>
        {/* <Text>{JSON.stringify(distanceMtrxKeys)}</Text> */}
        {/* <Text>{JSON.stringify(currentRoute)}</Text> */}
        {/* <Text>topl yolcu {totalPassengers}</Text> */}
      </View>
      <MapView
        style={{ height: "50%", width: "100%", marginTop: 10 }}
        //onRegionChange = {region => setRegion(region)}
        initialRegion={{
          latitude: 40.766666,
          longitude: 29.916668,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
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
            waypoints={currentRoute.length > 2 ? currentRoute.slice(1, -1).map((e) => e.coordinates) : undefined}
            destination={currentRoute[currentRoute.length - 1].coordinates}
            apikey={envFile["maps-api-key"]}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onError={(err) => {
              window.alert("an error occured dude")
            }}
          />

        )}
      </MapView>
      <ScrollView>
        <View style={{ padding: 15 }}>
          <Button title='Şehir yenile' onPress={() => {
            setDistanceMtrxKeys(Object.keys(calculateDistanceMatrix(voyageData, stations)))
          }} />
        </View>
        <View style={{
          padding: 25
        }}>
          <View style={{ padding: 10, flexDirection: "row" }}>
            <View style={{ flexGrow: 3 }}>
              <Text style={{ fontWeight: "bold", color: "red" }}>Başlangıç</Text>
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
            <View style={{ flexGrow: 3 }}>
              <Text style={{ fontWeight: "bold", color: "red" }}>Varış</Text>
              <Picker
                selectedValue={destinationCity}
                onValueChange={(itemValue, itemIndex) => {
                  setDestinationCity(itemValue)
                }}
              >
                {distanceMtrxKeys.map((e) => (
                  <Picker.Item label={e} value={e} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexGrow: 3, marginRight: 2 }}>
              {/* <Button title='test' onPress={() => {window.alert(`selected --> ${selectedCity}  destination --> ${destinationCity}`)}} /> */}
              <Button title='Rota bul' onPress={() => {
                if (selectedCity !== "" && destinationCity !== "") {
                  let fromIndex = distanceMtrxKeys.indexOf(selectedCity)
                  let destinationIndex = distanceMtrxKeys.indexOf(destinationCity)
                  let { path, dis } = findShortestPaths(distanceMtrx, fromIndex, destinationIndex)
                  setTotalKm(dis[fromIndex][destinationIndex])
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
                          coordinates: {
                            latitude: e_.lat,
                            longitude: e_.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                          },
                          name: e_.name,
                          passengers: e_.passengers
                        })
                      }
                    })
                  })
                  //  window.alert("founded --> " + JSON.stringify(routes))
                  setCurrentRoute(routes)
                  let tp = 0;
                  routes.map((e) => tp += e.passengers)
                  setTotalPassengers(tp)
                } else {
                  window.alert("Önce başlangıç ve bitiş şehirlerini seçin,lütfen")
                }
              }} />
            </View>
            <View style={{ flexGrow: 3, marginLeft: 5 }}>
              <Button title='Rota temizle' onPress={() => {
                //window.alert(selectedCity + " " + destinationCity)
                setDestinationCity("")
                setSelectedCity("")
                setCurrentRoute([{ lat: 0, lng: 0 }])
                setTotalPassengers(0)
                setTotalKm(0)
                window.alert("temizlendi")
              }} />
            </View>
          </View>
          <View>
            <View>
              {currentRoute.length > 1 && (
                <Text style={{ color: "red", padding: 15 }}>{"Toplam yolcu sayısı = " + totalPassengers}</Text>
              )}
            </View>

            <View style={{ padding: 5, flexDirection: "column" }} >
              {currentRoute.length > 1 && currentRoute.map((e) => (
                <Text style={{ color: "blue", fontWeight: "bold" }}>{e.name + " istasyonu " + e.passengers + " yolcu"}</Text>
              ))}
            </View>
            <View>
              {totalKm !== 0 && (
                <Text style={{ color: "red", fontWeight: "bold" }}>{"Toplam mesafe " + totalKm + " km"}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>

  )
}

function InsideDetail({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Inside detail page</Text>
      <Button title="Logout" onPress={() => logoutForUser(navigation)} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})