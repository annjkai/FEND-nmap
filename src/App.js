import React, { Component } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Map from './Map';
import ErrorBoundary from './ErrorBoundary';
import escapeRegExp from 'escape-string-regexp';
/* global google */

//handle potential problems with faulty Google Maps API keys
window.gm_authFailure = function() {
    alert("Oops, something went wrong! Please try again.")
}

class App extends Component {
    state = {
        map: '',
        markers: [],
        query: '',
        leipzigVenues: [],
        searchedVenues: [],
        searchedMarkers: []
    }

    //https://stackoverflow.com/questions/45561968/set-fetched-json-data-as-state-and-use-it
    getFoursquareData = () => {
        //const venue_id = mapPoint.venueID
        const latlng = "51.3397,12.3731"
        const client_id = "E50QB5BVVUKE0MJPO1ZRAI3CJ0OC5ZLF5IGCZRYABTC2LYTI"
        const client_secret = "TQ45PRDSPDAN21YQQEIZ3YEDRS3EQLV1GQLCHVHWAA4AGVET"
        const version = "20181408"
        const limit = 20
        const museums = "4bf58dd8d48988d181941735"
        const radius = 1000

        fetch(`https://api.foursquare.com/v2/venues/search?ll=${latlng}&client_id=${client_id}&client_secret=${client_secret}&v=${version}&categoryId=${museums}&radius=${radius}&limit=${limit}`)
            .then(function(response) { return response.json() })
            .then(data => {
                this.setState({ leipzigVenues: data.response.venues,
                                searchedVenues: data.response.venues },
                                //createMarkers only gets called after the state has been set
                                //thanks to Bram Vanroy, who gave me a marvelous explanation of this syntax
                                () => this.setMarkers())
            })
            .catch(function(error) { console.log(error) })
    }

    componentDidMount() {
        window.initMap = this.initMap
        //async loading of the Google Maps script
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAvTTYIbLSapu-D1mVwX7NWEaJ_FqRF06s&v=3&callback=initMap')
        //gets API data
        this.getFoursquareData()
    }

    //create the map & pull in markers
    initMap = () => {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 51.3397, lng: 12.3731},
            zoom: 14
        })
        this.setState({map}, () => this.setMarkers())
    }

    setMarkers = () => {
        const { searchedVenues, map } = this.state
        const markers = []
        /*check that map has loaded, searchedVenues are filled and the markers haven't been created yet
        A million thanks to Bram Vanroy from the EMEA Scholarship for his patience and in-depth explanations without which I'd still be stuck in async hell today*/
        if (map && searchedVenues.length > 0 && markers.length === 0) {
          searchedVenues.forEach((venue, index) => {
              //initialize animated markers
              const marker = new google.maps.Marker({
                  map: map,
                  position: venue.location,
                  title: venue.name,
                  animation: google.maps.Animation.DROP,
                  id: index
              })
              //marker is briefly animated when clicked
              marker.addListener('click', function() {
                  if (marker.getAnimation() !== null) {
                      marker.setAnimation(null)
                  } else {
                      marker.setAnimation(google.maps.Animation.BOUNCE)
                      setTimeout(function() {
                          marker.setAnimation(null)
                      }, 100)
                  }
              })
              //marker displays infowindow when clicked
              marker.addListener('click', function() {
                  fillInfoWindow(this, mapInfoWindow)
              })
              //push markers to state
              markers.push(marker)
          })

          //create infowindow
          const mapInfoWindow = new google.maps.InfoWindow()

          //populate infowindow
          function fillInfoWindow (marker, infowindow) {
              const infoWindowContent = `<h4>${marker.title}</h4>`

              //check whether infowindow is already open
              if (infowindow.marker !== marker) {
                  infowindow.marker = marker
                  infowindow.setContent(infoWindowContent)
                  infowindow.open(map, marker)
                  //clear marker prop when infowindow is closed
                  infowindow.addListener('closeclick', function() {
                      infowindow.setMarker = null
                  })
              }
          }
          this.setState({ markers })
      }
    }

    //filters through points of interest & updates UI based on result
    searchVenues = (query) => {
        this.setState({ query })
        //access state
        const { markers, leipzigVenues } = this.state
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            //set markers to not visible to start - thanks to Mariola Karpiewska for her help with this
            markers.forEach((marker) => {
                marker.setVisible(false)
            })
            //update state based on matches, set matching markers to visible
            this.setState({
                searchedVenues: leipzigVenues.filter((leipzigVenue) => match.test(leipzigVenue.name)),
                searchedMarkers: markers.filter((marker) => match.test(marker.title))
                                        .forEach((marker) => marker.setVisible(true))
            })
        } else {
            //if no query is entered, all list items and markers are visible by default
            markers.map((marker) => marker.setVisible(true))
            this.setState({
                searchedVenues: leipzigVenues,
                searchedMarkers: markers
            })
        }
    }

  render() {
    const { searchedVenues, markers, leipzigVenues } = this.state
    return (
        <div className="app">
            <ErrorBoundary>
                    <div>
                        <Sidebar
                            leipzigVenues={leipzigVenues}
                            searchedVenues={searchedVenues}
                            markers={markers}
                            searchVenues={this.searchVenues.bind(this)} />
                        <Map />
                    </div>
             </ErrorBoundary>
        </div>
    )}}

/*SOURCE: https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/ AND https://github.com/filamentgroup/loadJS*/
function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
    script.onerror = function() {
        document.write("Map failed to load correctly. Please try again.")
    }
}

export default App;
