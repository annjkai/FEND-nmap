import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import * as pois from './pois.json';
import Sidebar from './Sidebar';
import Map from './Map';
import ErrorBoundary from './ErrorBoundary';
import escapeRegExp from 'escape-string-regexp';

//import axios from 'axios';
/* global google */

//handle potential problems with faulty Google Maps API keys
window.gm_authFailure = function() {
    alert("Oops, something went wrong! Please try again.")
}

class App extends Component {
    state = {
        map: '',
        markers: [],
        //mapPoints: pois,
        searchedMapPoints: [],
        searchedMarkers: [],
        query: '',
        leipzigVenues: []
    }

    componentDidMount() {
        window.initMap = this.initMap
        //async loading of the Google Maps script
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAvTTYIbLSapu-D1mVwX7NWEaJ_FqRF06s&v=3&callback=initMap')
        //gets API data
        this.getFoursquareData()
        //sets the state to contain all mapPoints & markers by default
        /*this.setState({
            //searchedMapPoints: this.state.leipzigVenues,
            searchedMarkers: this.state.markers
         })*/
         console.log("#1 mounted");
    }

    //https://api.foursquare.com/v2/venues/search?ll=51.3397,12.3731&intent=browse&radius=1000&query=sights&client_id=E50QB5BVVUKE0MJPO1ZRAI3CJ0OC5ZLF5IGCZRYABTC2LYTI&client_secret=TQ45PRDSPDAN21YQQEIZ3YEDRS3EQLV1GQLCHVHWAA4AGVET&v=20181408

    /*getFoursquareData = (query, location) => {
        let endPoint = "https://api.foursquare.com/v2/venues/explore?"
        let params = {
            client_id: "E50QB5BVVUKE0MJPO1ZRAI3CJ0OC5ZLF5IGCZRYABTC2LYTI",
            client_secret: "TQ45PRDSPDAN21YQQEIZ3YEDRS3EQLV1GQLCHVHWAA4AGVET",
            query: query,
            near: location,
            v: "20181408"
        }
        axios.get(endPoint + new URLSearchParams(params)).then(response => {
            this.setState({
                mapPoints: response.data.response.groups[0].items
            }, this.initMap)
        })
    }
    `${api_call}?ll=${latlng}&client_id=${client_id}&client_secret=${client_secret}&v=${version}`
    */

    //https://stackoverflow.com/questions/45561968/set-fetched-json-data-as-state-and-use-it
    getFoursquareData = () => {
        let { leipzigVenues } = this.state

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
                .then(data => this.setState({ leipzigVenues: data.response.venues }))
                .catch(error => console.log(error))

            console.log("#2 data fetched");
    }

    /*fetch(`https://api.foursquare.com/v2/venues/search?ll=${latlng}&client_id=${client_id}&client_secret=${client_secret}&v=${version}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .then(function(data) {
            let foursquareVenues = data
            console.log(foursquareVenues);
        })
        .catch(error => console.log(error))
        .then(function(data) {
            console.log(data.response.venues);
            let venues = []
            venues.push(data.response.venues)
            this.setState({ foursqVenues: venues })
        })*/

        //this.setState({ mapPoints })

        /*
        const latlng = "51.3397,12.3731"
        const client_id = "E50QB5BVVUKE0MJPO1ZRAI3CJ0OC5ZLF5IGCZRYABTC2LYTI"
        const client_secret = "TQ45PRDSPDAN21YQQEIZ3YEDRS3EQLV1GQLCHVHWAA4AGVET"
        const version = "20181408"
        fetch(`https://api.foursquare.com/v2/venues/${venue_id}/photos?ll=${latlng}&client_id=${client_id}&client_secret=${client_secret}&v=${version}`)
        fetch(`https://api.foursquare.com/v2/venues/51b22def498e305edda50fa1/photos?ll=${latlng}&client_id=${client_id}&client_secret=${client_secret}&v=${version}`)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => alert("Failed to fetch photos. Please try again"))
            .catch(error => console.log("Something went wrong. Please try again later."))
            .then(data => {
                console.log(data)
                this.setState({ foursquareData: data })
            })
            */

        //const api_call = `https://api.foursquare.com/v2/venues/${mapPoints.venueID}/photos`

        //fetch("https://api.foursquare.com/v2/venues/search?ll=51.3397,12.3731&client_id=E50QB5BVVUKE0MJPO1ZRAI3CJ0OC5ZLF5IGCZRYABTC2LYTI&client_secret=TQ45PRDSPDAN21YQQEIZ3YEDRS3EQLV1GQLCHVHWAA4AGVET&v=20181408")

    initMap = () => {
        let map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 51.3397, lng: 12.3731},
            zoom: 13
        })
        //access state
        let { searchedMapPoints, markers } = this.state

        //mapPoints.map((mapPoint)
        searchedMapPoints.map((mapPoint, index) => {
            //get data from mapPoints
            const mapPointPosition = mapPoint.location
            const mapPointTitle = mapPoint.title

            //initialize animated markers
            let marker = new google.maps.Marker({
                map: map,
                position: mapPointPosition,
                title: mapPointTitle,
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
            return ''
        })

        //create infowindow
        const mapInfoWindow = new google.maps.InfoWindow()

        //populate infowindow
        function fillInfoWindow (marker, infowindow) {
            let infoWindowContent = `<h4>${marker.title}</h4>`

            //<img id="infowindow-image"></im>

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
        console.log("#3 init map");
    }
    /****END INITMAP****/

    //filters through points of interest & updates UI based on result
    searchMapPoints = (query) => {
        this.setState({ query })
        //access state
        let { markers, leipzigVenues } = this.state
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            //set markers to not visible to start - thanks to Mariola Karpiewska for her help with this
            markers.forEach((marker) => {
                marker.setVisible(false)
            })
            //update state based on matches, set matching markers to visible
            this.setState({
                searchedMapPoints: leipzigVenues.filter((leipzigVenue) => match.test(leipzigVenue.name))
            })
        } else {
            //if no query is entered, all list items and markers are visible by default
            markers.map((marker) => marker.setVisible(true))
            this.setState({
                searchedMapPoints: leipzigVenues,
                searchedMarkers: markers
            })
        }
        console.log("#4 searched something");
    }

  render() {
    let { searchedMapPoints, markers, leipzigVenues } = this.state

    console.log();
    /*leipzigVenues.map((leipzigVenue) => {
        console.log(leipzigVenue.name);
    })*/
    return (
        <div className="app">
            <ErrorBoundary>
                {/*Route to Sidebar.js*/
                /*Route to Map.js*/}
                <Route exact path="/" render={() => (
                    <div>
                        <Sidebar
                            searchedMapPoints={searchedMapPoints}
                            leipzigVenues={leipzigVenues}
                            markers={markers}
                            searchMapPoints={this.searchMapPoints.bind(this)} />
                        <Map />
                    </div>
                )} />
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
