import distances from "./distances.json"
import stations from "./stationsInfo.json"
import {getVoyages} from "./interact"
import {useState} from "react"


let s = Object.keys(stations)
let mySet = new Set()
let ma = []


export function calculateDistanceMatrix(data) {
    console.log("----------> "+ s)
    //window.alert(data) // d
    data.forEach(element => {
        //window.alert(element)
        let t = element.from.name
        console.log(t)
        
        if(!mySet.has(t)) {
            mySet.add(t)
            let aa = new Array(s.length).fill(-1)
            let i = s.indexOf(t)
            aa[i] = 0
            console.log(aa)
            s.forEach((e,i) => {
                if (e !== t){
                    let t_ = t + "-" + e
                    if(distances.hasOwnProperty(t_)){
                        let distance = distances[t_].distance
                        aa[i] = distance
                    }else{
                        let r = e + "-" + t
                        if(distances.hasOwnProperty(r)){
                            aa[i] = distances[r].distance
                        }
                    }
                }
            })
            if(!ma.includes(aa)) ma.push(aa)
        }
    });
    console.log(ma)
    
    //let data = await getVoyages()

    //window.alert(data_.length)
    
}