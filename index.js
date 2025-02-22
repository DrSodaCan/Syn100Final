// Initialize the map centered on California
var map = L.map('map', {
    center: [36.7783, -119.4179],
    zoom: 6,
    worldCopyJump: false,   // Prevents the map from repeating
    maxBounds: [
        [-90, -180],          // Southwest bound
        [90, 180]             // Northeast bound
    ],
    maxBoundsViscosity: 1.0 // Keeps the map fully within these bounds
});

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom icon for the user's location
var userIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Function to display waypoints on the map with clickable links
function displayWaypoints(waypoints) {
    waypoints.forEach(function(waypoint, index) {
        let redirect_url = "/Syn100Final/art_descriptions.html?id=" + index;
        L.marker(waypoint.coords)
            .addTo(map)
            .bindPopup(
                `<b>${waypoint.name}</b><br>
                    <!--${waypoint.description}<br>-->
                <a href="${redirect_url}" target="_blank">
                  <img src="${waypoint.imageUrl}" class="popup-image" alt="${waypoint.name} image">
                </a><br>
                <a href="${redirect_url}" target="_blank">Learn more</a>`
            );
    });
}

// Function to calculate the distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Async function to update distances and highlight closest waypoint
function updateDistancesWithUserLocation(userCoords, waypoints) {
    let closestWaypoint = null;
    let closestDistance = Infinity;

    waypoints.forEach(function(waypoint, index) {
        let redirect_url = "/Syn100Final/art_descriptions.html?id=" + index;
        // Calculate distance between user's location and waypoint
        const distance = calculateDistance(userCoords.lat, userCoords.lng, waypoint.coords[0], waypoint.coords[1]);

        // Check if this waypoint is the closest
        if (distance < closestDistance) {
            closestDistance = distance;
            closestWaypoint = waypoint;
        }

        // Update marker with distance info in popup
        L.marker(waypoint.coords)
            .addTo(map)
            .bindPopup(
                `<b>${waypoint.name}<br></b>
                    <!--${waypoint.description}<br>-->
                <a href="${redirect_url}" target="_blank">
                  <img src="${waypoint.imageUrl}" class="popup-image" alt="${waypoint.name} image">
                </a><br>
                <a href="${redirect_url}" target="_blank">Learn more</a>\`
                <b>Distance:</b> ${distance.toFixed(2)} km`
            );
    });

    // Highlight the closest waypoint
    if (closestWaypoint) {
        L.circleMarker(closestWaypoint.coords, { color: 'red', radius: 10 })
            .addTo(map)
            .bindPopup(`<b>Closest Waypoint:</b> ${closestWaypoint.name}`)
            .openPopup();
    }
}

// Fetch waypoints and user's location, then display them
fetch('waypoints.json')
    .then(response => response.json())
    .then(waypoints => {
        displayWaypoints(waypoints);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Add a marker for the user's location with the custom blue icon
                    L.marker(userCoords, { icon: userIcon })
                        .addTo(map)
                        .bindPopup("<b>Your Location</b>")
                        .openPopup();

                    // Update distances for each waypoint after getting user location
                    updateDistancesWithUserLocation(userCoords, waypoints);

                    // Optional: Center the map around the user's location
                    map.setView(userCoords, 7);
                },
                function(error) {
                    console.error("Error retrieving location:", error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    })
    .catch(error => console.error('Error loading waypoints:', error));
