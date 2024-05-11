function initMap(username) {
    const vehicleLocation = { lat: 28.2639, lng: 83.9733 };
    const universityLocation = { lat: 28.266799, lng: 83.947842 };
    const mapElement = document.getElementById('map');
    const asideElement = document.querySelector('aside');

    const map = new google.maps.Map(mapElement, {
        center: vehicleLocation,
        zoom: 10
    });

    const vehicleMarker = new google.maps.Marker({
        position: vehicleLocation,
        map: map,
        icon: {
            url: 'https://emojicdn.elk.sh/🚌',
            scaledSize: new google.maps.Size(32, 32)
        },
        title: 'Vehicle Location'
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                    url: 'https://emojicdn.elk.sh/🕴',
                    scaledSize: new google.maps.Size(35, 35)
                },
                title: 'Your Location'
            });

            const universityMarker = new google.maps.Marker({
                position: universityLocation,
                map: map,
                icon: {
                    url: 'https://emojicdn.elk.sh/🏫',
                    scaledSize: new google.maps.Size(32, 32)
                },
                title: 'University Location'
            });

            const bounds = new google.maps.LatLngBounds();
            bounds.extend(vehicleMarker.getPosition());
            bounds.extend(userMarker.getPosition());
            bounds.extend(universityMarker.getPosition());
            map.fitBounds(bounds);

            google.maps.event.addListenerOnce(map, 'idle', function() {
                // Calculate distances
                const distanceUserVehicle = haversineDistance(userLocation, vehicleLocation);
                const distanceVehicleUniversity = haversineDistance(vehicleLocation, universityLocation);

                // Display distances in aside
                asideElement.innerHTML += `
                    <h2>Distance Messages</h2>
                    <p>Distance between you and vehicle: ${distanceUserVehicle.toFixed(2)} km</p>
                    <p>Distance between vehicle and university: ${distanceVehicleUniversity.toFixed(2)} km</p>
                `;

                // Show direction
                const directionsService = new google.maps.DirectionsService();
                const vehicleToUserDirectionsRequest = {
                    origin: vehicleLocation,
                    destination: userLocation,
                    travelMode: 'DRIVING'
                };
                directionsService.route(vehicleToUserDirectionsRequest, function(result, status) {
                    if (status === 'OK') {
                        const vehicleToUserPath = new google.maps.Polyline({
                            path: result.routes[0].overview_path,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        vehicleToUserPath.setMap(map);
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                });

                const vehicleToUniversityDirectionsRequest = {
                    origin: vehicleLocation,
                    destination: universityLocation,
                    travelMode: 'DRIVING'
                };
                directionsService.route(vehicleToUniversityDirectionsRequest, function(result, status) {
                    if (status === 'OK') {
                        const vehicleToUniversityPath = new google.maps.Polyline({
                            path: result.routes[0].overview_path,
                            geodesic: true,
                            strokeColor: '#0000FF',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        vehicleToUniversityPath.setMap(map);
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                });
            });
        });
    }
}

// Function to calculate Haversine distance between two points in kilometers
function haversineDistance(point1, point2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(point2.lat - point1.lat);
    const dLon = deg2rad(point2.lng - point1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
