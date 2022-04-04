import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Button, Text, View ,TextInput} from 'react-native';
import { useState, useEffect } from 'react';
import { loginForUser } from '../utils/interact';

// function onPressed(route,password,navigation,username) {
//     if (route.params?.password) {
//       if (route.params.password != password) {
//         alert("Passwords are not matched")
//       }else{
//         navigation.navigate({
//           name : "Wrapper",
//           params : {isLoggedIn:true,username : username},
//           merge : true
//         });
//       }
//     }else{
//       navigation.navigate({
//         name : "Wrapper",
//         params : {isLoggedIn:true,username : username},
//         merge : true
//       });
//     }
// }

export default function Login({ navigation, route }) {
  useEffect(() => {
    if (route.params?.username) {
      setUserName(route.params.username)
    }
  }, [route.params?.username])
  const [username, setUserName] = useState("")
  const [password, setUserPassword] = useState("")
  const content = username !== "" ? <Text>{username} olarak giriş yap...</Text> : <Text>Giriş Yapmak için bilgileri doldurun</Text>;
  return (
    <View style={styles.container}>
      {/* <Text>Login page !!!</Text> */}
      <StatusBar style="auto" />
      {/* {username!== "" && (
        <Text>Welcome {username}</Text>
      )} */}
      <View style={styles.loginWrapper}>
        <View style={styles.userIntroTextStyle}>
          {content}
        </View>
        <View style = {styles.formWrapper}>
          <View style={styles.usernameWrapper}>
          <TextInput onChangeText={newText => setUserName(newText)} defaultValue={username} placeholder='Kullanıcı Adı' style={styles.textInputStyle} />
          </View>
          <View style={styles.passwordWrapper}>
          <TextInput onChangeText={newText => setUserPassword(newText)} defaultValue={password} secureTextEntry={true} placeholder='Şifre' style={styles.textInputStyle} />
          </View>
          <View style={styles.loginBtnWrapper}>
          {/* <Button onPress={() => navigation.navigate("Inside",{
            username
          })} title='Giriş yap'/> */}
          <Button onPress={() => loginForUser(route,password,navigation,username)} title='Giriş yap'/>
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginWrapper : {    
    padding : 50,
   
  },
  userIntroTextStyle : {
    alignItems : "center",
  },
  formWrapper : {
    flexDirection : "column",
    marginTop : 60
  },
  textInputStyle : {
    fontSize : 25,
    borderBottomWidth : 2,
    borderBottomColor : "black",
    paddingBottom : 20,
    marginBottom : 50,
  },
  usernameWrapper : {
   
  },
  passwordWrapper : {
   
  }
});
