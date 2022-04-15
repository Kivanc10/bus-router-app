import { StyleSheet, Text, View, Button } from 'react-native';
import stationData from '../utils/stationsInfo.json';
import {addStation} from "./interact"

export const StationList = ({text,key,navigation}) => {
    return (
        <Text style={styles.textStyle} key={key} onPress = {() => {
            if (stationData.hasOwnProperty(text)){
                let stationInfo = stationData[text]
               // window.alert(JSON.stringify(stationInfo))
                navigation.setParams({                    
                    lat : stationInfo.lat,
                    lng : stationInfo.lng                    
                })
            }
        }}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    textStyle : {
        color : "red",
        fontSize : 25,
        borderWidth : 1,
        padding : 15,
        marginTop : 15
    }
})