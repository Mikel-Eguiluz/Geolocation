import Place from "./Place.js";

const GRAPHQL_ENDPOINT =
  "https://api-eu-central-1.graphcms.com/v2/ckkxy6clc68nw01z7718pfe2l/master";
export default class App {
  places = [];
  constructor(places) {
    this.places = places;
  }
  setPaces(places) {
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

  fetchPlaces = async () => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
          query Places{
            places {
              coordinates{
                latitude
                longitude
              }
            date
            name
            id
            }
          }`,
        }),
      });
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      //console.log("data", data.data.places);
      for (const place of data.data.places) {
        this.addPlace(new Place(place));
      }
      console.log("finished fetching");
      return this;
    } catch (err) {
      console.log("error", err);
    }
  };
}
