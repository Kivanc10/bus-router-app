import { StyleSheet, Text, View, Button } from 'react-native';
import stationData from '../utils/stationsInfo.json';
import {addStation} from "./interact"


export const MyText = ({text,navigation,key}) => {
    //window.alert(typeof props.children)
    return (
        <Text key={key} onPress={() => {
            if (stationData.hasOwnProperty(text)) {
                //window.alert("yesss")
                let stationInfo = stationData[text]
        
                navigation.navigate("GoStationPage",{
                    stationName : text,
                    lat : stationData[text].lat,
                    lng : stationData[text].lng,
                    otherNavigation : navigation
                })
            }else{
                //window.alert("noo")
                //window.alert("Zaten ekli")
                let newTxt = text.replace("(ekli)","")
                navigation.navigate("AddedStationPage",{
                    stationName : newTxt,
                    // lat : stationData[newTxt].lat,
                    // lng : stationData[newTxt].lng,
                    otherNavigation : navigation
                })
                //navigation.navigate("GoStationPage")
            }
        }} style = {styles.textStyle}>{text}</Text>
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