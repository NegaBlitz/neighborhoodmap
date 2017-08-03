# Neighborhood Map 1.0
This is a neighborhood map application that displays several restaurants in Charlotte, NC, and then displays recent news articles about those places. This application uses knockout.js and the New York times API.

Clicking on the icon and/or list will pan to it and display news links while also animating the marker. So far I haven't found any errors in the code-base with this version!

## How to run:
Simply run the index.html file in your browser. Some files (```map.js```, ```map-old.js```, ```app.js```) are older versions. ```app-new.js``` is the file you want to look at for most of my logic!

#### Sources for code:
CSS-Only Nav Menu: https://www.sitepoint.com/pure-css-off-screen-navigation-menu/
A lot of the map code: Udacity API Coursework (Google Maps API)
Utility Functions for Knockout: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html

#### Other notes:
Requesting the NY Times API too much at once will cause it to not load articles, but this also displays how the error handling for that API is working. This seems to not be something I can fix, but if you simply wait a moment and come back to it, the articles should appear.