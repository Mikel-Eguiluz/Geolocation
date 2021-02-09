export default class Place {
  // location = {
  //   latitude =0 ,
  //   longitude =0
  // }
  constructor({ location, date }) {
    this.location = location;
    // this.location.latitude = latitude;
    // this.location.longitude = longitude;
    this.date = date;
  }
  addMarker(isNew, map) {
    const marker = L.marker([
      this.location.latitude,
      this.location.longitude,
    ]).addTo(map);
    marker
      .bindPopup(
        `<div class="center-align"><b>I WAS HERE ON</b><br>${
          this.date.toString().split(" GMT")[0]
        }.<br> ${
          !isNew
            ? ""
            : '<button class="btn-small" id="save-location-btn">Save This</button></div>'
        }`,
      )
      .openPopup();
    return marker;
  }
}
