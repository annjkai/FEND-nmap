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
        //sets the state to contain all mapPoints & markers by default
        this.setState({
            searchedMapPoints: this.state.mapPoints,
            searchedMarkers: this.state.markers
         })
    }

    initMap = () => {
        let map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 51.3397, lng: 12.3731},
            zoom: 13
        })

        let { mapPoints, searchedMapPoints, markers } = this.state
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

            const listItemId = document.getElementById(mapPoint.id)

            //event listener to activate markers when list item is clicked
            /*google.maps.event.addDomListener(listItemId, 'click', function() {
                fillInfoWindow(marker, mapInfoWindow)
                marker.setAnimation(google.maps.Animation.BOUNCE)
                setTimeout(function() {
                    marker.setAnimation(null)
                }, 100)
            })*/

            //push markers to state
            markers.push(marker)

            return ''
            /*still in map method*/
        })

        //create infowindow
        const mapInfoWindow = new google.maps.InfoWindow()

        //populate infowindow
        function fillInfoWindow (marker, infowindow) {
            //check whether infowindow is already open
            if (infowindow.marker !== marker) {
                infowindow.marker = marker
                infowindow.setContent('<div>' + marker.title + '</div>')
                infowindow.open(map, marker)
                //clear marker prop when infowindow is closed
                infowindow.addListener('closeclick', function() {
                    infowindow.setMarker = null
                })
            }
        }
        //end fillInfoWindow
    }
    /****END INITMAP****/

    //filters through points of interest & updates UI based on result
    searchMapPoints = (query) => {
        this.setState({ query })
        let { mapPoints, markers } = this.state
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            this.setState({
                searchedMapPoints: mapPoints.filter((mapPoint) => match.test(mapPoint.title)),
                searchedMarkers: markers.filter((marker) => match.test(marker.title))
            })

            this.toggleMarkerVisibility()

        } else {
            this.setState({
                searchedMapPoints: mapPoints,
                searchedMarkers: markers
            })
            //else hide marker
            //this.toggleMarkerVisibility()
        }
    }

    toggleMarkerVisibility = (searchedMarkers, markers) => {
        //console.log("searched markers " + searchedMarkers);
        //console.log("markers " + markers);
        //console.log(markers.getId("001"));
    }

    /*
    Show all markers by default
    As list items get filtered, check if they share id with marker.
    If they DO NOT share id with lit item, hide them/toggle visibility to false
    If they DO share id, keep displaying
    (Restore visibility once they share id)
    */

  render() {
    let { mapPoints, searchedMapPoints, markers } = this.state
    return (
        <div className="app">
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
