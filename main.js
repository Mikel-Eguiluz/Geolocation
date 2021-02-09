import Place from "./Place.js";
import App from "./App.js";
//LEAFLET L included as script in index.html
const mapContainer = document.getElementById("map-container");
let place = null;
let marker = null;
let placesData = JSON.parse(localStorage.getItem("places"));
const app = placesData ? new App(placesData) : new App([]);
const markerGroup = L.layerGroup();

/*****************************
 ********Paint the map********
 ****************************/

const map = L.map(mapContainer, {
  //center: [latitude, longitude],
  center: [0, 0],
  zoom: 1,
});
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3VzaWRhbSIsImEiOiJja2t3bjVkZXMwbHluMnlvNDN0dm4wYjV6In0.uJxsFoilfO6h_M3mw2j-YQ",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZ3VzaWRhbSIsImEiOiJja2t3bjVkZXMwbHluMnlvNDN0dm4wYjV6In0.uJxsFoilfO6h_M3mw2j-YQ",
  },
).addTo(map);
/*************************************************
 *****************place previous markers***********
 **************************************************/
for (const oldPlace of app.places) {
  place = new Place(oldPlace);
  place.addMarker(false, map).addTo(markerGroup);
}

/*************************************************
 ************* Get Current Coordinates************
 *************************************************/

function getCurrentPlace() {
  if ("geolocation" in navigator) {
    const geo = navigator.geolocation;
    //getCurrentPosition is async
    geo.getCurrentPosition((p) => {
      map.setView([p.coords.latitude, p.coords.longitude], 13);

      place = new Place({
        latitude: p.coords.latitude,
        longitude: p.coords.longitude,
        date: new Date(p.timestamp),
      });
      marker = place.addMarker(true, map);
    });
  } else {
    console.log(`Your browser does not support geolocation`);
  }
}
getCurrentPlace();

/*************************************************
 ***************** Refresh Location***************
 *************************************************/
document.getElementById("refresh-btn").addEventListener("click", (e) => {
  marker.remove();
  getCurrentPlace();
});

/****************************
 ****Save Location to LS*****
 ****************************/

mapContainer.addEventListener("click", (e) => {
  if (e.target && e.target.matches("button#save-location-btn")) {
    e.stopPropagation();
    console.log(app);
    app.addPlace(place);
    console.log(map);
    marker.remove();
    place.addMarker(false, map).addTo(markerGroup);
  }
});
