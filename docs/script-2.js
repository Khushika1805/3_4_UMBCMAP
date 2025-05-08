
var map;
var infoWindow;
var searchMarker = null;
var directionsService;
var directionsRenderer;
var routePolyline = null;
var liveTrackerMarker = null;
var liveTrackId = null;
var currentDestination = null;
var markerType = 'arrow';  // Choose 'arrow' or 'circle' for live-tracker style

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
  {name: "Information Technology (ITE)", lat: 39.25388926895672, lng: -76.71424341527158, type: "building"},
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

  //Dining
  {name: "Halal Shack", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "2.Mato", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Dunkin", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Wild Greens", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Copperhead Jack's", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Indian Kitchen", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Sushi Do", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Yum Shoppe", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Absurd Bird and Burgers", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},
  {name: "Einstein Bros Bagels", lat: 39.25633489594929, lng: -76.71154823313725, type: "dining"},
  {name: "The Coffee Shop", lat: 39.2531345925294, lng: -76.71347729482584, type: "dining"},
  {name: "Chick Fil A", lat: 39.2540959599122, lng: -76.71315784894689, type: "dining"},
  {name: "Starbucks", lat: 39.2542837588193, lng: -76.7132357507969, type: "dining"},
  {name: "Subway", lat: 39.248007996741826, lng: -76.71492256168848, type: "dining"},
  {name: "The Market Place", lat: 39.25503039910864, lng: -76.71083953512002, type: "dining"},


//Parking
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
  {name: "Commons Garage", lat: 39.25350645432396, lng: -76.70985938056538, type: "parking"},


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
  {name: "Financial Aid & Scholarships", lat: 39.256667070393185, lng: -76.71239650201927, type: "building"},
  {name: "Retriever Learning Center (RLC)", lat: 39.25633489594929, lng: -76.71154823313725, type: "building"},
  {name: "Career Center", lat: 39.25419598005312, lng: -76.7124558008981, type: "building"},
  {name: "Student Disability Services (SDS)", lat: 39.25419598005312, lng: -76.7124558008981, type: "department"},
  {name: "Bookstore", lat: 39.25460877875424, lng: -76.7109573721196, type: "department"},
  {name: "Student Business Services (SBS)", lat: 39.2531345925294, lng: -76.71347729482584, type: "department"},
  {name: "Office of Equity and Civil Rights", lat: 39.2531345925294, lng: -76.71347729482584, type: "department"},
  {name: "Computing Success Center", lat: 39.255124176513945, lng: -76.71344602460354, type: "department"},
  {name: "Admissions: Undergraduate", lat: 39.25619638799217, lng: -76.71196323139063, type: "department"},
  {name: "Honors College", lat: 39.25633489594929, lng: -76.71154823313725, type: "department"},


  //Outdoor recreational areas
  {name: "Community Garden", lat: 39.25672586161715, lng: -76.7141981371039, type: "outdoor area"},
  {name: "Erickson Field", lat: 39.25628855456745, lng: -76.7101460584626, type: "outdoor area"},
  {name: "Pool", lat: 39.25325440652088, lng: -76.71229138770275, type: "outdoor area"},
  {name: "Tennis Courts", lat: 39.253419982297274, lng: -76.71143919097712, type: "outdoor area"},
];o

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
          Swal.fire({
            title: '📚 Albin O. Kuhn Library',
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: left; font-size: 13.5px; max-height: 400px; overflow-y: auto;">
              <img src="https://assets1-my.umbc.edu/system/shared/thumbnails/news/000/068/205/6973786dc9c1de518c1a62446353dcbf/xxlarge.jpg?1495050701" 
                   alt="Albin O. Kuhn Library" 
                   style="width: 100%; max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
              
              <h4>🕒 Building Hours</h4>
              <ul style="list-style: none; padding-left: 0;">
                <li><strong>Mon–Thu:</strong> 8:00 AM – 12:00 AM</li>
                <li><strong>Friday:</strong> 8:00 AM – 6:00 PM</li>
                <li><strong>Saturday:</strong> 10:00 AM – 6:00 PM</li>
                <li><strong>Sunday:</strong> 12:00 PM – 12:00 AM</li>
              </ul>
          
              <h4 style="margin-top:16px;">📚 Library Resources by Floor</h4>
          
              <strong>Seventh Floor</strong>
              <ul>
                <li>Computer Lab</li>
                <li>Conference Room (Room 767)</li>
                <li>Lactation Room (Room 755)</li>
                <li>President's Room (Room 768)</li>
              </ul>
          
              <strong>Sixth Floor</strong>
              <ul><li>Absolutely Quiet Floor</li></ul>
          
              <strong>Fifth Floor</strong>
              <ul><li>Absolutely Quiet Floor</li></ul>
          
              <strong>Fourth Floor</strong>
              <ul>
                <li>Assistive Technology (Room 455)</li>
                <li>Quiet Floor</li>
              </ul>
          
              <strong>Third Floor</strong>
              <ul>
                <li>ASM Collection (Room 354)</li>
                <li>Science Archives (Room 354)</li>
                <li>Library Administrative Offices (Room 353)</li>
                <li>Quiet Floor</li>
              </ul>
          
              <strong>Second Floor</strong>
              <ul>
                <li>Current Periodicals (East Wing)</li>
                <li>Digital Media Lab (Room 216H)</li>
                <li>Instruction Room (Room 259)</li>
                <li>Honors College (Room 216L)</li>
                <li>Library IT Services (Room 256)</li>
                <li>Presentation Practice Room (Room 257)</li>
                <li>Screening Room (Room 258)</li>
                <li>Serials Office (Room 240)</li>
                <li>Serials Stacks</li>
                <li>Microforms</li>
              </ul>
          
              <strong>First Floor</strong>
              <ul>
                <li>Archives and Manuscripts (Room 104)</li>
                <li>Check Out Desk</li>
                <li>Collection Management (Room 158)</li>
                <li>Gallery (Room 105)</li>
                <li>Gifts (Room 158)</li>
                <li>Interlibrary Loan (Room 158)</li>
                <li>Leisure Reading Room</li>
                <li>Math and Science Tutoring Center</li>
                <li>Print & Copy Center</li>
                <li>Reference / Information Desk</li>
                <li>Reference Collection</li>
                <li>Reference Office (Room 155)</li>
                <li>Reserves (via Check Out Desk)</li>
                <li>Retriever Learning Center (RLC)</li>
                <li>Security Desk</li>
                <li>Special Collections (Room 104)</li>
                <li>Technical Services (Room 123)</li>
                <li>University Archives (Room 104)</li>
                <li>Vending Machines (in RLC)</li>
                <li>Writing Center</li>
              </ul>
          
              <strong>Lower Level</strong>
              <ul>
                <li>Government Documents: US & MD</li>
                <li>Indexes</li>
                <li>Maps</li>
              </ul>
            </div>
          `,
          
            width: 500,
            allowOutsideClick: false,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close',
            showCloseButton: true
          });
          
        }
        if (found.name.toLowerCase().includes("chick fil a")) {
            Swal.fire({
              title: '🍗 Chick-fil-A',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <p><strong>Hours</strong></p>
                  <ul>
                    <li>Closed</li>
                    <li>9:00 AM – 8:00 PM</li>
                    <li>9:00 AM – 8:00 PM</li>
                    <li>9:00 AM – 8:00 PM</li>
                    <li>9:00 AM – 8:00 PM</li>
                    <li>9:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 5:00 PM</li>
                  </ul>
                </div>
              `,
              width: 500,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          // Existing code...

        // Dining Dialog Boxes
        if (found.name.toLowerCase().includes("halal shack")) {
            Swal.fire({
            title: '🍗 Halal Shack',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>12:00 PM – 6:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 11:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("2.mato")) {
            Swal.fire({
            title: '🍝 2.Mato',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        if (found.name.toLowerCase().includes("true grit")) {
            Swal.fire({
              title: "🍽️ True Grit's Dining Hall",
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <p>True Grit's is UMBC's primary residential dining hall, offering all-you-care-to-eat meals and late-night dining options.</p>
                  
                  <h4>🕒 Typical Hours</h4>
                  <ul>
                    <li><strong>Breakfast:</strong> 7:00 AM – 9:30 AM</li>
                    <li><strong>Mid-Morning:</strong> 9:31 AM – 10:59 AM</li>
                    <li><strong>Lunch:</strong> 11:00 AM – 2:00 PM</li>
                    <li><strong>Dinner:</strong> 4:30 PM – 8:00 PM</li>
                    <li><strong>Late Night:</strong> 9:00 PM – 12:00 AM</li>
                  </ul>
          
                  <p>Weekend brunch is typically served 9:30 AM – 2:00 PM.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
        
        if (found.name.toLowerCase().includes("wild greens")) {
            Swal.fire({
            title: '🥗 Wild Greens',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("dunkin")) {
            Swal.fire({
            title: '☕ Dunkin',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("sushi do")) {
            Swal.fire({
            title: '🍣 Sushi Do',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 11:00 PM</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("copperhead jack")) {
            Swal.fire({
            title: "🍔 Copperhead Jack's",
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("market")) {
            Swal.fire({
            title: '🛒 Commons Retriever Market',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>1:00 PM – 8:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 4:00 PM</li>
                    <li>1:00 PM – 7:00 PM</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("absurd bird")) {
            Swal.fire({
            title: '🍗 Absurd Bird & Burgers',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("indian kitchen")) {
            Swal.fire({
            title: '🍛 Indian Kitchen',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
  
          

        if (found.name.toLowerCase().includes("career center")) {
            Swal.fire({
              title: '💼 UMBC Career Center',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwuNnk2QW6qR4L0iihAN1lYwm0flXQrha9xA&s" 
                       alt="Career Center"
                       style="width: 100%; max-width: 220px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                  
                  <p>The Career Center at UMBC empowers students and alumni to explore career paths, build experience, and connect with opportunities through advising, internships, career fairs, and workshops.</p>
          
                  <h4>🕒 Hours (Fall/Spring)</h4>
                  <ul>
                    <li> Math & Psychology Building, Room 201</li>
                    <li><strong>Mon–Fri:</strong> 8:30 AM – 5:00 PM</li>
                  </ul>
          
                  <h4>🔧 Services Offered</h4>
                  <ul>
                    <li>Resume and Cover Letter Reviews</li>
                    <li>Mock Interviews</li>
                    <li>Career Advising</li>
                    <li>Internship and Job Search Help</li>
                    <li>Graduate School Preparation</li>
                  </ul>
          
                  <h4>📅 Events & Opportunities</h4>
                  <ul>
                    <li>Career & Internship Fairs</li>
                    <li>Employer Info Sessions</li>
                    <li>Career Workshops</li>
                    <li>On-Campus Interviews</li>
                  </ul>
          
                  <h4>🌐 Visit</h4>
                  <p><a href="https://careers.umbc.edu" target="_blank">careers.umbc.edu</a></p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("student business services")) {
            Swal.fire({
              title: '📚 Campus Resources by Topic',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4> Admin Building (3rd Floor)</h4>
                  <h4> SBS is the office that bills students, collects tuition and fees and issues student refunds. We process student payments, tuition remission, military waivers and post payments to student accounts from outside agencies.</h4>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("office of equity and civil rights")) {
            Swal.fire({
              title: '⚖️ Office of Equity and Civil Rights (OECR)',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Administration Building (9th Floor)</h4>
                  <p>OECR coordinates UMBC’s civil rights compliance efforts including Title IX, ADA, and equal opportunity policies. They manage discrimination and harassment complaints and promote a safe, inclusive campus.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("office of equity and civil rights")) {
            Swal.fire({
              title: '⚖️ Office of Equity and Civil Rights (OECR)',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Administration Building (9th Floor)</h4>
                  <p>OECR coordinates UMBC’s civil rights compliance efforts including Title IX, ADA, and equal opportunity policies. They manage discrimination and harassment complaints and promote a safe, inclusive campus.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("student disability services")) {
            Swal.fire({
              title: '♿ Student Disability Services (SDS)',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Math and Psychology Building, Room 212</h4>
                  <p>SDS works to ensure equitable access to education for students with disabilities. They provide academic accommodations, assistive technologies, and guidance to support student success.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("computing success center")) {
            Swal.fire({
              title: '💻 Computing Success Center',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Fine Arts Building, Room 010</h4>
                  <p>The CSC supports students in introductory computing courses with tutoring, mentoring, and academic guidance. It's a hub for collaborative learning in the computing disciplines.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("admissions: undergraduate")) {
            Swal.fire({
              title: '🎓 Undergraduate Admissions',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Albin O. Kuhn Library, Lower Level</h4>
                  <p>The Undergraduate Admissions Office assists prospective students with the application process, campus visits, and enrollment information. They also support transfer and international applicants.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }   
        
          if (found.name.toLowerCase().includes("retriever learning center") || found.name.toLowerCase().includes("rlc")) {
            Swal.fire({
              title: '📖 Retriever Learning Center (RLC)',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Albin O. Kuhn Library, First Floor</h4>
                  <p>The RLC is an open 24/7 collaborative study space offering quiet and group study areas, whiteboards, vending machines, and printing services. It's a favorite among students for late-night learning.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("writing center")) {
            Swal.fire({
              title: '✍️ UMBC Writing Center',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Albin O. Kuhn Library, First Floor (near RLC)</h4>
                  <p>The Writing Center provides one-on-one consultations to help students improve their writing at any stage — from brainstorming to final revisions. It's open to all majors and writing levels.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          if (found.name.toLowerCase().includes("starbucks")) {
            Swal.fire({
              title: '☕ Starbucks',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlKJHb8tdeHvi2E13hAGaBxww7KZS-8aXWGA&s"
                       alt="Starbucks"
                       style="width: 100%; max-width: 220px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                  <p>Starbucks serves a wide variety of hot and cold beverages, pastries, and light bites. A popular stop for students between classes.</p>
                  <h4>🕒 Hours</h4>
                  <ul>
                    <li>Sunday: 2:00 PM – 6:00 PM</li>
                    <li>Monday–Friday: 8:00 AM – 6:00 PM</li>
                    <li>Saturday: Closed</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          if (found.name.toLowerCase().includes("administration building")) {
            Swal.fire({
              title: '🏢 Administration Building',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
                  <p>The UMBC Administration Building houses a variety of administrative services essential to university operations.</p>
                  
                  <h4>📌 Key Departments and Services</h4>
                  <ul>
                    <li><strong>Student Business Services (3rd Floor):</strong> Handles billing, tuition payments, refunds, and tuition remission.</li>
                    <li><strong>President's Office (10th Floor):</strong> The office of UMBC's president.</li>
                    <li><strong>Graduate School (2nd Floor):</strong> Offers support and services for graduate education and students.</li>
                    <li><strong>International Education Services (2nd Floor):</strong> Includes Study Abroad programs and support for international students.</li>
                    <li><strong>Financial Services:</strong> Manages financial operations, reporting, and support for faculty, staff, and students.</li>
                    <li><strong>Human Resources:</strong> Handles hiring, payroll, benefits, and HR matters across campus.</li>
                    <li><strong>Other Departments:</strong> Includes various administrative offices supporting the university's internal operations.</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          if (found.name.toLowerCase().includes("engineering building")) {
            Swal.fire({
              title: '🛠️ Engineering Building',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
                  <p>The UMBC Engineering Building serves as a central hub for academic, research, and administrative activities within the College of Engineering and Information Technology (COEIT).</p>
          
                  <h4>🏫 Academic & Administrative Services</h4>
                  <ul>
                    <li><strong>COEIT Shared Services Center (Room 202):</strong> Provides support for payroll, procurement, grants, and acts as a liaison between university offices and external agencies.</li>
                    <li><strong>Dean’s Offices & ECEP:</strong> Houses the COEIT Dean’s Office and the Engineering and Computing Education Program.</li>
                    <li><strong>Undergraduate Student Services:</strong> Offers advising, registration help, and student support services for COEIT students.</li>
                  </ul>
          
                  <h4>🧪 Departments</h4>
                  <ul>
                    <li>Department of Chemical, Biochemical & Environmental Engineering</li>
                    <li>Department of Mechanical Engineering</li>
                  </ul>
          
                  <h4>🔬 Research</h4>
                  <p>The building hosts several research centers and institutes focused on cutting-edge engineering and technology projects.</p>
          
                  <h4>💻 24/7 Computer Lab</h4>
                  <p>ENG 021/021A – Accessible to students around the clock for studying and academic work.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          
          if (found.name.toLowerCase().includes("honors college")) {
            Swal.fire({
              title: '🎓 Honors College',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Albin O. Kuhn Library, Room 216L (Second Floor)</h4>
                  <p>The Honors College provides a challenging and enriching academic experience for high-achieving undergraduates. It offers small seminars, faculty mentorship, and a strong community of scholars.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("financial aid")) {
            Swal.fire({
              title: '💰 Financial Aid & Scholarships Office',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <h4>Location:</h4>
                  <p>Near Library</p>
                  
                  <h4>About:</h4>
                  <p>The Financial Aid & Scholarships Office helps students access federal, state, institutional, and private aid to support their education. They assist with FAFSA processing, award notifications, and maintaining eligibility.</p>
                  
                  <h4>Services Include:</h4>
                  <ul>
                    <li>FAFSA guidance</li>
                    <li>Scholarship application assistance</li>
                    <li>Verification and appeals</li>
                    <li>Loan counseling</li>
                    <li>Satisfactory Academic Progress (SAP) support</li>
                  </ul>
          
                  <h4>Contact & Info:</h4>
                  <p><a href="https://financialaid.umbc.edu" target="_blank">financialaid.umbc.edu</a></p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          

          
  
        if (found.name.toLowerCase().includes("commons")) {
            Swal.fire({
              title: '🎉 The Commons',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <img src="https://thecommons.umbc.edu/wp-content/uploads/sites/770/2024/08/campus_life_web_photos_200_commons_building.jpg"
                       alt="The Commons"
                       style="width: 100%; max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                  <p style="margin-top: 0;">The Commons is the vibrant hub of student life at UMBC, centrally located and home to cultural, social, and recreational events throughout the year.</p>
          
                  <h4>🕒 Building Hours (Spring 2025)</h4>
                  <ul>
                    <li><strong>Mon–Thu:</strong> 7:30 AM – 11:00 PM</li>
                    <li><strong>Friday:</strong> 7:30 AM – Midnight</li>
                    <li><strong>Saturday:</strong> 8:00 AM – Midnight</li>
                    <li><strong>Sunday:</strong> 10:00 AM – 9:00 PM</li>
                  </ul>
          
                  <h4>ℹ️ Campus Info Center (CIC)</h4>
                  <ul>
                    <li>Mon–Fri: 8:00 AM – 10:00 PM</li>
                    <li>Sat–Sun: 10:00 AM – 8:00 PM</li>
                  </ul>
          
                  <h4>🎮 Gameroom</h4>
                  <ul>
                    <li>7 pool tables, 2 foosball tables, 3 ping-pong tables</li>
                    <li>TVs for console gaming</li>
                    <li>Board & card games available</li>
                  </ul>
          
                  <h4>🌍 The Mosaic (Suite 2B23)</h4>
                  <p>A lounge & resource space fostering inclusion, equity, and social justice. Open to all community members for events and relaxation.</p>
          
                  <h4>🍽️ Dining Options</h4>
                  <ul>
                    <li>Halal Shack</li>
                    <li>Tomato</li>
                    <li>Dunkin</li>
                    <li>Copperhead Jack</li>
                    <li>Sushi Do</li>
                    <li>Market</li>
                  </ul>
          
                  <h4>📍 Offices & Services</h4>
                  <ul>
                    <li>SGA Office (Suite 2B20)</li>
                    <li>Women's Center</li>
                    <li>Commonvision</li>
                    <li>Bookstore</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("performing arts")) {
            Swal.fire({
              title: '🎭 Performing Arts & Humanities Building',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                  <img src="https://theatre.umbc.edu/wp-content/uploads/sites/140/2014/01/Outside-Pro-1024x682.jpg"
                       alt="Performing Arts Building"
                       style="width: 100%; max-width: 220px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
          
                  <p>The Performing Arts & Humanities Building (PAHB) is UMBC’s premier venue for music, theatre, and dance, offering state-of-the-art facilities for rehearsals, performances, and creative exploration.</p>
          
                  <h4>📅 Building Hours</h4>
                  <ul>
                    <li><strong>Mon–Thu:</strong> 9:00 AM – 5:00 PM</li>
                  </ul>
                  
                  <h4>🎼 Earl and Darielle Linehan Concert Hall</h4>
                  <p>A medium-sized orchestral hall with superb acoustics. Ideal for large ensembles and intimate events.</p>
                  <ul>
                    <li><strong>Max Seating:</strong> 365</li>
                  </ul>
          
                  <h4>🎹 Music Box</h4>
                  <p>A flexible space for practice and smaller performances, equipped with AV, dual projectors, and lighting.</p>
                  <ul>
                    <li><strong>Max Seating:</strong> 75</li>
                  </ul>
          
                  <h4>🎭 Proscenium Theatre</h4>
                  <p>Features a 250-seat theatre with full stage house, 51 line sets, catwalks, and professional lighting, sound, and projection systems.</p>
                  <ul>
                    <li><strong>Max Seating:</strong> 250</li>
                  </ul>
          
                  <h4>🛠️ Additional Facilities</h4>
                  <ul>
                    <li>Black Box Theatre (125 seats)</li>
                    <li>Two Rehearsal Studios</li>
                    <li>Design & Costume Studios</li>
                    <li>Scene Shop & Dressing Rooms</li>
                    <li>Conference & Class Rooms</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          
          
          if (found.name.toLowerCase().includes("rac")) {
            Swal.fire({
              title: '🏋️ Retriever Activities Center (RAC)',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <img src="https://recreation.umbc.edu/wp-content/uploads/sites/351/2022/08/275049752_3177566122525317_603741436135020329_n-1024x683.jpg" 
                   alt="RAC" 
                   style="width: 100%; max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                  <h4>🕒 Hours</h4>
                  <ul>
                    <li>Mon–Thu: 7:00 AM – 10:00 PM</li>
                    <li>Friday: 7:00 AM – 9:00 PM</li>
                    <li>Saturday: 10:00 AM – 6:00 PM</li>
                    <li>Sunday: 12:00 PM – 7:00 PM</li>
                  </ul>
          
                  <h4>💪 Fitness & Training</h4>
                  <ul>
                    <li>Cardio Zone & Balcony</li>
                    <li>Weight Rooms (060 & 063)</li>
                    <li>Functional Fitness Room</li>
                    <li>Cycling Studio</li>
                  </ul>
          
                  <h4>🧘 Studios & Courts</h4>
                  <ul>
                    <li>Group Fitness & Multi-Purpose Studios</li>
                    <li>RAC Courts & Arena Court</li>
                    <li>Indoor Track</li>
                  </ul>
          
                  <h4>🏊 Aquatics</h4>
                  <ul>
                    <li>Indoor Pool (25-yard, diving well)</li>
                    <li>Outdoor Olympic Pool (seasonal)</li>
                  </ul>
          
                  <h4>⚽ Outdoor Fields</h4>
                  <ul>
                    <li>Walker Field (rugby)</li>
                    <li>Stadium Turf (soccer/lacrosse)</li>
                    <li>Shelbourne Fields</li>
                    <li>Outdoor Tennis Courts</li>
                  </ul>
          
                  <h4>🛁 Other Amenities</h4>
                  <ul>
                    <li>Locker Rooms (Ground Floor)</li>
                    <li>Equipment Desk</li>
                    <li>Meeting & Classroom Spaces</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          if (found.name.toLowerCase().includes("information technology") || found.name.toLowerCase().includes("ite")) {
            Swal.fire({
              title: '💡 Information Technology & Engineering (ITE) Building',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
                  <p>The ITE Building houses core departments, academic services, and student support within UMBC's College of Engineering and Information Technology (COEIT).</p>
          
                  <h4>🏫 Departments & Offices</h4>
                  <ul>
                    <li><strong>COEIT Dean’s Office</strong></li>
                    <li><strong>Engineering and Computing Education Program (ECEP)</strong></li>
                    <li><strong>Undergraduate Student Services</strong></li>
                    <li><strong>Department of Computer Science & Electrical Engineering</strong></li>
                    <li><strong>Department of Information Systems</strong></li>
                    <li><strong>Center for Women in Technology (CWIT – Room 456)</strong></li>
                  </ul>
          
                  <h4>🧪 Related Departments</h4>
                  <p>The Department of Chemical, Biochemical & Environmental Engineering and the Department of Mechanical Engineering are located in the Engineering Building and the Technology Research Center.</p>
          
                  <h4>🔬 Research Centers</h4>
                  <p>Several COEIT research centers and units are also located at the 900 Walker Avenue location on campus.</p>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }

          if (found.name.toLowerCase().includes("fine arts")) {
            Swal.fire({
              title: '🎨 Fine Arts Building',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
                  <p>The UMBC Fine Arts Building is a hub for visual arts students, offering 24/7 access to creative spaces and specialized facilities.</p>
          
                  <h4>🎥 Production Center</h4>
                  <ul>
                    <li>24-hour access to editing suites</li>
                    <li>Sound recording & mixing facilities</li>
                    <li>Post-production equipment & portable projectors</li>
                  </ul>
          
                  <h4>🖌️ Visual Arts Studios</h4>
                  <ul>
                    <li>Studio A, Studio B/C</li>
                    <li>Dedicated Drawing Room</li>
                  </ul>
          
                  <h4>🖨️ Printmaking & Darkrooms</h4>
                  <ul>
                    <li>Lithography, etching, silkscreen</li>
                    <li>Photography darkrooms</li>
                  </ul>
          
                  <h4>🎒 Open Studio</h4>
                  <p>Includes tables, stools, cutting tools, scanner, and flat files for student use.</p>
          
                  <h4>📚 Student Study Area</h4>
                  <p>A quiet and comfortable space to relax or collaborate between classes.</p>
          
                  <h4>🖼️ Exhibitions & Screenings</h4>
                  <ul>
                    <li>Home to the Center for Art Design and Visual Culture (CADVC)</li>
                    <li>Includes gallery and screening rooms</li>
                  </ul>
          
                  <h4>🎞️ Additional Facilities</h4>
                  <ul>
                    <li>Art History Seminar Room</li>
                    <li>Art Print services</li>
                    <li>Visual Arts Production Center ("The Cage") – equipment checkout</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          if (found.name.toLowerCase().includes("math & psychology")) {
            Swal.fire({
              title: '🧠 Math & Psychology Building',
              html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
                  <p>This building is home to essential academic, health, and career services supporting UMBC students across disciplines.</p>
          
                  <h4>♿ Student Disability Services (SDS)</h4>
                  <ul>
                    <li>Located in Room 212</li>
                    <li>Provides exam accommodations, note-taking help, assistive tech</li>
                  </ul>
          
                  <h4>🧑‍⚕️ Psychology Training Clinic</h4>
                  <ul>
                    <li>Offers low-cost, evidence-based therapy for adults</li>
                    <li>Focus on anxiety, depression, and relationship support</li>
                  </ul>
          
                  <h4>💼 Career Center</h4>
                  <ul>
                    <li>Career counseling, resume help, and job search guidance</li>
                    <li>Supports in-person, phone, and virtual appointments</li>
                  </ul>
          
                  <h4>🩺 Retriever Integrated Health (RIH)</h4>
                  <ul>
                    <li>Located on the 3rd floor</li>
                    <li>Provides medical and mental health services</li>
                    <li>Support for health concerns and crisis intervention</li>
                  </ul>
          
                  <h4>📊 Center for Interdisciplinary Research & Consulting (CIRC)</h4>
                  <ul>
                    <li>Mathematics and statistics consulting</li>
                    <li>Supports research and student learning opportunities</li>
                  </ul>
                </div>
              `,
              width: 600,
              showCloseButton: true,
              confirmButtonColor: '#fdb515',
              confirmButtonText: 'Close'
            });
          }
          
          
          
          
  
        infoWindow.open(map, searchMarker);
  
  
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Building Not Found',
        text: 'No matching building found. Please check the name and try again.'
      });
      
    }
}

function filterByCategory(selectElement) {
    const selectedName = selectElement.value;
    if (!selectedName) return;
  
    const found = resources.find(resource => resource.name.toLowerCase().includes(selectedName.toLowerCase()));
  
    if (found) {
      if (searchMarker) searchMarker.setMap(null);
      directionsRenderer.set('directions', null);
      if (routePolyline) routePolyline.setMap(null);
      if (liveTrackerMarker) liveTrackerMarker.setMap(null);
  
      searchMarker = new google.maps.Marker({
        position: { lat: found.lat, lng: found.lng },
        map: map,
        title: found.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });
  
      map.setCenter(searchMarker.getPosition());
      map.setZoom(18);
      infoWindow.setContent(found.name);
      let content = "<strong>" + found.name + "</strong>";
      if (found.name.toLowerCase().includes("library")) {
        Swal.fire({
          title: '📚 Albin O. Kuhn Library',
          html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: left; font-size: 13.5px; max-height: 400px; overflow-y: auto;">
            <img src="https://assets1-my.umbc.edu/system/shared/thumbnails/news/000/068/205/6973786dc9c1de518c1a62446353dcbf/xxlarge.jpg?1495050701" 
                 alt="Albin O. Kuhn Library" 
                 style="width: 100%; max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
            
            <h4>🕒 Building Hours</h4>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Mon–Thu:</strong> 8:00 AM – 12:00 AM</li>
              <li><strong>Friday:</strong> 8:00 AM – 6:00 PM</li>
              <li><strong>Saturday:</strong> 10:00 AM – 6:00 PM</li>
              <li><strong>Sunday:</strong> 12:00 PM – 12:00 AM</li>
            </ul>
        
            <h4 style="margin-top:16px;">📚 Library Resources by Floor</h4>
        
            <strong>Seventh Floor</strong>
            <ul>
              <li>Computer Lab</li>
              <li>Conference Room (Room 767)</li>
              <li>Lactation Room (Room 755)</li>
              <li>President's Room (Room 768)</li>
            </ul>
        
            <strong>Sixth Floor</strong>
            <ul><li>Absolutely Quiet Floor</li></ul>
        
            <strong>Fifth Floor</strong>
            <ul><li>Absolutely Quiet Floor</li></ul>
        
            <strong>Fourth Floor</strong>
            <ul>
              <li>Assistive Technology (Room 455)</li>
              <li>Quiet Floor</li>
            </ul>
        
            <strong>Third Floor</strong>
            <ul>
              <li>ASM Collection (Room 354)</li>
              <li>Science Archives (Room 354)</li>
              <li>Library Administrative Offices (Room 353)</li>
              <li>Quiet Floor</li>
            </ul>
        
            <strong>Second Floor</strong>
            <ul>
              <li>Current Periodicals (East Wing)</li>
              <li>Digital Media Lab (Room 216H)</li>
              <li>Instruction Room (Room 259)</li>
              <li>Honors College (Room 216L)</li>
              <li>Library IT Services (Room 256)</li>
              <li>Presentation Practice Room (Room 257)</li>
              <li>Screening Room (Room 258)</li>
              <li>Serials Office (Room 240)</li>
              <li>Serials Stacks</li>
              <li>Microforms</li>
            </ul>
        
            <strong>First Floor</strong>
            <ul>
              <li>Archives and Manuscripts (Room 104)</li>
              <li>Check Out Desk</li>
              <li>Collection Management (Room 158)</li>
              <li>Gallery (Room 105)</li>
              <li>Gifts (Room 158)</li>
              <li>Interlibrary Loan (Room 158)</li>
              <li>Leisure Reading Room</li>
              <li>Math and Science Tutoring Center</li>
              <li>Print & Copy Center</li>
              <li>Reference / Information Desk</li>
              <li>Reference Collection</li>
              <li>Reference Office (Room 155)</li>
              <li>Reserves (via Check Out Desk)</li>
              <li>Retriever Learning Center (RLC)</li>
              <li>Security Desk</li>
              <li>Special Collections (Room 104)</li>
              <li>Technical Services (Room 123)</li>
              <li>University Archives (Room 104)</li>
              <li>Vending Machines (in RLC)</li>
              <li>Writing Center</li>
            </ul>
        
            <strong>Lower Level</strong>
            <ul>
              <li>Government Documents: US & MD</li>
              <li>Indexes</li>
              <li>Maps</li>
            </ul>
          </div>
        `,
        
          width: 500,
          allowOutsideClick: false,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close',
          showCloseButton: true
        });
    }

    if (found.name.toLowerCase().includes("math & psychology")) {
        Swal.fire({
          title: '🧠 Math & Psychology Building',
          html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
              <p>This building is home to essential academic, health, and career services supporting UMBC students across disciplines.</p>
      
              <h4>♿ Student Disability Services (SDS)</h4>
              <ul>
                <li>Located in Room 212</li>
                <li>Provides exam accommodations, note-taking help, assistive tech</li>
              </ul>
      
              <h4>🧑‍⚕️ Psychology Training Clinic</h4>
              <ul>
                <li>Offers low-cost, evidence-based therapy for adults</li>
                <li>Focus on anxiety, depression, and relationship support</li>
              </ul>
      
              <h4>💼 Career Center</h4>
              <ul>
                <li>Career counseling, resume help, and job search guidance</li>
                <li>Supports in-person, phone, and virtual appointments</li>
              </ul>
      
              <h4>🩺 Retriever Integrated Health (RIH)</h4>
              <ul>
                <li>Located on the 3rd floor</li>
                <li>Provides medical and mental health services</li>
                <li>Support for health concerns and crisis intervention</li>
              </ul>
      
              <h4>📊 Center for Interdisciplinary Research & Consulting (CIRC)</h4>
              <ul>
                <li>Mathematics and statistics consulting</li>
                <li>Supports research and student learning opportunities</li>
              </ul>
            </div>
          `,
          width: 600,
          showCloseButton: true,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close'
        });
      }
      
    if (found.name.toLowerCase().includes("information technology") || found.name.toLowerCase().includes("ite")) {
        Swal.fire({
          title: '💡 Information Technology & Engineering (ITE) Building',
          html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
              <p>The ITE Building houses core departments, academic services, and student support within UMBC's College of Engineering and Information Technology (COEIT).</p>
      
              <h4>🏫 Departments & Offices</h4>
              <ul>
                <li><strong>COEIT Dean’s Office</strong></li>
                <li><strong>Engineering and Computing Education Program (ECEP)</strong></li>
                <li><strong>Undergraduate Student Services</strong></li>
                <li><strong>Department of Computer Science & Electrical Engineering</strong></li>
                <li><strong>Department of Information Systems</strong></li>
                <li><strong>Center for Women in Technology (CWIT – Room 456)</strong></li>
              </ul>
      
              <h4>🧪 Related Departments</h4>
              <p>The Department of Chemical, Biochemical & Environmental Engineering and the Department of Mechanical Engineering are located in the Engineering Building and the Technology Research Center.</p>
      
              <h4>🔬 Research Centers</h4>
              <p>Several COEIT research centers and units are also located at the 900 Walker Avenue location on campus.</p>
            </div>
          `,
          width: 600,
          showCloseButton: true,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close'
        });
      }
      if (found.name.toLowerCase().includes("fine arts")) {
        Swal.fire({
          title: '🎨 Fine Arts Building',
          html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
              <p>The UMBC Fine Arts Building is a hub for visual arts students, offering 24/7 access to creative spaces and specialized facilities.</p>
      
              <h4>🎥 Production Center</h4>
              <ul>
                <li>24-hour access to editing suites</li>
                <li>Sound recording & mixing facilities</li>
                <li>Post-production equipment & portable projectors</li>
              </ul>
      
              <h4>🖌️ Visual Arts Studios</h4>
              <ul>
                <li>Studio A, Studio B/C</li>
                <li>Dedicated Drawing Room</li>
              </ul>
      
              <h4>🖨️ Printmaking & Darkrooms</h4>
              <ul>
                <li>Lithography, etching, silkscreen</li>
                <li>Photography darkrooms</li>
              </ul>
      
              <h4>🎒 Open Studio</h4>
              <p>Includes tables, stools, cutting tools, scanner, and flat files for student use.</p>
      
              <h4>📚 Student Study Area</h4>
              <p>A quiet and comfortable space to relax or collaborate between classes.</p>
      
              <h4>🖼️ Exhibitions & Screenings</h4>
              <ul>
                <li>Home to the Center for Art Design and Visual Culture (CADVC)</li>
                <li>Includes gallery and screening rooms</li>
              </ul>
      
              <h4>🎞️ Additional Facilities</h4>
              <ul>
                <li>Art History Seminar Room</li>
                <li>Art Print services</li>
                <li>Visual Arts Production Center ("The Cage") – equipment checkout</li>
              </ul>
            </div>
          `,
          width: 600,
          showCloseButton: true,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close'
        });
      }
            

    if (found.name.toLowerCase().includes("engineering building")) {
        Swal.fire({
          title: '🛠️ Engineering Building',
          html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
              <p>The UMBC Engineering Building serves as a central hub for academic, research, and administrative activities within the College of Engineering and Information Technology (COEIT).</p>
      
              <h4>🏫 Academic & Administrative Services</h4>
              <ul>
                <li><strong>COEIT Shared Services Center (Room 202):</strong> Provides support for payroll, procurement, grants, and acts as a liaison between university offices and external agencies.</li>
                <li><strong>Dean’s Offices & ECEP:</strong> Houses the COEIT Dean’s Office and the Engineering and Computing Education Program.</li>
                <li><strong>Undergraduate Student Services:</strong> Offers advising, registration help, and student support services for COEIT students.</li>
              </ul>
      
              <h4>🧪 Departments</h4>
              <ul>
                <li>Department of Chemical, Biochemical & Environmental Engineering</li>
                <li>Department of Mechanical Engineering</li>
              </ul>
      
              <h4>🔬 Research</h4>
              <p>The building hosts several research centers and institutes focused on cutting-edge engineering and technology projects.</p>
      
              <h4>💻 24/7 Computer Lab</h4>
              <p>ENG 021/021A – Accessible to students around the clock for studying and academic work.</p>
            </div>
          `,
          width: 600,
          showCloseButton: true,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close'
        });
      }
      

    if (found.name.toLowerCase().includes("administration building")) {
        Swal.fire({
          title: '🏢 Administration Building',
          html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial, sans-serif; font-size:14px;">
              <p>The UMBC Administration Building houses a variety of administrative services essential to university operations.</p>
              
              <h4>📌 Key Departments and Services</h4>
              <ul>
                <li><strong>Student Business Services (3rd Floor):</strong> Handles billing, tuition payments, refunds, and tuition remission.</li>
                <li><strong>President's Office (10th Floor):</strong> The office of UMBC's president.</li>
                <li><strong>Graduate School (2nd Floor):</strong> Offers support and services for graduate education and students.</li>
                <li><strong>International Education Services (2nd Floor):</strong> Includes Study Abroad programs and support for international students.</li>
                <li><strong>Financial Services:</strong> Manages financial operations, reporting, and support for faculty, staff, and students.</li>
                <li><strong>Human Resources:</strong> Handles hiring, payroll, benefits, and HR matters across campus.</li>
                <li><strong>Other Departments:</strong> Includes various administrative offices supporting the university's internal operations.</li>
              </ul>
            </div>
          `,
          width: 600,
          showCloseButton: true,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close'
        });
      }
      

    if (found.name.toLowerCase().includes("true grit")) {
        Swal.fire({
            title: "🍽️ True Grit's Dining Hall",
            html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p>True Grit's is UMBC's primary residential dining hall, offering all-you-care-to-eat meals and late-night dining options.</p>
                
                <h4>🕒 Typical Hours</h4>
                <ul>
                <li><strong>Breakfast:</strong> 7:00 AM – 9:30 AM</li>
                <li><strong>Mid-Morning:</strong> 9:31 AM – 10:59 AM</li>
                <li><strong>Lunch:</strong> 11:00 AM – 2:00 PM</li>
                <li><strong>Dinner:</strong> 4:30 PM – 8:00 PM</li>
                <li><strong>Late Night:</strong> 9:00 PM – 12:00 AM</li>
                </ul>
        
                <p>Weekend brunch is typically served 9:30 AM – 2:00 PM.</p>
            </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
        });
        }          
        
      
      if (found.name.toLowerCase().includes("chick fil a")) {
        Swal.fire({
          title: '🍗 Chick-fil-A',
          html: `
            <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
              <p><strong>Hours</strong></p>
              <ul>
                <li>Closed</li>
                <li>9:00 AM – 8:00 PM</li>
                <li>9:00 AM – 8:00 PM</li>
                <li>9:00 AM – 8:00 PM</li>
                <li>9:00 AM – 8:00 PM</li>
                <li>9:00 AM – 4:00 PM</li>
                <li>11:00 AM – 5:00 PM</li>
              </ul>
            </div>
          `,
          width: 500,
          showCloseButton: true,
          confirmButtonColor: '#fdb515',
          confirmButtonText: 'Close'
        });
      }

            // Dining Dialog Boxes
            if (found.name.toLowerCase().includes("halal shack")) {
            Swal.fire({
            title: '🍗 Halal Shack',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>12:00 PM – 6:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 10:00 PM</li>
                    <li>11:00 AM – 11:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("2.mato")) {
            Swal.fire({
            title: '🍝 2.Mato',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("wild greens")) {
            Swal.fire({
            title: '🥗 Wild Greens',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("dunkin")) {
            Swal.fire({
            title: '☕ Dunkin',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>7:30 AM – 2:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("sushi do")) {
            Swal.fire({
            title: '🍣 Sushi Do',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 11:00 PM</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("copperhead jack")) {
            Swal.fire({
            title: "🍔 Copperhead Jack's",
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 8:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("market")) {
            Swal.fire({
            title: '🛒 Commons Retriever Market',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>1:00 PM – 8:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 10:00 PM</li>
                    <li>8:00 AM – 4:00 PM</li>
                    <li>1:00 PM – 7:00 PM</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("absurd bird")) {
            Swal.fire({
            title: '🍗 Absurd Bird & Burgers',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 6:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }
        
        if (found.name.toLowerCase().includes("indian kitchen")) {
            Swal.fire({
            title: '🍛 Indian Kitchen',
            html: `
                <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <p><strong>Hours</strong></p>
                <ul>
                    <li>Closed</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>11:00 AM – 4:00 PM</li>
                    <li>Closed</li>
                </ul>
                </div>
            `,
            width: 500,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
            });
        }

      if (found.name.toLowerCase().includes("career center")) {
          Swal.fire({
            title: '💼 UMBC Career Center',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwuNnk2QW6qR4L0iihAN1lYwm0flXQrha9xA&s" 
                     alt="Career Center"
                     style="width: 100%; max-width: 220px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                
                <p>The Career Center at UMBC empowers students and alumni to explore career paths, build experience, and connect with opportunities through advising, internships, career fairs, and workshops.</p>
        
                <h4>🕒 Hours (Fall/Spring)</h4>
                <ul>
                  <li> Math & Psychology Building, Room 201</li>
                  <li><strong>Mon–Fri:</strong> 8:30 AM – 5:00 PM</li>
                </ul>
        
                <h4>🔧 Services Offered</h4>
                <ul>
                  <li>Resume and Cover Letter Reviews</li>
                  <li>Mock Interviews</li>
                  <li>Career Advising</li>
                  <li>Internship and Job Search Help</li>
                  <li>Graduate School Preparation</li>
                </ul>
        
                <h4>📅 Events & Opportunities</h4>
                <ul>
                  <li>Career & Internship Fairs</li>
                  <li>Employer Info Sessions</li>
                  <li>Career Workshops</li>
                  <li>On-Campus Interviews</li>
                </ul>
        
                <h4>🌐 Visit</h4>
                <p><a href="https://careers.umbc.edu" target="_blank">careers.umbc.edu</a></p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("student business services")) {
          Swal.fire({
            title: '📚 Campus Resources by Topic',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4> Admin Building (3rd Floor)</h4>
                <h4> SBS is the office that bills students, collects tuition and fees and issues student refunds. We process student payments, tuition remission, military waivers and post payments to student accounts from outside agencies.</h4>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("office of equity and civil rights")) {
          Swal.fire({
            title: '⚖️ Office of Equity and Civil Rights (OECR)',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Administration Building (9th Floor)</h4>
                <p>OECR coordinates UMBC’s civil rights compliance efforts including Title IX, ADA, and equal opportunity policies. They manage discrimination and harassment complaints and promote a safe, inclusive campus.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("office of equity and civil rights")) {
          Swal.fire({
            title: '⚖️ Office of Equity and Civil Rights (OECR)',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Administration Building (9th Floor)</h4>
                <p>OECR coordinates UMBC’s civil rights compliance efforts including Title IX, ADA, and equal opportunity policies. They manage discrimination and harassment complaints and promote a safe, inclusive campus.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("student disability services")) {
          Swal.fire({
            title: '♿ Student Disability Services (SDS)',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Math and Psychology Building, Room 212</h4>
                <p>SDS works to ensure equitable access to education for students with disabilities. They provide academic accommodations, assistive technologies, and guidance to support student success.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("computing success center")) {
          Swal.fire({
            title: '💻 Computing Success Center',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Fine Arts Building, Room 010</h4>
                <p>The CSC supports students in introductory computing courses with tutoring, mentoring, and academic guidance. It's a hub for collaborative learning in the computing disciplines.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("admissions: undergraduate")) {
          Swal.fire({
            title: '🎓 Undergraduate Admissions',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Albin O. Kuhn Library, Lower Level</h4>
                <p>The Undergraduate Admissions Office assists prospective students with the application process, campus visits, and enrollment information. They also support transfer and international applicants.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }   
      
        if (found.name.toLowerCase().includes("retriever learning center") || found.name.toLowerCase().includes("rlc")) {
          Swal.fire({
            title: '📖 Retriever Learning Center (RLC)',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Albin O. Kuhn Library, First Floor</h4>
                <p>The RLC is an open 24/7 collaborative study space offering quiet and group study areas, whiteboards, vending machines, and printing services. It's a favorite among students for late-night learning.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("writing center")) {
          Swal.fire({
            title: '✍️ UMBC Writing Center',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Albin O. Kuhn Library, First Floor (near RLC)</h4>
                <p>The Writing Center provides one-on-one consultations to help students improve their writing at any stage — from brainstorming to final revisions. It's open to all majors and writing levels.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }
        if (found.name.toLowerCase().includes("starbucks")) {
          Swal.fire({
            title: '☕ Starbucks',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlKJHb8tdeHvi2E13hAGaBxww7KZS-8aXWGA&s"
                     alt="Starbucks"
                     style="width: 100%; max-width: 220px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                <p>Starbucks serves a wide variety of hot and cold beverages, pastries, and light bites. A popular stop for students between classes.</p>
                <h4>🕒 Hours</h4>
                <ul>
                  <li>Sunday: 2:00 PM – 6:00 PM</li>
                  <li>Monday–Friday: 8:00 AM – 6:00 PM</li>
                  <li>Saturday: Closed</li>
                </ul>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }
        
        
        if (found.name.toLowerCase().includes("honors college")) {
          Swal.fire({
            title: '🎓 Honors College',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Albin O. Kuhn Library, Room 216L (Second Floor)</h4>
                <p>The Honors College provides a challenging and enriching academic experience for high-achieving undergraduates. It offers small seminars, faculty mentorship, and a strong community of scholars.</p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("financial aid")) {
          Swal.fire({
            title: '💰 Financial Aid & Scholarships Office',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <h4>Location:</h4>
                <p>Near Library</p>
                
                <h4>About:</h4>
                <p>The Financial Aid & Scholarships Office helps students access federal, state, institutional, and private aid to support their education. They assist with FAFSA processing, award notifications, and maintaining eligibility.</p>
                
                <h4>Services Include:</h4>
                <ul>
                  <li>FAFSA guidance</li>
                  <li>Scholarship application assistance</li>
                  <li>Verification and appeals</li>
                  <li>Loan counseling</li>
                  <li>Satisfactory Academic Progress (SAP) support</li>
                </ul>
        
                <h4>Contact & Info:</h4>
                <p><a href="https://financialaid.umbc.edu" target="_blank">financialaid.umbc.edu</a></p>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }
        
        

        

      if (found.name.toLowerCase().includes("commons")) {
          Swal.fire({
            title: '🎉 The Commons',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <img src="https://thecommons.umbc.edu/wp-content/uploads/sites/770/2024/08/campus_life_web_photos_200_commons_building.jpg"
                     alt="The Commons"
                     style="width: 100%; max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                <p style="margin-top: 0;">The Commons is the vibrant hub of student life at UMBC, centrally located and home to cultural, social, and recreational events throughout the year.</p>
        
                <h4>🕒 Building Hours (Spring 2025)</h4>
                <ul>
                  <li><strong>Mon–Thu:</strong> 7:30 AM – 11:00 PM</li>
                  <li><strong>Friday:</strong> 7:30 AM – Midnight</li>
                  <li><strong>Saturday:</strong> 8:00 AM – Midnight</li>
                  <li><strong>Sunday:</strong> 10:00 AM – 9:00 PM</li>
                </ul>
        
                <h4>ℹ️ Campus Info Center (CIC)</h4>
                <ul>
                  <li>Mon–Fri: 8:00 AM – 10:00 PM</li>
                  <li>Sat–Sun: 10:00 AM – 8:00 PM</li>
                </ul>
        
                <h4>🎮 Gameroom</h4>
                <ul>
                  <li>7 pool tables, 2 foosball tables, 3 ping-pong tables</li>
                  <li>TVs for console gaming</li>
                  <li>Board & card games available</li>
                </ul>
        
                <h4>🌍 The Mosaic (Suite 2B23)</h4>
                <p>A lounge & resource space fostering inclusion, equity, and social justice. Open to all community members for events and relaxation.</p>
        
                <h4>🍽️ Dining Options</h4>
                <ul>
                  <li>Halal Shack</li>
                  <li>Tomato</li>
                  <li>Dunkin</li>
                  <li>Copperhead Jack</li>
                  <li>Sushi Do</li>
                  <li>Market</li>
                </ul>
        
                <h4>📍 Offices & Services</h4>
                <ul>
                  <li>SGA Office (Suite 2B20)</li>
                  <li>Women's Center</li>
                  <li>Commonvision</li>
                  <li>Bookstore</li>
                </ul>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }

        if (found.name.toLowerCase().includes("performing arts")) {
          Swal.fire({
            title: '🎭 Performing Arts & Humanities Building',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
                <img src="https://theatre.umbc.edu/wp-content/uploads/sites/140/2014/01/Outside-Pro-1024x682.jpg"
                     alt="Performing Arts Building"
                     style="width: 100%; max-width: 220px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
        
                <p>The Performing Arts & Humanities Building (PAHB) is UMBC’s premier venue for music, theatre, and dance, offering state-of-the-art facilities for rehearsals, performances, and creative exploration.</p>
        
                <h4>📅 Building Hours</h4>
                <ul>
                  <li><strong>Mon–Thu:</strong> 9:00 AM – 5:00 PM</li>
                </ul>
                
                <h4>🎼 Earl and Darielle Linehan Concert Hall</h4>
                <p>A medium-sized orchestral hall with superb acoustics. Ideal for large ensembles and intimate events.</p>
                <ul>
                  <li><strong>Max Seating:</strong> 365</li>
                </ul>
        
                <h4>🎹 Music Box</h4>
                <p>A flexible space for practice and smaller performances, equipped with AV, dual projectors, and lighting.</p>
                <ul>
                  <li><strong>Max Seating:</strong> 75</li>
                </ul>
        
                <h4>🎭 Proscenium Theatre</h4>
                <p>Features a 250-seat theatre with full stage house, 51 line sets, catwalks, and professional lighting, sound, and projection systems.</p>
                <ul>
                  <li><strong>Max Seating:</strong> 250</li>
                </ul>
        
                <h4>🛠️ Additional Facilities</h4>
                <ul>
                  <li>Black Box Theatre (125 seats)</li>
                  <li>Two Rehearsal Studios</li>
                  <li>Design & Costume Studios</li>
                  <li>Scene Shop & Dressing Rooms</li>
                  <li>Conference & Class Rooms</li>
                </ul>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }
        
        
        
        if (found.name.toLowerCase().includes("rac")) {
          Swal.fire({
            title: '🏋️ Retriever Activities Center (RAC)',
            html: `
              <div style="max-height:400px; overflow-y:auto; text-align:left; font-family:Arial,sans-serif; font-size:14px;">
              <img src="https://recreation.umbc.edu/wp-content/uploads/sites/351/2022/08/275049752_3177566122525317_603741436135020329_n-1024x683.jpg" 
                 alt="RAC" 
                 style="width: 100%; max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); float: right; margin-left: 16px;" />
                <h4>🕒 Hours</h4>
                <ul>
                  <li>Mon–Thu: 7:00 AM – 10:00 PM</li>
                  <li>Friday: 7:00 AM – 9:00 PM</li>
                  <li>Saturday: 10:00 AM – 6:00 PM</li>
                  <li>Sunday: 12:00 PM – 7:00 PM</li>
                </ul>
        
                <h4>💪 Fitness & Training</h4>
                <ul>
                  <li>Cardio Zone & Balcony</li>
                  <li>Weight Rooms (060 & 063)</li>
                  <li>Functional Fitness Room</li>
                  <li>Cycling Studio</li>
                </ul>
        
                <h4>🧘 Studios & Courts</h4>
                <ul>
                  <li>Group Fitness & Multi-Purpose Studios</li>
                  <li>RAC Courts & Arena Court</li>
                  <li>Indoor Track</li>
                </ul>
        
                <h4>🏊 Aquatics</h4>
                <ul>
                  <li>Indoor Pool (25-yard, diving well)</li>
                  <li>Outdoor Olympic Pool (seasonal)</li>
                </ul>
        
                <h4>⚽ Outdoor Fields</h4>
                <ul>
                  <li>Walker Field (rugby)</li>
                  <li>Stadium Turf (soccer/lacrosse)</li>
                  <li>Shelbourne Fields</li>
                  <li>Outdoor Tennis Courts</li>
                </ul>
        
                <h4>🛁 Other Amenities</h4>
                <ul>
                  <li>Locker Rooms (Ground Floor)</li>
                  <li>Equipment Desk</li>
                  <li>Meeting & Classroom Spaces</li>
                </ul>
              </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonColor: '#fdb515',
            confirmButtonText: 'Close'
          });
        }
        
        

      infoWindow.open(map, searchMarker);
      infoWindow.open(map, searchMarker);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Location Not Found',
        text: 'Unable to locate the selected location on the map.'
      });
    }
}

function showRoute() {
  var fromQuery = document.getElementById("fromInput").value.toLowerCase();
  var toQuery = document.getElementById("toInput").value.toLowerCase();

  var originBuilding = resources.find(resource => resource.name.toLowerCase().includes(fromQuery));
  var destinationBuilding = resources.find(resource => resource.name.toLowerCase().includes(toQuery));

  if (!originBuilding || !destinationBuilding) {
    Swal.fire({
        icon: 'warning',
        title: 'Route Not Found',
        text: 'No matching building found. Please check the name and try again.'
      });
    return;
    }

    currentDestination = destinationBuilding;

    // Clear existing markers
    if (searchMarker) searchMarker.setMap(null);

    var request = {
    origin: { lat: originBuilding.lat, lng: originBuilding.lng },
    destination: { lat: destinationBuilding.lat, lng: destinationBuilding.lng },
    travelMode: google.maps.TravelMode.WALKING
    };

    directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);

        // Manually add destination marker ("B")
        searchMarker = new google.maps.Marker({
        position: { lat: destinationBuilding.lat, lng: destinationBuilding.lng },
        map: map,
        title: destinationBuilding.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"  // You can replace with "B" icon if needed
        });

        map.setCenter(searchMarker.getPosition());
        map.setZoom(18);
    } else {
        Swal.fire({
        icon: 'warning',
        title: 'Route Not Found',
        });
    }
    });

  }


function startLiveTracking() {
    if (!currentDestination){ 
        Swal.fire ({
        icon: 'warning',
        title: 'Route Not Found',
      });
    return;
    }

    if (!navigator.geolocation){ 
        Swal.fire ({
        icon: 'warning',
        title: 'Geolocation Not Found',
      }); 
      return; 
    }
      
    if (!google.maps.geometry)       { console.error("Include &libraries=geometry in API"); }
  
    const arrowIcon = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5, fillColor: "#0000FF", fillOpacity: 0.8, strokeWeight: 2
    };
    const circleIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8, fillColor: "#FF0000", fillOpacity: 0.6, strokeWeight: 2
    };
  
    liveTrackId = navigator.geolocation.watchPosition(pos => {
      var userLL = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      var destLL = currentDestination;
      var icon   = (markerType === "circle")
        ? circleIcon
        : Object.assign({}, arrowIcon, {
            rotation: google.maps.geometry.spherical.computeHeading(userLL, destLL)
          });
  
      if (!liveTrackerMarker) {
        liveTrackerMarker = new google.maps.Marker({
          map: map, position: userLL, icon: icon, title: "You → Destination"
        });
      } else {
        liveTrackerMarker.setPosition(userLL);
        liveTrackerMarker.setIcon(icon);
      }
      map.panTo(userLL);
      // update route polyline
      directionsService.route({
        origin:      userLL, destination: destLL,
        travelMode:  google.maps.TravelMode.WALKING
      }, (resp, stat) => { if (stat === "OK") directionsRenderer.setDirections(resp); });
    }, err => console.error("Geolocation error:", err),
       { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
  }
  
  function stopLiveTracking() {
    if (liveTrackId !== null) {
      navigator.geolocation.clearWatch(liveTrackId);
      liveTrackId = null;
    }
    if (liveTrackerMarker) {
      liveTrackerMarker.setMap(null);
      liveTrackerMarker = null;
    }

    // Clear UI
    document.getElementById("fromInput").value = "";
    document.getElementById("toInput").value = "";
    document.getElementById("searchInput").value = "";
    document.getElementById("suggestions").style.display = "none";
    document.getElementById("fromSuggestions").style.display = "none";
    document.getElementById("toSuggestions").style.display = "none";


    if (searchMarker) {
        searchMarker.setMap(null);
        searchMarker = null;
      }
      directionsRenderer.set('directions', null);
      if (routePolyline) {
        routePolyline.setMap(null);
        routePolyline = null;
      }
    
    currentDestination = null;
    map.setCenter({ lat: 39.2538015, lng: -76.7142732 }); // Reset center
    map.setZoom(16);

    Swal.fire ({
        title: 'Live Tracking Stopped',
      });

    
  }


