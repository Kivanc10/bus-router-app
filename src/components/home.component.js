import { StyleSheet, Text, ImageBackground, View, Button } from 'react-native';


export default function Home({ navigation }) {

    return (
        <View style={styles.container}>
            {/* <ImageBackground source={require("../../assets/home_image.jpg")} style={styles.background_image}> */}
                <View style={styles.homeWrapper}>
                    <View style={styles.homeTextQuestion}>
                        <Text style={styles.homeText}>Kocaeli Otobüs Uygulaması</Text>
                    </View>
                    <View style={styles.buttonWrapper}>
                        <View style={styles.isRegisteredWrapper}>
                            <Text style={styles.sideText}>Üye değil misin ?</Text>
                            <Button title='Kayıt sayfasına git' style={styles.registerBtn} onPress={() => navigation.navigate("Register")} />
                        </View>
                        <View style={styles.isLoggedInWrapper}>
                            <Text style={styles.sideText}>Zaten üye misin ?</Text>
                            <Button style={styles.loginBtn} title='Giriş sayfasına git' onPress={() => navigation.navigate("Login")} />
                        </View>
                        <View style={styles.adminWrapper}> 
                            <Text style={styles.sideText}>Admin girişi yapın</Text>
                            <Button style={styles.adminBtn} title="Admin girişi" onPress={() => navigation.navigate("Admin")} />
                        </View>
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
    background_image: {
        width: "100%",
        height: "100%",
        padding: 10,
        opacity: 0.8
    },
    homeWrapper: {
        flexDirection: "column",
        //padding: 15,
        marginTop: 60
    },
    homeTextQuestion: {
        alignItems : "center",
    },
    homeText : {
        fontSize : 25,
        color : "black",
        fontWeight : "bold"
    },  
    buttonWrapper: {
        flexDirection: "column",
        padding : 15,
        marginTop : 110
    },
    isRegisteredWrapper: {
        flexDirection: "row",
        marginBottom : 50
    },
    sideText: {
        flexGrow: 1,
        fontWeight : "bold",
        //fontStyle : ""
    },
    isLoggedInWrapper: {
        flexDirection: "row",
        marginBottom : 50
    },
    registerBtn: {
        flexGrow: 2
    },
    loginBtn: {
        flexGrow: 2
    },
    adminBtn : {
        flexGrow: 2
    },
    adminWrapper : {
        flexDirection: "row",
        marginBottom : 50
    }
});
