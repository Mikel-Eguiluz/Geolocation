export default class Place {
  // location = {
  //   latitude =0 ,
  //   longitude =0
  // }
  constructor({ coordinates, date, name = "I", id = "NOID" }) {
    this.coordinates = coordinates;
    // this.coordinates.latitude = latitude;
    // this.coordinates.longitude = longitude;
    this.date = new Date(date);
    this.name =
      name === ""
        ? "Someone"
        : name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
    this.id = id;
  }
  setName(name) {
    this.name =
      name === ""
        ? "Someone"
        : name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  }
  addMarker(isNew, map) {
    const marker = L.marker([
      this.coordinates.latitude,
      this.coordinates.longitude,
    ]).addTo(map);
    marker
      .bindPopup(
        `<div class="center-align"><b>${this.name} was here on<br>${
          this.date.toString().split(" GMT")[0]
        }.</b><br> ${
          !isNew
            ? ""
            : '<button class="btn-small" id="save-location-btn">Save This</button></div>'
        }`,
      )
      .openPopup();
    map.setView([this.coordinates.latitude, this.coordinates.longitude], 13);
    return marker;
  }
  static uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}
