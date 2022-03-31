import { StyleSheet, View, Text, Button,TextInput } from 'react-native';
import { useState } from 'react';


function onPressed(username,pswrd,navigation) {
    if (username === "" || pswrd === "") {
        alert("Boşlukları doldurun lütfen")
    }else{
        if (username === "root" && pswrd === "root") {
            //navigation.navigate("")
            //alert("Giriş başarılı")
            navigation.navigate({
                name : "Wrapper",
                params : {isAdmin : true},
                merge : true
              });
        }else{
            alert("Giriş başarısızz")
        }
    }
}

export default function Admin({ navigation }) {
    const [adminName,setAdminName] = useState("")
    const [adminPswrd,setAdminPswrd] = useState("")
    return (
        <View style={styles.container}>
            <View style={styles.formWrapper}>
                <View style={styles.usernameWrapper}>
                    <TextInput onChangeText={newText => setAdminName(newText)} placeholder='Kullanıcı Adı' style={styles.textInputStyle} />
                </View>
                <View style={styles.passwordWrapper}>
                    <TextInput onChangeText={newText => setAdminPswrd(newText)} secureTextEntry={true} placeholder='Şifre' style={styles.textInputStyle} />
                </View>
                <View style={styles.loginBtnWrapper}>
                    {/* <Button onPress={() => navigation.navigate("Inside",{
            username
          })} title='Giriş yap'/> */}
                    <Button onPress={() => onPressed(adminName,adminPswrd,navigation)} title='Giriş yap' />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        padding : 15
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
})