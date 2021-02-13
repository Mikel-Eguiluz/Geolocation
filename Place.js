export default class Place {
  // location = {
  //   latitude =0 ,
  //   longitude =0
  // }
  constructor({ coordinates, date, name = "I", id = null }) {
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
  addMarker(map) {
    const marker = L.marker([
      this.coordinates.latitude,
      this.coordinates.longitude,
    ]).addTo(map);
    marker.bindPopup(
      `<div class="center-align"><b>
         <span ${this.id ? "" : 'id="active-popup"'}>${
        this.name
      }</span> was here on<br>${this.date.toString().split(" GMT")[0]}.</b> ${
        this.id
          ? `<i class="fas fa-trash red-text text-darken-4" id="delete-location-btn" data-id= ${this.id}></i> `
          : '<br><button class="btn-small" id="save-location-btn">Save This</button></div>'
      }`,
      { autoPan: false },
    );
    if (!this.id) marker.openPopup();
    console.log(marker.getPopup().options);
    return marker;
  }
}
