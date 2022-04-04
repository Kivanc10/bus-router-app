import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View ,ImageBackground,TextInput} from 'react-native';
import  { useState } from 'react';
import { registerForUser } from '../utils/interact';


export default function Register({route,navigation}) {
    //const {username,age} =  route.params;
    const [username,setUserName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
  return (
    <View style={styles.container}>
    {/* <ImageBackground source={require("../../assets/home_image.jpg")} style={styles.background_image}> */}
    <View style = {styles.formWrapper}>
        <View style={styles.user_name}>
            <TextInput onChangeText={newText => setUserName(newText)} defaultValue={username} style={styles.textInputStyle} placeholderTextColor = "#000000"  placeholder='Kullanıcı isminizi girin' />
        </View>
        <View style={styles.user_email}>
            <TextInput onChangeText={newText => setEmail(newText)} defaultValue={email} style={styles.textInputStyle} placeholderTextColor = "#000000" placeholder="Kullanıcı emaili girin" />
        </View>
        <View style={styles.user_password}>
            <TextInput secureTextEntry={true} onChangeText={newText => setPassword(newText)} defaultValue={password} style={styles.textInputStyle} placeholderTextColor = "#000000" placeholder = "Şifrenizi girin" />
        </View>
        <View style={styles.registerBtnWrapper}>
        {/*  */}
            <Button title='Kayıt Ol' onPress={() => registerForUser(username,password,email,navigation)} /> 

        </View>
    </View>

    {/* </ImageBackground> */}
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background_image : {
      width : "100%",
      height : "100%",
      padding : 10,
      opacity : 0.4
    },
    formWrapper : {
      flexDirection : "column",
      padding : 15,
      marginTop : 60
    },
    user_email : {
      color : "black",
      fontWeight : "bold",
    },
    user_name : {
  
    },
    user_password : {
      color : "black",
      fontWeight : "bold",
    },
    textInputStyle : {
      fontSize : 25,
      borderBottomWidth : 2,
      borderBottomColor : "black",
      paddingBottom : 20,
      marginBottom : 50
      //border
    },
    registerBtnWrapper : {

    },
    registerBtn : {
        color : "gray"
    }
  });
