import Place from "./Place.js";

export default class App {
  places = [];

  constructor(places) {
    this.places = places;
  }
  setPlaces(places) {
    this.places = places;
  }
  saveToLS() {
    localStorage.setItem(`places`, JSON.stringify(this.places));
  }
  addPlace(place) {
    if (place instanceof Place) {
      this.places.push(place);
      this.saveToLS();
      return place;
    } else {
      console.log(`place required, received ${place}`);
      return null;
    }
  }
}
