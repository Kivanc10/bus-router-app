import axios from "axios"
import { getAllVoyages } from "./getAllVoyages"
import stations from "./stationsInfo.json"
import distances from "./distances.json"
export function checkAdmin(navigation) {
    let result = false
    axios.get("http://192.168.1.27:8080/get/users")
        .then((res) => {
            const users = res.data
            // window.alert(typeof users)
            //  window.alert(JSON.stringify(users))
            // window.alert(typeof users)
            if (typeof users === "object") {
                //window.alert("yes object")
                // window.alert("evet object")
                result = true
                navigation.navigate({
                    name: "Wrapper",
                    params: { isAdmin: true },
                    merge: true
                });
            }
        }).catch((e) => {
            result = false
        })
    //window.alert(result)
    return result
}

export function checkUser(navigation) {
    let result = false;
    axios.get("http://192.168.1.27:8080/inside/user")
        .then((res) => {
            //window.alert(JSON.stringify(res.data))
            // window.alert(res.data["Name"])
            // window.alert(typeof res.data)
            if (typeof res.data === "object") {
                navigation.navigate({
                    name: "Wrapper",
                    params: { isLoggedIn: true, username: res.data["Name"] },
                    merge: true
                });
            }

            //result = res.data
            //return res.data
        }).catch((e) => {
            result = false;
        })
    return result
}

export function adminLogin(name, password, navigation) {
    let g_result = false;
    axios.post("http://192.168.1.27:8080/adminLogin", {
        name: name,
        password: password
    }).then((res) => {
        let result = res.data
        g_result = result
        // window.alert(g_result)
        navigation.navigate({
            name: "Wrapper",
            params: { isAdmin: true },
            merge: true
        });
    }).catch((e) => {
        //window.alert(e)
        window.alert("şifre veya parola yanlış")
    })
    return g_result
}

export function addStation(name, lat, lng, passengers, navigation) {
    let status = false;
    axios.post("http://192.168.1.27:8080/add/station", {
        name,
        lat,
        lng,
        passengers
    }).then((res) => {
        let result = res.data
        navigation.navigate("AdminHome",{
            run : true
        })
        // navigation.navigate({
        //     name: "AdminHome",
        //     params: { run: true },
        //     merge: true
        // })
        status = true
    }).catch((e) => {
        window.alert("istasyon eklerken hata oluştu")
        status = false
    })
    return status
}

export function updateNumberOfPassengersOfStation(name,passengers,navigation) {
    axios.post("http://192.168.1.27:8080/update/station",{
        name : name,
        passengers : passengers
    }).then((res) => {
        window.alert("başarılı")
        navigation.navigate("AdminHome",{
            run : true
        })
        
    }).catch((e) => window.alert("istasyon güncellerken hata oluştu"))
}

export function adminLogout(navigation) {
    let result = false;
    axios.post("http://192.168.1.27:8080/logout/admin")
        .then((res) => {
            window.alert(res.data)
            navigation.navigate({
                name: "Wrapper",
                params: { isAdmin: false },
                merge: true
            })
            result = true
            window.alert("çıkış başarılı")
        }).catch((e) => {
            window.alert("Admin çıkış yapamıyor")
            result = false
        })
    return result
}

export function registerForUser(username, password, email, navigation) {
    axios.post("http://192.168.1.27:8080/signUp", {
        name: username,
        email: email,
        password: password
    }).then((res) => {
        let result = res.data
        window.alert(result)
        navigation.navigate("Login", {
            username,
            password
        })
    }).catch((e) => {
        //window.alert(e)
        window.alert("Kullanıcı zaten kayıtlı veya network hatası")
    })
}

export function loginForUser(route, password, navigation, username) {
    if (route.params?.password) {
        if (route.params.password != password) {
            alert("Passwords are not matched")
        } else {
            axios.post("http://192.168.1.27:8080/signIn", {
                name: username,
                password: password
            }).then((res) => {
                window.alert(JSON.stringify(res.data))
                navigation.navigate({
                    name: "Wrapper",
                    params: { isLoggedIn: true, username: username },
                    merge: true
                });
            }).catch((e) => {
                //window.alert(e)
                window.alert("Şifre veya parola yanlış")
            })
        }
    } else {
        axios.post("http://192.168.1.27:8080/signIn", {
            name: username,
            password: password
        }).then((res) => {
            navigation.navigate({
                name: "Wrapper",
                params: { isLoggedIn: true, username: username },
                merge: true
            });
        }).catch((e) => {
            window.alert("Şifre veya parola yanlış")
        })
    }
}

export function logoutForUser(navigation) {
    axios.post("http://192.168.1.27:8080/logout/user")
        .then((res) => {
            navigation.navigate({
                name: "Wrapper",
                params: { isLoggedIn: false },
                merge: true
            })
        }).catch((e) => {
            //window.alert(e)
            window.alert("Kullanıcı çıkış yaparken hata oluştu")
        })
}

export function getStations() {
    let data = [];
    let promise = axios.get("http://192.168.1.27:8080/get/stations")
    let dataPromise = promise.then((res) => res.data)
    return dataPromise

}

function isHere(arr,name) {
    let result = false;
    arr.forEach(element => {
        if (element.name === name) {
            result = true
            return result
        }
    });
    return result
}

export function addVoyages() {
    let voyages = getAllVoyages()
    window.alert(JSON.stringify(voyages))
    for (let i = 0; i < Object.keys(stations).length; i++) {
        for (let j = i; j < Object.keys(stations).length; j++) {
            
            let from = Object.keys(stations)[i]
            let to = Object.keys(stations)[j]
            let title = from + "-" + to
            //window.alert(JSON.stringify(distances[voyages[j].name]))
            if (isHere(voyages,title)){
                //window.alert("here dude")
                axios.post("http://192.168.1.27:8080/add/voyage",{
                    from : from,
                    to : to,
                    distance : distances[voyages[j].name].distance
                }).then((res) => {
                    window.alert("eklendi")
                }).catch((e) => {
                    window.alert("hata ya da zaten var")
                })
            }
        }
    }
}

export function getVoyages() {
    let promise = axios.get("http://192.168.1.27:8080/get/voyages")
    let dataPromise = promise.then((res) => res.data)
    return dataPromise

}