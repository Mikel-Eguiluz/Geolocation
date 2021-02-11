import Place from "./Place.js";

const GRAPHQL_ENDPOINT =
  "https://api-eu-central-1.graphcms.com/v2/ckkxy6clc68nw01z7718pfe2l/master";
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
  deletePlace = async (id) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation deletePlace($where: PlaceWhereUniqueInput!) {
              deletePlace(where: $where){
                name
              }
            }`,
          variables: {
            // data: place,
            where: {
              id: id,
            },
          },
        }),
      });
      if (response.status !== 200) {
        throw response;
      }
      await response.json();
      const index = this.places.findIndex((place) => place.id === id);
      console.log(index);
      this.places.splice(index, 1);
      this.saveToLS();
      console.log("deleted");
    } catch (err) {
      console.log("error", err);
    }
  };
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
      this.places.push(newPlace);
      this.saveToLS();
      console.log("newplace", newPlace);
      return newPlace;
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
        //TODO if fetch fails, get from LS
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
