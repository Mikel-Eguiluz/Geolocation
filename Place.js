export default class Place {
  // location = {
  //   latitude =0 ,
  //   longitude =0
  // }
  constructor({ coordinates, date, name = "I" }) {
    this.coordinates = coordinates;
    // this.coordinates.latitude = latitude;
    // this.coordinates.longitude = longitude;
    this.date = date;
    this.name =
      name === ""
        ? "I"
        : name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
    this._id = Place.uuidv4();
  }
  setName(name) {
    this.name =
      name === ""
        ? "I"
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
