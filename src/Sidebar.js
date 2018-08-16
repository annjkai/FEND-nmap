import React, { Component } from 'react';
import './App.css';

class Sidebar extends Component {

    /*check whether the marker and the mapPoint share a title - if yes, call marker animation on list item click via onChange method, see here for "event.trigger": https://github.com/hpneo/gmaps/issues/40*/
    markerAnimation (leipzigVenues) {
        const { markers } = this.props
        markers.forEach(function (marker) {
            marker.title === leipzigVenues ? window.google.maps.event.trigger(marker, 'click') : ''
        })
    }

    render() {
        const { searchVenues, query, searchedVenues } = this.props
        return (
            <div className="sidebar-container" role="menu">
                <h1 className="main-heading" aria-label="Welcome to Leipzig heading">Welcome to Leipzig!</h1>
                {/*Atom's highlighting syntax for JSX is pretty borked, that's why I used `&#39;` instead of an apostrophe*/}
                <p className="sub-heading">Discover the best museums in Goethe&#39;s "Little Paris"</p>

                {/*third-party API attribution*/}
                <div className="sidebar-attribution" tabIndex="-1">
                    <p>Third-party data provided by Google Maps</p>
                    <p> and Foursquare</p>
                </div>

                {/*search bar*/}
                <div className="search-places">
                    <div className="search-places-bar">
                        <div className="search-places-input"
                             tabIndex="0">
                            <input
                                type="text"
                                placeholder="Search for museums"
                                aria-label="Search for museums"
                                role="search"
                                value={query}
                                onChange={(event) => searchVenues(event.target.value)}
                                />
                        </div>
                    </div>
                </div>

                {/*list of places*/}
                <div className="sidebar-places-container" role="listbox">
                    <ul className="sidebar-places-list">
                            {searchedVenues.map((leipzigVenue) =>
                                <li key={leipzigVenue.id}>
                                    <a role="listitem"
                                       tabIndex="0"
                                       onClick={(event) => this.markerAnimation(leipzigVenue.name)}>
                                       {leipzigVenue.name}
                                    </a>
                                </li>
                            )}
                    </ul>
                </div>

                {/*Third-party API attribution
                <div className="sidebar-attribution" tabIndex="-1">
                    <p>Third-party data provided by Google Maps</p>
                    <p> and Foursquare</p>
                    <p>Annika Kaiser &copy; 2018</p>
                </div>*/}
            </div>
        )
    }
}

export default Sidebar;
