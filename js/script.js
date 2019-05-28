//creating the map
var map = null
var marker = null
var myIcon = L.icon({
    iconUrl: 'img/ISS.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
});
var msg_popup = ""
var units = "kilometers"

const btnUrl = document.getElementById('btn-location')
btnUrl.addEventListener('click',() => getISSData(showISSDAta))

document.getElementById('miles').addEventListener('click',() => units = "miles")

document.getElementById('klm').addEventListener('click',() => units = "kilometers")

async function getISSData(showISSDAta){
    const url_iss = `https://api.wheretheiss.at/v1/satellites/25544?units=${units}`
    const response = await fetch(url_iss)
    const data = await response.json()
    showISSDAta(data)
}

function showISSDAta(data){
    const keys = Object.keys(data)
    const element = document.getElementById(keys[0])
    //if there are already elements inside the info-container
    if(element === null){
        createContainer(data,createElements)
    }else{
        updateData(data)
    }
    //initializing the map or update the map
    initMap(data)
}

function createElements(data, container){
    //remove the header adv
    document.getElementById('adv').remove()
    const keys = Object.keys(data)
    keys.forEach(key => {
        var p = document.createElement('p')
        p.id = key
        p.style = "font-size: 14px; color:white"
        var text = document.createTextNode(`${key}: ${data[key]}`)
        p.appendChild(text)
        container.appendChild(p)
    }) 
    btnUrl.textContent = 'Update data'
}

function createContainer(data,callbackData){
    //remove the fake map image 
    document.getElementById('fakeImg').remove()

    msg_popup = "Hello, I\'m here"
    const container = document.querySelector('.info-container')
    callbackData(data,container)
}

function updateData(data){
    msg_popup = "Now I\'m here"
    const keys = Object.keys(data)
    keys.forEach(key => document.getElementById(key).textContent = `${key}: ${data[key]}`)
}

//Initializing the map
function initMap(data){
    if(map === null){
        map = L.map('mapISS').setView([0, 0], 1);
        var access_token = 'pk.eyJ1IjoicmF1bDEyMyIsImEiOiJjanc2bHBva3cxYXZ6M3pwOWJ2MDY4amVsIn0.FQempLGMztogalLsK5ug0w'
        var tile = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${access_token}`, 
        {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets'
        })
        tile.addTo(map);
        marker = L.marker([0,0], {icon: myIcon})
    }
    marker.setLatLng([data.latitude,data.longitude])
    marker.addTo(map)
    //Adding a popup
    marker.bindPopup(`<p>${msg_popup}/<p>`)
    marker.openPopup()
}