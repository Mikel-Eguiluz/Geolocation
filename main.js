import Place from "./Place.js";
import App from "./App.js";

const mapContainer = document.getElementById("map-container");
let place = null;
let marker = null;
const markerGroup = L.layerGroup();

const app = new App([]);

/*****************************
 ********Paint the map********
 ****************************/
//LEAFLET L included as script in index.html
const map = L.map(mapContainer, {
  //center: [latitude, longitude],
  center: [0, 0],
  zoom: 13,
});
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3VzaWRhbSIsImEiOiJja2t3bjVkZXMwbHluMnlvNDN0dm4wYjV6In0.uJxsFoilfO6h_M3mw2j-YQ",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    //id: "mapbox/streets-v11",
    id: "mapbox/satellite-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZ3VzaWRhbSIsImEiOiJja2t3bjVkZXMwbHluMnlvNDN0dm4wYjV6In0.uJxsFoilfO6h_M3mw2j-YQ",
  },
).addTo(map);

/*************************************************
 ************* Get Current Coordinates************
 *************************************************/

function getCurrentPlace() {
  function success(p) {
    const newCoordinates = {
      latitude: p.coords.latitude,
      longitude: p.coords.longitude,
    };
    place = new Place({
      coordinates: newCoordinates,
      date: p.timestamp,
      name: document.getElementById("name-input").value,
    });
    if (marker === null) {
      marker = place.addMarker(map);
      console.log("finished getting coords");
    } else {
      marker.setLatLng(L.latLng(p.coords.latitude, p.coords.longitude));
      console.log("moving");
    }
    // marker = place.addMarker(map);
    // console.log("finished getting coords");
  }
  function error() {
    console.log("Sorry, no position available.");
  }
  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  };
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
  } else {
    navigator.geolocation.watchPosition(success, error, options);
    //navigator.geolocation.getCurrentPosition(success, error, options);
  }
}

/*************************************************
 *****************place previous markers***********
 **************************************************/
function placeOldMarkers() {
  for (const oldPlace of app.places) {
    oldPlace.addMarker(map).addTo(markerGroup);
  }
}

async function getStuff() {
  await Promise.all([app.fetchPlaces(), getCurrentPlace()]);
  console.log("app", app);
  placeOldMarkers(map);

  map.panTo([place.coordinates.latitude, place.coordinates.longitude], 13);
}
getStuff();
/*************************************************
 ***************** change name *******************
 *************************************************/

document.getElementById("name-input").addEventListener("input", (e) => {
  if (true) {
    //Todo this bugs when tracking
    let newName = e.target.value;
    if (newName === "") {
      newName = "someone";
    }
    document.getElementById("active-popup").innerText = newName;
    // marker.remove();
    // marker = place.addMarker(map);
  }
});

/*************************************************
 ***************** Refresh Location***************
 *************************************************/

document.getElementById("refresh-btn").addEventListener("click", async () => {
  marker.remove();

  await getCurrentPlace();
  marker = place.addMarker(map);
  map.panTo([place.coordinates.latitude, place.coordinates.longitude], 13);
});

/****************************
 ****Save/delete Location ***
 ****************************/

mapContainer.addEventListener("click", async (e) => {
  if (e.target && e.target.matches("button#save-location-btn")) {
    e.stopPropagation();
    const newPlace = await app.addPlace(place);
    newPlace.addMarker(map).addTo(markerGroup);
    // marker.remove();
    // place.;
  } else if (e.target && e.target.matches("i#delete-location-btn")) {
    e.stopPropagation();
    await app.deletePlace(e.target.dataset.id);
    for (const layer of markerGroup.getLayers()) {
      layer.remove();
    }
    placeOldMarkers(map);
    map.panTo([place.coordinates.latitude, place.coordinates.longitude], 13);
  }
});
