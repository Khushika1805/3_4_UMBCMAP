import os
os.environ['QTWEBENGINE_DISABLE_SANDBOX'] = '1'
os.environ["QTWEBENGINE_CHROMIUM_FLAGS"] = "--disable-gpu"

import sys
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView

html_content = """
<!DOCTYPE html>
<html>
  <head>
    <title>UMBC Campus Map</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <style>
      /* Full-page map styling */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #map {
        height: 100%;
      }
      /* Search bar container styling */
      #search-container {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 5;
        background: white;
        padding: 5px;
        border-radius: 3px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
      #searchInput {
        width: 300px;
        padding: 5px;
      }
      #searchButton {
        padding: 5px 10px;
      }
    </style>
  </head>
  <body>
    <!-- Search bar -->
    <div id="search-container">
      <input id="searchInput" type="text" placeholder="Search for a building..." />
      <button id="searchButton">Search</button>
    </div>
    <div id="map"></div>
    <script>
      var map;
      var markers = [];
      var infoWindow;

      // Dataset of campus resources (only buildings are searchable in this example)
      var resources = [
        {name: "Academic Building 1", lat: 39.2602, lng: -76.7098, type: "building"},
        {name: "Academic Building 2", lat: 39.2612, lng: -76.7115, type: "building"},
        {name: "Parking Lot A", lat: 39.2610, lng: -76.7100, type: "parking"},
        {name: "Parking Lot B", lat: 39.2615, lng: -76.7120, type: "parking"},
        {name: "UMBC Apartments", lat: 39.2595, lng: -76.7125, type: "apartment"}
        // Add additional resources as needed...
      ];

      function initMap() {
        // UMBC campus center and bounds (adjust as needed)
        var umbcCenter = {lat: 39.2538015, lng: -76.7142732};
        var campusBounds = {
          north: 39.2538015,
          south: 39.2538015,
          west: -76.7142732,
          east: -76.7142732,
        };

        // Create the map, restricting panning to campus bounds
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: umbcCenter,
          restriction: {
            latLngBounds: campusBounds,
            strictBounds: false
          }
        });

        infoWindow = new google.maps.InfoWindow();

        // Place markers for each resource on the map
        resources.forEach(function(resource) {
          var marker = new google.maps.Marker({
            position: {lat: resource.lat, lng: resource.lng},
            map: map,
            title: resource.name
          });
          marker.resource = resource;
          markers.push(marker);

          // When a marker is clicked, show an info window.
          marker.addListener('click', function() {
            infoWindow.setContent(marker.resource.name);
            infoWindow.open(map, marker);
          });
        });

        // Search functionality: search on button click or Enter key
        document.getElementById('searchButton').addEventListener('click', searchBuilding);
        document.getElementById('searchInput').addEventListener('keyup', function(event) {
          if (event.key === 'Enter') {
            searchBuilding();
          }
        });
      }

      // Searches for a building in the dataset and centers the map on it if found.
      function searchBuilding() {
        var query = document.getElementById('searchInput').value.toLowerCase();
        var found = markers.filter(function(marker) {
          return marker.resource.type === "building" &&
                 marker.resource.name.toLowerCase().includes(query);
        });
        if(found.length > 0) {
          var marker = found[0];
          map.setCenter(marker.getPosition());
          map.setZoom(18);
          infoWindow.setContent(marker.resource.name);
          infoWindow.open(map, marker);
        } else {
          alert("No matching building found.");
        }
      }
    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCvd4ccDAWW8HsuKMYg7aqLgcQzpdFZm2Q&callback=initMap"></script>
  </body>
</html>
"""

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("UMBC Campus Map")
        self.setGeometry(100, 100, 800, 600)
        self.browser = QWebEngineView()
        self.browser.setHtml(html_content)
        self.setCentralWidget(self.browser)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())