// Initialize the map centered on California
import {waypoints} from "./waypoints";

var map = L.map('map').setView([36.7783, -119.4179], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom icon for the user's location
let userIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],  // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});


// Function to calculate the distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    //formatted like this to account for earth being round
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

// Function to update waypoints with user's distance
function updateDistances(userCoords) {
    let closestWaypoint = null;
    let closestDistance = Infinity;

    waypoints.forEach(function(waypoint) {
        // Calculate distance between user's location and waypoint
        const distance = calculateDistance(userCoords.lat, userCoords.lng, waypoint.coords[0], waypoint.coords[1]);

        // Check if this waypoint is the closest
        if (distance < closestDistance) {
            closestDistance = distance;
            closestWaypoint = waypoint;
        }

        // Add a marker with updated popup including distance
        L.marker(waypoint.coords)
            .addTo(map)
            .bindPopup(
                `<b>${waypoint.name}</b><br>${waypoint.description}<br>
            <img src="${waypoint.imageUrl}" class="popup-image" alt="${waypoint.name} image"><br>
            <b>Distance:</b> ${distance.toFixed(2)} km`
            );
    });

    // Highlight the closest waypoint
    if (closestWaypoint) {
        L.circleMarker(closestWaypoint.coords, { color: 'red', radius: 10 })
            .addTo(map)
            .bindPopup(`<b>Closest Waypoint:</b> ${closestWaypoint.name}`);
    }
}

// Use the Geolocation API to get the user's current location
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

            // Update distances for each waypoint from user's location
            updateDistances(userCoords);

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