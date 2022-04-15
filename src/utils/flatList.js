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
               // window.alert(JSON.stringify(stationInfo))
                addStation(text,stationData[text].lat,stationData[text].lng,0,navigation)
                //window.alert("istasyon eklendi")
                // navigation.setParams({
                //     run2 : true
                // })
            }else{
                //window.alert("noo")
                window.alert("Zaten ekli")
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