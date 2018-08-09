import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Map from './Map';
import ErrorBoundary from './ErrorBoundary';
//import axios from 'axios';
//import escapeRegExp from 'escape-string-regexp';

/* global google */

window.gm_authFailure = function() {
    alert("Oops, something went wrong! Please try again.")
}

class App extends Component {


  render() {
    return (
        <div className="app">
            {/*Route to Sidebar.js*/
            /*Route to Map.js*/}
            <Route exact path="/" render={() => (
                <div>
                    <Sidebar />
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
