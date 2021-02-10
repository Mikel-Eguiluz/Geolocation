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
  // addPlace(place) {
  //   if (place instanceof Place) {
  //     this.places.push(place);
  //     this.saveToLS();
  //     return place;
  //   } else {
  //     console.log(`place required, received ${place}`);
  //     return null;
  //   }
  // }
  addPlace = async (place) => {
    console.log("about to add", place);
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation createPlace($data: PlaceCreateInput!) {
              createPlace(data: $data) {
                coordinates {
                  latitude
                  longitude
                }
                date
                name
                id
              }  
            }`,
          variables: {
            // data: place,
            data: {
              coordinates: {
                latitude: place.coordinates.latitude,
                longitude: place.coordinates.longitude,
              },
              date: place.date.toISOString(),
              name: place.name,
            },
          },
        }),
      });
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      //this one has an ID
      const newPlace = new Place(data.data.createPlace);
      this.places.push(newPLace);
      this.saveToLS();
      console.log(newPlace);
    } catch (err) {
      console.log("error", err);
    }
  };

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
        this.places.push(new Place(place));
      }
      this.saveToLS();
      console.log("finished fetching");
      return this;
    } catch (err) {
      console.log("error", err);
    }
  };
}
