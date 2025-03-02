let myMap = L.map("map", {
  center: [39.5501, -111.5472], // Centered on the approximate center of Utah
  zoom: 6 // Adjust the zoom level as needed
});


// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Use this link to get the GeoJSON data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Define depth range colors (customize as needed)
const depthColors = {
  "-10-10": "#8CCB55",
  "10-30": "#D1E055",
  "30-50": "#FCE94F",
  "50-70": "#FCAF3E",
  "70-90":"#EF2929",
  "90+": "#CC0000"
};


// Function to set marker style based on depth
function getMarkerStyle(depth) {
  if (depth >= -10 && depth <= 10) return depthColors["-10-10"];
  else if (depth > 10 && depth <= 30) return depthColors["10-30"];
  else if (depth > 30 && depth <= 50) return depthColors["30-50"];
  else if (depth > 50 && depth <= 70) return depthColors["50-70"];
  else if (depth > 70 && depth <= 90) return depthColors["70-90"];
  else return depthColors["90+"]; // Default color for unknown depths
}


// Function to set marker style based on depth
function getMarkerStyle(depth) {
  if (depth >= -10 && depth <= 10) return depthColors["-10-10"];
  else if (depth > 10 && depth <= 30) return depthColors["10-30"];
  else if (depth > 30 && depth <= 50) return depthColors["30-50"];
  else if (depth > 50 && depth <= 70) return depthColors["50-70"];
  else if (depth > 70 && depth <= 90) return depthColors["70-90"];
  else return depthColors["90+"]; // Default color for unknown depths
}


// Getting GeoJSON data and adding it to the map
fetch(link).then(response => response.json()).then(data => {
  L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
          // Create a circle marker with size based on magnitude
          let markerSize = feature.properties.mag * 4;
         
          // Get the marker color based on depth
          let markerColor = getMarkerStyle(feature.geometry.coordinates[2]);


          // Create the circle marker and bind a tooltip
          return L.circleMarker(latlng, {
              radius: markerSize,
              fillColor: markerColor,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
          }).bindTooltip(
              `<strong>Magnitude:</strong> ${feature.properties.mag}<br>` +
              `<strong>Location:</strong> ${feature.properties.place}<br>` +
              `<strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
          );
      }
  }).addTo(myMap);
});


// Create a legend
let legend = L.control({ position: "bottomright" });


// Modify the legend.onAdd function with the new block of code
legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "info legend");
  div.style.backgroundColor = 'white'; // Set the background to white
  div.style.padding = '9px'; // Add some padding
  div.style.border = '1px solid #ddd'; // Add a border
  div.style.borderRadius = '4px'; // Optional: rounded corners
  div.style.width = '90px'; // Set a specific width if needed
  div.style.height = 'auto'; // Set height to auto to expand based on content
  div.innerHTML += '<h4>Depth</h4>';


  // Add legend entries for depth ranges
  for (let range in depthColors) {
      div.innerHTML +=
          `<i style="background: ${depthColors[range]}; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ` +
          `<span style="line-height: 18px;">${range}</span><br>`;
  }
 
  return div;
};


legend.addTo(myMap);
