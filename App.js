import Place from "./Place.js";

const ENDPOINT =
  "https://api-eu-central-1.graphcms.com/v2/ckkxy6clc68nw01z7718pfe2l/master";
export default class App {
  places = [];

  constructor(places) {
    this.places = places;
  }
  // setPlaces(places) {
  //   this.places = places;
  // }
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
