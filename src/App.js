import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import * as pois from './pois.json';
import Sidebar from './Sidebar';
import Map from './Map';
import ErrorBoundary from './ErrorBoundary';
import escapeRegExp from 'escape-string-regexp';

import axios from 'axios';
/* global google */

window.gm_authFailure = function() {
    alert("Oops, something went wrong! Please try again.")
}

class App extends Component {
    state = {
        map: '',
        markers: [],
        mapPoints: pois,
        searchedMapPoints: [],
        searchedMarkers: [],
        query: ''
    }

    componentDidMount() {
        window.initMap = this.initMap
        //async loading of the Google Maps script
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAvTTYIbLSapu-D1mVwX7NWEaJ_FqRF06s&v=3&callback=initMap')
        //gets API data
        this.getFoursquareData("sights", "leipzig")
        //sets the state to contain all mapPoints & markers by default
        this.setState({
            searchedMapPoints: this.state.mapPoints,
            searchedMarkers: this.state.markers
         })
    }

    getFoursquareData = (query, location) => {
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
            //check whether infowindow is already open
            if (infowindow.marker !== marker) {
                infowindow.marker = marker
                infowindow.setContent(
                    `<h4 id="infowindow-title">${marker.title}</h4>`
                )
                infowindow.open(map, marker)
                //clear marker prop when infowindow is closed
                infowindow.addListener('closeclick', function() {
                    infowindow.setMarker = null
                })
            }
        }
    }
    /****END INITMAP****/

    //filters through points of interest & updates UI based on result
    searchMapPoints = (query) => {
        this.setState({ query })
        //access state
        let { mapPoints, markers } = this.state
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            //set markers to not visible to start - thanks to Mariola Karpiewska for her help with this
            markers.forEach((marker) => {
                marker.setVisible(false)
            })
            //update state based on matches, set matching markers to visible
            this.setState({
                searchedMapPoints: mapPoints.filter((mapPoint) => match.test(mapPoint.title)),
                searchedMarkers: markers.filter((marker) => match.test(marker.title))
                                        .forEach((marker) => marker.setVisible(true))
            })
        } else {
            //if no query is entered, all list items and markers are visible by default
            markers.map((marker) => marker.setVisible(true))
            this.setState({
                searchedMapPoints: mapPoints,
                searchedMarkers: markers
            })
        }
    }

  render() {
    let { mapPoints, searchedMapPoints, markers } = this.state
    return (
        <div className="app">
            <ErrorBoundary>
                {/*Route to Sidebar.js*/
                /*Route to Map.js*/}
                <Route exact path="/" render={() => (
                    <div>
                        <Sidebar
                            mapPoints={mapPoints}
                            searchedMapPoints={searchedMapPoints}
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
