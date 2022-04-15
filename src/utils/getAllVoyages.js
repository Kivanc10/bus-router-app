import stations from "./stationsInfo.json"
import distances from "./distances.json"

export function getAllVoyages() {
    let voyages = []
    let mySet = new Set()
    //window.alert(JSON.stringify(stations))
    for (let i = 0;i<Object.keys(stations).length;i++) {
        for (let j = i;j<Object.keys(stations).length;j++) {
            if (Object.keys(stations)[i] != Object.keys(stations)[j]) {
                let from = Object.keys(stations)[i]
                let to = Object.keys(stations)[j]
                let title = from + "-" + to
                if (!mySet.has(title)) {
                    mySet.add(title)
                    let data = {}
                    data["name"] = title
                    //data["distance"] = distance(stations[from].lat,stations[to].lat,stations[from].lng,stations[to].lng)
                    //distances
                    if (distances.hasOwnProperty(title)) {
                        data["distance"] = distances[title].distance                        
                    }
                    voyages.push(data)
                }
            }
        }
    }
    
    //window.alert(JSON.stringify(voyages))
    return voyages
}

// function distance(lat1,
//     lat2, lon1, lon2)
// {

// // The math module contains a function
// // named toRadians which converts from
// // degrees to radians.
// lon1 =  lon1 * Math.PI / 180;
// lon2 = lon2 * Math.PI / 180;
// lat1 = lat1 * Math.PI / 180;
// lat2 = lat2 * Math.PI / 180;

// // Haversine formula
// let dlon = lon2 - lon1;
// let dlat = lat2 - lat1;
// let a = Math.pow(Math.sin(dlat / 2), 2)
// + Math.cos(lat1) * Math.cos(lat2)
// * Math.pow(Math.sin(dlon / 2),2);

// let c = 2 * Math.asin(Math.sqrt(a));

// // Radius of earth in kilometers. Use 3956
// // for miles
// let r = 6371;

// // calculate the result
// return(c * r);
// }