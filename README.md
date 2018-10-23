## Neighborhood Map Project Overview

<<<<<<< HEAD
**Project acceptance date: 16 August 2018**
**[Live preview](https://ajk-neighborhood-map.netlify.com/)**

||||||| merged common ancestors
=======
**Project acceptance date: 16 August 2018**

>>>>>>> 268ceaf5da4589d9ab868cbb56776b52ae98bebe
The Udacity Neighborhood Map project is the final Front-end Web Development Nanodegree project. The task was to create a Neighborhood Map from scratch using React. For this purpose, this project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The app allows users and visitors to Leipzig to find the locations of museums located in or around the centre of the City of Leipzig in Saxony, Germany. Users can interact with both the listed museums and the map markers, and can search for museums by entering queries.

## Instructions for Use

1. Download or clone this repository
2. Install all project dependencies with `npm install`
3. Start the development server with `npm start`

## Caching and the Service Worker

`create-react-app` comes with a built-in service worker, although it is only available in production mode. To work in production mode:
1. Run `npm run build`
This will create a build version of the app that caches the page and renders visited pages even when there is no network access.

## Third-party Data & Dependencies
### APIs
As part of the project requirements, I used the [Google Maps API](https://cloud.google.com/maps-platform/) as well as the [Foursquare API](https://developer.foursquare.com/).
### Packages
* `create-react-app`
* `escape-string-regexp`

## To Do

While the project makes use of third-party data, it is still rather static. In future, I would like to list all Leipzig museums, and make the list searchable via category. I would also like to include more useful data in the info windows, and allow user to look up directions.

## Thank You

This was an extremely challenging project, and the help and advice of fellow Scholarship recipients was priceless. I wanted to thank by name
* Mariola Karpiewska, who helped me work through marker filtering
* David Garrood, who was an early cheerleader for this project
* Eman Zaghloul, for her excellent study jam and patient explanations
* Alain Cadenat, for his marvelous error handling
* Antje Lemberg, who patiently walked me through some tricky React stuff
* and Bram Vanroy, who swooped in at the last and saved my sanity when everything seemed irreversibly synchronous

In addition, this guide was absolutely invaluable in making the map work in React without using a package:
[Making Google Maps work with React](https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/)
