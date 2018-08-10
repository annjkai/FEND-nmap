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
        //map: ''
        mapPoints: pois,
        searchedMapPoints: [],
        query: ''
    }

    componentDidMount() {
        this.setState({ searchedMapPoints: this.state.mapPoints })
    }

    //filters through points of interest
    searchMapPoints = (query) => {
        this.setState({ query })
        let { mapPoints } = this.state
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            this.setState({searchedMapPoints: mapPoints.filter((mapPoint) => match.test(mapPoint.title))})
        } else {
            this.setState({searchedMapPoints: mapPoints})
        }
    }

  render() {
    let { mapPoints, searchedMapPoints } = this.state
    return (
        <div className="app">
            {/*Route to Sidebar.js*/
            /*Route to Map.js*/}
            <Route exact path="/" render={() => (
                <div>
                    <Sidebar
                        mapPoints={mapPoints}
                        searchedMapPoints={searchedMapPoints}
                        searchMapPoints={this.searchMapPoints.bind(this)}
                         />
                    <Map />
                </div>
            )} />
        </div>
    )}}

/*SOURCE: https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/ AND https://github.com/filamentgroup/loadJS
function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
    script.onerror = function() {
        document.write("Map failed to load correctly. Please try again.")
    }
}*/

export default App;
