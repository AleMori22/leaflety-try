

let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;


// Create the createMap function.
function createMap(bikeStations){

  // Create the tile layer that will be the background of our map.
  let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the lightmap layer.
  let baseMap = {
    "street Map" : streetMap
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps ={
    "Bike Stations" : bikeStations
  };

  // Create the map object with options.
  let myMap = L.map("map-id",{
    center : newYorkCoords,
    zoom : 15,
    layers : [streetMap , bikeStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMap,overlayMaps,{
    collapsed : false
  }).addTo(myMap);

}



// Create the createMarkers function.
function createMarkers(response){

  // Pull the "stations" property from response.data.
  let stations = response.data.stations;
  let AVD = d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json");

  AVD.then(function(avalabilityDataResponse){
    
    let avalabilityData = avalabilityDataResponse.data.stations;

    // Initialize an array to hold the bike markers.

    let bikeMarkers = [];

    let redpentabikeMarkers = [];

    let redcirclebikeMarkers = [];

    let orangecirclebikeMarkers = [];

    let yellowcirclebikeMarkers = [];



    // Loop through the stations array.
    for(let i = 0; i < stations.length; i++) {

      let station = stations[i];

      let avalability = avalabilityData.find(item => item.station_id === station.station_id);

      // Check if the stations are matched in the two dataframes

        if (avalability){

          // Setup the variable for the Red Penta Markers for stations not installled yet

          if (avalability.is_installed == 0){

            let redpentaMarker = L.ExtraMarkers.icon({
              icon: 'fa-coffee',
              markerColor: 'red',
              shape: 'penta',
              prefix: 'fa'
            });
            
            let RedPentabikeMarker = L.marker([station.lat,station.lon],{icon: redpentaMarker}).bindPopup(
              `<h3> Station: ${station.name} </h3> 
              <br>  
              <h3>Capacity: ${station.capacity} </h3> 
              <br>  
              <h3>Bikes Avalible: ${avalability.num_bikes_available} </h3>`
  
            );

            redpentabikeMarkers.push(RedPentabikeMarker);

            let redPMarkerLayer = L.layerGroup(redpentabikeMarkers);

          } else 
          
          // Setup the variable for the Red Circle Markers for bike station with no bikes

          if (avalability.num_bikes_available == 0){

              let RedCircleMarker = L.ExtraMarkers.icon({
                icon: 'fa-coffee',
                markerColor: 'red',
                shape: 'circle',
                prefix: 'fa'

              });
              
              let RedCirclebikeMarker = L.marker([station.lat,station.lon],{icon: RedCircleMarker}).bindPopup(
                `<h3> Station: ${station.name} </h3> 
                <br>  
                <h3>Capacity: ${station.capacity} </h3> 
                <br>  
                <h3>Bikes Avalible: ${avalability.num_bikes_available} </h3>`
    
              );
  
              redcirclebikeMarkers.push(RedCirclebikeMarker);

              let redCMarkerLayer = L.layerGroup(redcirclebikeMarkers)

            }else 
            
            // Setup the variable for the Orange Circle Markers for bike station not renting

            if (avalability.is_renting == 0){

              let OrangeCircleMarker = L.ExtraMarkers.icon({
                icon: 'fa-coffee',
                markerColor: 'orange',
                shape: 'circle',
                prefix: 'fa'

              });
              
              let OrangeCirclebikeMarker = L.marker([station.lat,station.lon],{icon: OrangeCircleMarker}).bindPopup(
                `<h3> Station: ${station.name} </h3> 
                <br>  
                <h3>Capacity: ${station.capacity} </h3> 
                <br>  
                <h3>Bikes Avalible: ${avalability.num_bikes_available} </h3>`
    
              );
  
              orangecirclebikeMarkers.push(OrangeCirclebikeMarker);

              let orangeMarkerLayer = L.layerGroup(orangecirclebikeMarkers);

            }else 

            // Setup the variable for the Yellow Circle Markers for bike station Low stations

            if (avalability.is_renting == 0){

              let YellowCircleMarker = L.ExtraMarkers.icon({
                icon: 'fa-coffee',
                markerColor: 'yellow',
                shape: 'circle',
                prefix: 'fa'

              });
              
              let YellowCirclebikeMarker = L.marker([station.lat,station.lon],{icon: YellowCircleMarker}).bindPopup(
                `<h3> Station: ${station.name} </h3> 
                <br>  
                <h3>Capacity: ${station.capacity} </h3> 
                <br>  
                <h3>Bikes Avalible: ${avalability.num_bikes_available} </h3>`
    
              );
  
              yellowcirclebikeMarkers.push(YellowCirclebikeMarker);

              let yellowMarkerLayer = L.layerGroup(yellowcirclebikeMarkers);

            }else {
            
            // For each station, create a marker, and bind a popup with the station's name.

            let BluCircleMarker = L.ExtraMarkers.icon({
              icon: 'fa-coffee',
              markerColor: 'blu',
              shape: 'circle',
              prefix: 'fa'

            });

            let bikeMarker = L.marker([station.lat,station.lon],{icon: BluCircleMarker}).bindPopup(
              `<h3> Station: ${station.name} </h3> 
              <br>  
              <h3>Capacity: ${station.capacity} </h3> 
              <br>  
              <h3>Bikes Avalible: ${avalability.num_bikes_available} </h3>`
  
            );
  
            // Add the marker to the bikeMarkers array.
            bikeMarkers.push(bikeMarker);
          }

        }
    }

    // Create the map


    let blueMarkerLayer = L.layerGroup(bikeMarkers)
    

    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object to hold the lightmap layer.
    let baseMap = {
      "street Map" : streetMap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps ={
      "Bike Stations" : blueMarkerLayer//,
      //"Non installed": redPMarkerLayer,
      //"Out of bikes":,

    };
  
    // Create the map object with options.
    let myMap = L.map("map-id",{
      center : newYorkCoords,
      zoom : 15,
      layers : [streetMap , blueMarkerLayer]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMap,overlayMaps,{
      collapsed : false
    }).addTo(myMap);

  });

}


// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);



// Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  //createMap(L.layerGroup(bikeMarkers));


