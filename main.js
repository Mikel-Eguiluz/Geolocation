import Place from "./Place.js";
import App from "./App.js";
//LEAFLET L included as script in index.html
const mapContainer = document.getElementById("map-container");
let place = null;
let marker = null;
const markerGroup = L.layerGroup();
let isNew = true;

// const testplace = new Place();

//let placesData = JSON.parse(localStorage.getItem("places"));
//const app = placesData ? new App(placesData) : new App([]);
/*****************************
 ********Paint the map********
 ****************************/

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
    id: "mapbox/streets-v11",
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
  if ("geolocation" in navigator) {
    const geo = navigator.geolocation;
    //getCurrentPosition is async
    geo.getCurrentPosition((p) => {
      map.setView([p.coords.latitude, p.coords.longitude], 13);
      const newCoordinates = {
        latitude: p.coords.latitude,
        longitude: p.coords.longitude,
      };
      place = new Place({
        coordinates: newCoordinates,
        date: p.timestamp,
        name: document.getElementById("name-input").value,
      });

      console.log("finished getting coords");
    });
  } else {
    console.log(`Your browser does not support geolocation`);
  }
}
const app = new App([]);

async function getStuff() {
  await Promise.all([app.fetchPlaces(), getCurrentPlace()]);
  return "finished";
}

// getCurrentPlace();
/*************************************************
 *****************place previous markers***********
 **************************************************/

//get data from GraphQL
getStuff().then((r) => {
  // app.fetchPlaces();
  console.log(r);
  console.log("app", app);
  console.log("b4 for");
  for (const oldPlace of app.places) {
    // place = new Place(oldPlace);
    console.log(oldPlace);
    oldPlace.addMarker(false, map).addTo(markerGroup);
  }

  marker = place.addMarker(isNew, map);
});
/*************************************************
 ***************** change name *******************
 *************************************************/

document.getElementById("name-input").addEventListener("input", (e) => {
  if (isNew) {
    place.setName(e.target.value);
    marker.remove();
    marker = place.addMarker(isNew, map);
  }
});

/*************************************************
 ***************** Refresh Location***************
 *************************************************/

document.getElementById("refresh-btn").addEventListener("click", (e) => {
  marker.remove();
  getCurrentPlace();
  isNew = true;

  marker = place.addMarker(isNew, map);
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
    isNew = false;
    place.addMarker(isNew, map).addTo(markerGroup);
  }
});
