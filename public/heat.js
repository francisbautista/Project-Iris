urlParam = function(name){
  try{
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results[1] || 0;
  }catch(e){}
}

var NB_TWEETS=5;
var hover_bubble=[];
var showTweets=true;
var socket=null;
window.onload = function() {

  var baseLayer = L.tileLayer(
  'https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 20,
    id: 'francisbautista.cifswiqrh0b41uwkr15e0tnf3',
    accessToken: 'pk.eyJ1IjoiZnJhbmNpc2JhdXRpc3RhIiwiYSI6ImNpZnN3aXNhbzBiZDh1amx4YTVwODliY2QifQ.Du-sSfOon7A7Jk-1AmM41w'
  });

  var cfg = {
    "radius": 5,
    "maxOpacity": .9,
    "scaleRadius": false,
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  };

  heatmapLayer = new HeatmapOverlay(cfg);
  map = new L.Map('map-canvas', {
    center: new L.LatLng(14.56438, 121.03675),
    zoom:   12,
    minZoom:5,
    layers: [baseLayer, heatmapLayer]
  });
  map.on('zoomend',updateSocket);
  map.on('dragend',updateSocket);
  if(bounds=urlParam('bounds')){
    rect=JSON.parse(bounds);
    map.fitBounds(L.latLngBounds([rect[1],rect[0]],[rect[3],rect[2]]));
  }
  // All of this to add a simple button on top of the map
  MyControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'my-custom-control');
      controlUI = L.DomUtil.create('button', 'toggle-tweet', container);
      return container;
    }
  });
  map.addControl(new MyControl());
  var myBut=$(".toggle-tweet")
  myBut.text("Hide");
  myBut.click(toggleTweets);
  // End of button extra

  for(var i=0;i<NB_TWEETS;i++){
    hover_bubble.push(new L.Popup({ offset: new L.Point(0,-10), closeButton: true, autoPan: false, closeOnClick: true }));
  }
  startSocket();
};

function addPoint(tweet)
{
  var test = tweet.text.toLowerCase();
  if(test.indexOf("debate") >= 0){
    console.log(test);
    if(tweet.geo){
      pt={lng:tweet.geo.coordinates[1],lat:tweet.geo.coordinates[0],count:1};
      if(showTweets){
        bubble=hover_bubble.shift();

        // bubble.setContent(tweet.text)
        // bubble.setContent("<img src="+tweet.user.profile_image_url+" class=\"image\"></img><div class=\"textbody\">"+"<b class=\"username\">@"+tweet.user.screen_name+" " + "</b>"+tweet.text+"</div>")
        // bubble.setContent("<div class=\"row col-md-12 box\"><div class=\"col-md-4\"><img src="+tweet.user.profile_image_url+" align=center  class=\"img-responsive image\" ></div><div class=\"col-md-6\"><b class=\"username\">@"+tweet.user.screen_name+"</b><div class= \"textbody\">"+tweet.text+"</div></div>")
        bubble.setContent("<div class=\"box\"><div class=\"image\"><img src="+tweet.user.profile_image_url+"></div><div class=\"text\"><b>@"+tweet.user.screen_name+"</b><br>"+tweet.text+"</div></div>")
        .setLatLng(tweet.geo.coordinates)
        .addTo(map);
        hover_bubble.push(bubble);
      }
      heatmapLayer.addData(pt);
    }
  }
}

function toggleTweets()
{
  showTweets=!showTweets;
  console.log(showTweets);
}

function updateSocket(){
  window.history.pushState("TweetOMap","TweetOMap","/?bounds=["+map.getBounds().toBBoxString()+"]");
  if(socket)socket.emit("recenter",map.getBounds().toBBoxString());
}
function startSocket(){
  socket = io.connect('/', {query: "bounds=["+map.getBounds().toBBoxString()+"]"});
  socket.on('stream', function(tweet){
    addPoint(tweet);
  });
  socket.on('reconnect',function(){
    console.log("Reconnect");
    updateSocket();
  });
}
