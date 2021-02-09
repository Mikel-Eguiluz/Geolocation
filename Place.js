export default class Place {
  constructor({ latitude, longitude, date }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.date = date;
  }
  addMarker(isNew, map) {
    const marker = L.marker([this.latitude, this.longitude]).addTo(map);
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
