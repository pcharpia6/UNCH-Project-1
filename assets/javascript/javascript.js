
// Philip
$( document ).ready(function() {

    // declare these five variables with no value
    
    // declare u with beginning of URL... will be added to later for differet functions
    var u = "https://developers.zomato.com/api/";
    var zheader, version, url, myLocation, searchRes, newRestaurant;
    var restaurants = [];
    
    function makeArray() { // place a callback to the map point creation function inputting the value of the array objects
        console.log("searchresponse is: ", searchRes);
        for (var i=0; i<=8; i++) {
            newRestaurant = {
            restName: searchRes.restaurants[i].restaurant.name,
            restCuis: searchRes.restaurants[i].restaurant.cuisines,
            restLat: searchRes.restaurants[i].restaurant.location.latitude,
            restLon: searchRes.restaurants[i].restaurant.location.longitude,
            restUrl: searchRes.restaurants[i].restaurant.events_url}
            restaurants.push(newRestaurant);
            };
        arrayPushHTML();
        mapCenter();
    }
    
    function arrayPushHTML() {
        for (i=0; i<restaurants.length; i++){
            var newDiv = $("<div>");       
            newDiv.append($("<h5 id='name'>").text(restaurants[i].restName));
            newDiv.append($("<p>").text(restaurants[i].restCuis));
            newDiv.append($("<a href="+restaurants[i].restUrl+" target='_blank'>").text("Visit Website"));
            newDiv.append($("<p>   <p>"));
            $("#restaurants").append(newDiv);
        }
    }
    
    function beginSearch() {
       //function call on var zomato init function with input of key value
        Zomato.init({
           key: "981652a2504d91717090180727e2f6b8"
        });
        // run search function feeding in the object myLocation
        Zomato.search({
            myLocation,
        }, function(searchResponse) {
            searchRes = searchResponse;
            makeArray();
        });
    };
    // declare object Zomato with functions as internal objects
    var Zomato = {
        // initialization using key input from 
        init: function(opts) {
                zheader = {
                    Accept: "text/plain; charset=utf-8",
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-Zomato-API-Key": opts.key
                };
            version = opts.version || "v2.1";
            url = u + version;
        },
        search: function(coords, scb, ecb) {
                this.request({
                    url: url + "/search",
                    headers: zheader,
                    data: {
                        lat: coords.myLocation.lat,
                        lon: coords.myLocation.lon,
                        radius: 16000,
                        count: 9,
                        sort: "real_distance"
                    },
                    success: function(response) {
                        scb(response);
                    },
                    error: function(res) {
                        ecb(res);
                    }
                });
        },
        request: function(opts) {
            var req;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                req = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            req.responseType = 'json';
            if (opts.type === undefined || opts.type === "GET") {
                var q = "?";
                for (var j = 0; j < Object.keys(opts.data).length; j++) {
                    var element = Object.keys(opts.data)[j];
                    q += element + "=" + opts.data[Object.keys(opts.data)[j]];
                    if (j !== Object.keys(opts.data).length - 1) {
                        q += "&";
                    }
                }
                opts.url = opts.url + q;
            }
    
            //setting data
    
            req.open(opts.type === undefined ? "GET" : opts.type, opts.url, true);
            //setting headers
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            if (opts.headers !== undefined || typeof opts.headers === "object") {
                for (var index = 0; index < Object.keys(opts.headers).length; index++) {
                    req.setRequestHeader(Object.keys(opts.headers)[index], opts.headers[Object.keys(opts.headers)[index]]);
                }
            }
            //so many problems with this, what does this do?
            req.onreadystatechange = function() {
                console.log(req.readyState)
                if (req.readyState === 4 && req.status === 200) {
                    opts.success(req.response);
                } else if (req.status === "400" || req.status === "401" || req.status === "403" || req.status === "404") {
                    opts.error(req);
                } else {
    
                }
            };
    
            req.send(opts.type === "GET" ? null : opts.data);
        }
    };
    
    
    //begin use of the getCurrentPosition method
    function getLocation() {
        //using method getCurrentPosition with callback only performed on success, geoSuccess
        navigator.geolocation.getCurrentPosition(geoSuccess);
    };
    //use the returned data to set a variable with object containing coordinates
    function geoSuccess(position) {
        myLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude}
        logMyLocation();
    };
    // prevents attempting to run the search function without having returned the location data
    function logMyLocation() {
        if (!myLocation) {
            getLocation();
        } else {
            beginSearch();
        }
    };
    
    //on page load, perform the getCurrentPosition method via the logMyLocation function
    logMyLocation();
    
    function mapCenter() {
        // centers map to myLocation
        var map = L.map('map',{ center: [myLocation.lat, myLocation.lon], zoom: 14});
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        var myLocationFlag = L.marker([myLocation.lat, myLocation.lon]).addTo(map);
        for ( var i=0; i < restaurants.length; ++i )
        {
         L.marker([restaurants[i].restLat, restaurants[i].restLon])
          .bindPopup("<h5>"+restaurants[i].restName+"</h5>"+"<br>"+"<h6>"+restaurants[i].restCuis+"</h6>")
          .addTo( map );
        };
        
    
    };
    
    //end of document.(ready)
    });
