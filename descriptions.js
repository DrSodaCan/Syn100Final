const photo = document.getElementById("desc_icon");
const title = document.getElementById("desc_title");
const description = document.getElementById("desc_description");

async function findByID(num) {
    try {
        // Fetch the JSON file
        const response = await fetch('waypoints.json');
        const waypoints = await response.json();

        // Check if the provided ID is within a valid range
        if (num >= 0 && num < waypoints.length) {
            // Access the specific waypoint using the provided ID
            const waypoint = waypoints[num];

            // Update the HTML elements with the data from the waypoint
            title.textContent = waypoint.name;
            description.innerHTML = waypoint.description; // Use innerHTML for line breaks
            photo.src = waypoint.imageUrl;
            photo.alt = waypoint.name;

        } else {
            console.error("ID is out of range");
        }
    } catch (error) {
        console.error("Error fetching or parsing the JSON data:", error);
    }
}

// Extract the 'id' parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Ensure the 'id' is a valid number before passing it to the function
if (id !== null && !isNaN(id)) {
    findByID(parseInt(id, 10));
} else {
    console.error("Invalid or missing ID parameter");
}
