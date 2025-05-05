
var map;
var infoWindow;
var searchMarker = null;
var directionsService;
var directionsRenderer;
var routePolyline = null;
var liveTrackerMarker = null;
var liveTrackId = null;
var currentDestination = null;

var mapStyle = [
  { "featureType": "all", "stylers": [{ "saturation": -50 }, { "lightness": 5 }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "hue": "#007fff" }, { "saturation": 30 }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#a1c4fd" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "simplified" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "simplified" }] }
];

var resources = [
  {name: "Administration Building", lat: 39.2531345925294, lng: -76.71347729482584, type: "building"},
  {name: "Biological Sciences Building", lat: 39.254849754482905, lng: -76.71216394549019, type: "building"},
  {name: "Engineering Building", lat: 39.25459147395124, lng: -76.71394113645626, type: "building"},
  {name: "Fine Arts Building", lat: 39.255124176513945, lng: -76.71344602460354, type: "building"},
  {name: "Information Technology/Engineering Building (ITE)", lat: 39.25388926895672, lng: -76.71424341527158, type: "building"},
  {name: "Interdisciplinary Life Sciences Building", lat: 39.25400226793664, lng: -76.71117372178459, type: "building"},
  {name: "Lecture Hall 1", lat: 39.25480087119909, lng: -76.71180461156199, type: "building"},
  {name: "Math & Psychology Building", lat: 39.25419598005312, lng: -76.7124558008981, type: "building"},
  {name: "Meyerhoff Chemistry Building", lat: 39.25509592722537, lng: -76.71297175956568, type: "building"},
  {name: "Performing Arts & Humanities Building", lat: 39.25519681746061, lng: -76.71518152193991, type: "building"},
  {name: "Physics Building", lat: 39.25456726011072, lng: -76.70968317452288, type: "building"},
  {name: "Public Policy Building", lat: 39.25526542273386, lng: -76.70912031052184, type: "building"},
  {name: "Sherman Hall", lat: 39.25364052669565, lng: -76.71343945351701, type: "building"},
  {name: "Sondheim Hall", lat: 39.25340561557563, lng: -76.71278482573884, type: "building"},

  //Residence Halls
  {name: "Chesapeake Hall", lat: 39.25687893630186, lng: -76.70875000274847, type: "building"},
  {name: "Erickson Hall", lat: 39.25727717200658, lng: -76.7096991644804, type: "building"},
  {name: "Harbor Hall", lat: 39.25725643436356, lng: -76.70855034946922, type: "building"},
  {name: "Patapsco Hall", lat: 39.25511261551515, lng: -76.70673034606496, type: "building"},
  {name: "Potomac Hall", lat: 39.25592179394622, lng: -76.70662380096735, type: "building"},
  {name: "Susquehanna Hall", lat: 39.255667709158324, lng: -76.70852374142676, type: "building"},
  
  //Hillside Apartments
  {name: "Breton (BRE)", lat: 39.25811451453474, lng: -76.70870020973896, type: "apartment"},
  {name: "Casselman (CAS)", lat: 39.25808347910413, lng: -76.70911843619129, type: "apartment"},
  {name: "Deep Creek (DPC)", lat: 39.257804165154724, lng: -76.70889646244552, type: "apartment"},
  {name: "Elk (ELK)", lat: 39.2578236857414, lng: -76.70944170055807, type: "apartment"},
  {name: "Manokin (MAN)", lat: 39.25865265250737, lng: -76.70921315106378, type: "apartment"},
  {name: "Patuxent (PTX)", lat: 39.258248001680144, lng: -76.70958458959169, type: "apartment"},
  {name: "Pocomoke (POC)", lat: 39.25837174383032, lng: -76.70915233488866, type: "apartment"},
  {name: "Sideling (SDL)", lat: 39.258430670918905, lng: -76.7087945113401, type: "apartment"},

  //West Hill Apartments
  {name: "Chester (CHS)", lat: 39.258929036462554, lng: -76.71177279276453, type: "apartment"},
  {name: "Choptank (CHO)", lat: 39.25873771708078, lng: -76.71305333025757, type: "apartment"},
  {name: "Magothy (MAG)", lat: 39.25923195099986, lng: -76.71264422852721, type: "apartment"},
  {name: "Tangier (TAN)", lat: 39.25892359359358, lng: -76.71278523526696, type: "apartment"},
  {name: "Wye (WYE)", lat: 39.258658059357025, lng: -76.71249656635479, type: "apartment"},

  //Terrace Apartments
  {name: "Antietam (ANT)", lat: 39.257781077560786, lng: -76.71013967450138, type: "apartment"},
  {name: "Chincoteague (CHI)", lat: 39.25757168681329, lng: -76.71042986262079, type: "apartment"},
  {name: "Gunpowder (GUN)", lat: 39.25786139464752, lng: -76.71117803986064, type: "apartment"},
  {name: "Monocacy (MON)", lat: 39.258013001666846, lng: -76.71082468868272, type: "apartment"},
  {name: "Nanticoke (NAN)", lat: 39.25797787901426, lng: -76.71155534700229, type: "apartment"},
  {name: "Sassafras (SAS)", lat: 39.258098078287944, lng: -76.71018796198257, type: "apartment"},
  {name: "Tuckahoe (TUC)", lat: 39.25762674065811, lng: -76.71093645598845, type: "apartment"},
  {name: "Wicomico (WIC)", lat: 39.2580029095758, lng: -76.70983480381939, type: "apartment"},

  {name: "Administration Drive Garage", lat: 39.251979686909266, lng: -76.71280361918268, type: "parking"},
  {name: "Lot 1", lat: 39.25352925347376, lng: -76.70846518839853, type: "parking"},
  {name: "Lot 2", lat: 39.2543213868805, lng: -76.70901705515254, type: "parking"},
  {name: "Lot 3", lat: 39.254011645487424, lng: -76.70750818101496, type: "parking"},
  {name: "Lot 4", lat: 39.254901658222835, lng: -76.70833350478823, type: "parking"},
  {name: "Lot ", lat: 39.257739489291154, lng: -76.70822635771071, type: "parking"},
  {name: "Lot 6", lat: 39.25851661615683, lng: -76.71110431601572, type: "parking"},
  {name: "Lot 7", lat: 39.25710728365381, lng: -76.71060056420541, type: "parking"},
  {name: "Lot 8", lat: 39.25650391340074, lng: -76.7151463334613, type: "parking"},
  {name: "Lot 9", lat: 39.25444509911425, lng: -76.71510818785265, type: "parking"},
  {name: "Lot 10", lat: 39.25772481823332, lng: -76.71373484013738, type: "parking"},
  {name: "Lot 11", lat: 39.25620804282212, lng: -76.70822335088252, type: "parking"},
  {name: "Lot 12", lat: 39.25643913423039, lng: -76.70674699226272, type: "parking"},
  {name: "Lot 20", lat: 39.26083662981982, lng: -76.71436503748676, type: "parking"},
  {name: "Lot 21", lat: 39.25933968417966, lng: -76.71509280254924, type: "parking"},
  {name: "Lot 22", lat: 39.25749914423096, lng: -76.71796334044875, type: "parking"},
  {name: "Lot 23", lat: 39.2548316970342, lng: -76.70525801991954, type: "parking"},
  {name: "Lot 24", lat: 39.25430886704978, lng: -76.70423005836932, type: "parking"},
  {name: "Lot 25", lat: 39.25463490193582, lng: -76.70290243275095, type: "parking"},
  {name: "Lot 26", lat: 39.25259977830959, lng: -76.70488193076885, type: "parking"},
  {name: "Lot 27", lat: 39.25225929578194, lng: -76.70627875979885, type: "parking"},
  {name: "Lot 28", lat: 39.25139263608792, lng: -76.70709539671294, type: "parking"},
  {name: "Lot 29", lat: 39.25854954480188, lng: -76.71613370500215, type: "parking"},
  {name: "Lot 30", lat: 39.2583439089727, lng: -76.71719167798125, type: "parking"},
  {name: "Lot 31", lat: 39.25980728577264, lng: -76.71471038675473, type: "parking"},
  {name: "Stadium Lot", lat: 39.25349143078823, lng: -76.70605092900891, type: "parking"},
  {name: "Walker Avenue Garage", lat: 39.25733152537599, lng: -76.71237226715348, type: "parking"},

  //Misc.
  {name: "Albin O. Kuhn Library and Gallery (AOK Library)", lat: 39.25633489594929, lng: -76.71154823313725, type: "building"},
  {name: "Apartment Community Center (ACC)", lat: 39.25820531810224, lng: -76.71195663252004, type: "building"},
  {name: "Campus Police Department", lat: 39.25730751863118, lng: -76.7141583239581, type: "building"},
  {name: "Central Plant", lat: 39.25744996693917, lng: -76.71391493351122, type: "building"},
  {name: "Chesapeake Arena", lat: 39.252474836247785, lng: -76.70746309633654, type: "building"},
  {name: "Facilities Management Building", lat: 39.25277508626896, lng: -76.70452481650712, type: "building"},
  {name: "Greenhouse", lat: 39.258162761695836, lng: -76.71357179023953, type: "building"},
  {name: "Parking Services (900 Walker)", lat: 39.260175258871946, lng: -76.71536684170289, type: "building"},
  {name: "Preschool Center", lat: 39.25809183292927, lng: -76.7080686314033, type: "building"},
  {name: "Retriever Activities Center (RAC)", lat: 39.25292477732798, lng: -76.71254067780536, type: "building"},
  {name: "Satellite Plant", lat: 39.25698595318187, lng: -76.70694672820909, type: "building"},
  {name: "Tech 2 Building", lat: 39.25568687260855, lng: -76.70290914623365, type: "building"},
  {name: "Technological Research Center (TRC)", lat: 39.25526048327397, lng: -76.70235704938513, type: "building"},
  {name: "The Center for Well-Being", lat: 39.25610279679613, lng: -76.7089148423121, type: "building"},
  {name: "The Commons", lat: 39.25503039910864, lng: -76.71083953512002, type: "building"},
  {name: "True Grits", lat: 39.25579292331207, lng: -76.70772212575991, type: "building"},
  {name: "UMBC Stadium Complex", lat: 39.25055232854239, lng: -76.7074760546811, type: "building"},
  {name: "University Center", lat: 39.2543568261648, lng: -76.71334044332173, type: "building"},
  {name: "Walker Avenue Apartments", lat: 39.2594958077876, lng: -76.71386415615716, type: "apartment"},
  {name: "Warehouse", lat: 39.253547903130084, lng: -76.70502645684019, type: "building"},

  //Outdoor recreational areas
  {name: "Community Garden", lat: 39.25672586161715, lng: -76.7141981371039, type: "outdoor area"},
  {name: "Erickson Field", lat: 39.25628855456745, lng: -76.7101460584626, type: "outdoor area"},
  {name: "Pool", lat: 39.25325440652088, lng: -76.71229138770275, type: "outdoor area"},
  {name: "Tennis Courts", lat: 39.253419982297274, lng: -76.71143919097712, type: "outdoor area"},
];

function initMap() {
  var umbcCenter = {lat: 39.2538015, lng: -76.7142732};
  var campusBounds = {
      north: 39.260,
      south: 39.250,
      west: -76.720,
      east: -76.700
  };

  map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: umbcCenter,
      restriction: { latLngBounds: campusBounds, strictBounds: true },
      styles: mapStyle
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  directionsRenderer.setMap(map);

  infoWindow = new google.maps.InfoWindow();

  document.getElementById("tabSearch").addEventListener("click", function() {
      document.getElementById("tabSearch").classList.add("active");
      document.getElementById("tabRoute").classList.remove("active");
      document.getElementById("searchContent").style.display = "block";
      document.getElementById("routeContent").style.display = "none";
  });

  document.getElementById("tabRoute").addEventListener("click", function() {
      document.getElementById("tabRoute").classList.add("active");
      document.getElementById("tabSearch").classList.remove("active");
      document.getElementById("routeContent").style.display = "block";
      document.getElementById("searchContent").style.display = "none";
  });

  document.getElementById("searchButton").addEventListener("click", searchBuilding);
  document.getElementById("searchInput").addEventListener("keyup", function(event) {
      showSuggestions();
      if (event.key === "Enter") {
          document.getElementById("suggestions").style.display = "none";
          searchBuilding();
      }
  });
  document.getElementById("routeButton").addEventListener("click", showRoute);
  document.getElementById("trackButton").addEventListener("click", startLiveTracking);
  document.getElementById("stopTrackButton").addEventListener("click", stopLiveTracking);
  setupRouteInputSuggestions("fromInput", "fromSuggestions");
  setupRouteInputSuggestions("toInput", "toSuggestions");

}

function showSuggestions() {
  var query = document.getElementById("searchInput").value.toLowerCase();
  var suggestionsDiv = document.getElementById("suggestions");

  if (query.length === 0) {
      suggestionsDiv.style.display = "none";
      suggestionsDiv.innerHTML = "";
      return;
  }

  var matches = resources.filter(resource => resource.name.toLowerCase().includes(query));

  if (matches.length === 0) {
      suggestionsDiv.style.display = "none";
      suggestionsDiv.innerHTML = "";
      return;
  }

  suggestionsDiv.innerHTML = "";
  matches.forEach(match => {
      var div = document.createElement("div");
      div.textContent = match.name;
      div.className = "suggestion-item";
      div.addEventListener("click", function() {
          document.getElementById("searchInput").value = match.name;
          suggestionsDiv.style.display = "none";
      });
      suggestionsDiv.appendChild(div);
  });
  suggestionsDiv.style.display = "block";
}

function setupRouteInputSuggestions(inputId, suggestionBoxId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(suggestionBoxId);

  input.addEventListener("keyup", function(event) {
    const query = input.value.toLowerCase();
    if (query.length === 0) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    const matches = resources.filter(resource => resource.name.toLowerCase().includes(query));
    if (matches.length === 0) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    box.innerHTML = "";
    matches.forEach(match => {
      const div = document.createElement("div");
      div.textContent = match.name;
      div.className = "suggestion-item";
      div.addEventListener("click", function() {
        input.value = match.name;
        box.style.display = "none";
      });
      box.appendChild(div);
    });

    box.style.display = "block";
  });

  // Optional: Hide suggestions on blur after short delay to allow click
  input.addEventListener("blur", () => setTimeout(() => box.style.display = "none", 200));
}


function searchBuilding() {
  var query = document.getElementById("searchInput").value.toLowerCase();
  var found = resources.find(resource => resource.name.toLowerCase().includes(query));

  if (found) {
      if (searchMarker) searchMarker.setMap(null);
      directionsRenderer.set('directions', null);
      if (routePolyline) routePolyline.setMap(null);
      if (liveTrackerMarker) liveTrackerMarker.setMap(null);

      searchMarker = new google.maps.Marker({
          position: {lat: found.lat, lng: found.lng},
          map: map,
          title: found.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });

      map.setCenter(searchMarker.getPosition());
      map.setZoom(18);
      infoWindow.setContent(found.name);
      infoWindow.open(map, searchMarker);

      let content = "<strong>" + found.name + "</strong>";
          if (found.name.toLowerCase().includes("library")) {
              content = `
                <div style="max-width:300px;font-family:Arial,sans-serif;">
                  <h3>📚 ${found.name}</h3>
                  <h4>Building Hours</h4>
                  <ul style="margin-left:16px;">
                    <li>Mon–Thu: 8:00 AM – 12:00 AM</li>
                    <li>Friday: 8:00 AM – 6:00 PM</li>
                    <li>Saturday: 10:00 AM – 6:00 PM</li>
                    <li>Sunday: 12:00 PM – 12:00 AM</li>
                  </ul>
                  <h4>Using the Library</h4>
                  <ul style="margin-left:16px;">
                    <li>My Accounts</li>
                    <li>Course Reserves</li>
                    <li>Study Spaces & Lockers</li>
                    <li>Computing & Software</li>
                    <li>Borrowing Items & Fines</li>
                    <li>Faculty Services</li>
                    <li>More…</li>
                  </ul>
                </div>`;
          }

          if (found.name.toLowerCase().includes("commons")) {
            content = `
              <div style="max-width:300px;font-family:Arial,sans-serif;">
                <h3>${found.name}</h3>
                <h4>Building Hours</h4>
                <ul style="margin-left:16px;">
                  <li>Mon–Thu: 7:30 AM – 11:00 PM</li>
                  <li>Friday: 7:30 AM – Midnight</li>
                  <li>Saturday: 8:00 AM – Midnight</li>
                  <li>Sunday: 10:00 AM – 09:00 PM</li>
                </ul>
                <h4>Using the Commons</h4>
                <ul style="margin-left:16px;">
                  <li>Halal Shack</li>
                  <li>Tomato</li>
                  <li>Dunkin</li>
                  <li>Women's Center</li>
                  <li>Copperhead Jack</li>
                  <li>Sushi Do</li>
                  <li>SGA Office</li>
                  <li>Mosaic & Printing</li>
                  <li>Market</li>
                </ul>
              </div>`;
        }

        if (found.name.toLowerCase().includes("rac")) {
            content = `
              <div style="max-width:300px;font-family:Arial,sans-serif;">
                <h3>${found.name}</h3>
                <h4>Building Hours</h4>
                <ul style="margin-left:16px;">
                  <li>Mon–Thu: 7:00 AM – 10:00 PM</li>
                  <li>Friday: 7:00 AM – 9:00 PM</li>
                  <li>Saturday: 10:00 AM – 6:00 PM</li>
                  <li>Sunday: 12:00 PM – 07:00 PM</li>
                </ul>
                <h4>Using the RAC</h4>
                <ul style="margin-left:16px;">
                  <li>Fitness Classes</li>
                  <li>Cardio Zone</li>
                  <li>Group Fitness Studio</li>
                  <li>Weight Room</li>
                  <li>RAC Courts</li>
                  <li>Cycling Studio</li>
                  <li>Arena Court</li>
                  <li>Aquatics Center</li>
                </ul>
              </div>`;
        }

      infoWindow.open(map, searchMarker);


  } else {
      alert("No matching building found.");
  }
}

function showRoute() {
  var fromQuery = document.getElementById("fromInput").value.toLowerCase();
  var toQuery = document.getElementById("toInput").value.toLowerCase();

  var originBuilding = resources.find(resource => resource.name.toLowerCase().includes(fromQuery));
  var destinationBuilding = resources.find(resource => resource.name.toLowerCase().includes(toQuery));

  if (!originBuilding || !destinationBuilding) {
      alert("Please enter valid building names.");
      return;
  }

  currentDestination = destinationBuilding;

  var request = {
      origin: {lat: originBuilding.lat, lng: originBuilding.lng},
      destination: {lat: destinationBuilding.lat, lng: destinationBuilding.lng},
      travelMode: google.maps.TravelMode.WALKING
  };

  directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
      } else {
          alert("Route not found: " + status);
      }
  });
}

function startLiveTracking() {
  if (!currentDestination) {
      alert("Please compute a route first.");
      return;
  }
  if (navigator.geolocation) {
      liveTrackId = navigator.geolocation.watchPosition(function(position) {
          var userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };

          if (liveTrackerMarker) {
              liveTrackerMarker.setPosition(userLatLng);
          } else {
              liveTrackerMarker = new google.maps.Marker({
                  position: userLatLng,
                  map: map,
                  title: "Your Location"
              });
          }

          var request = {
              origin: userLatLng,
              destination: {lat: currentDestination.lat, lng: currentDestination.lng},
              travelMode: google.maps.TravelMode.WALKING
          };
          directionsService.route(request, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(response);
              }
          });
      });
  } else {
      alert("Geolocation not supported.");
  }
}

function stopLiveTracking() {
  if (liveTrackId !== null) {
      navigator.geolocation.clearWatch(liveTrackId);
      liveTrackId = null;
      if (liveTrackerMarker) {
          liveTrackerMarker.setMap(null);
          liveTrackerMarker = null;
      }
      alert("Live tracking stopped.");
  }
}


