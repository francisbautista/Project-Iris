Project Iris
=========
 http://iris.francisbautista.me

Project Iris streams tweets over a certain geographic region (currently the Philippines) in real-time and plots them on a mapbox basemap.

TODO:
- Allow UI for editing Twitter and Mapbox keys.
- Enable dynamic bounding-box selection with keyword-based filtering.
- Improve styling for navbar and filtering
- Scale streaming to use leaflet-realtime.

![Alt text](/img/screenie.png "Screenshot")


How To
====
Right now, Iris is still under heavy development (see TODO). If you really want to use Iris, just go to the tweet.js file to change the bounding-box that filters the Twitter stream. You'll also need to provide your own API keys. You can get those API keys from your Twitter application.

```
consumer_key:    "YOUR CONSUMER KEY",
consumer_secret: "YOUR CONSUMER SECRET",
access_token:    "YOUR ACCESS TOKEN",
access_token_secret:"YOUR ACCESS TOKEN SECRET"
```

You'll also need to provide your own Mapbox API key. Just paste it in heat.js.

```
var baseLayer = L.tileLayer(
'https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token={accessToken}', {
  maxZoom: 20,
  id: 'YOUR ID',
  accessToken: 'YOUR ACCESS TOKEN'
});
```

License
====
Project Iris is released under the [MIT License](MIT License).
