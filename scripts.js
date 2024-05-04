$(document).ready(function() {
    $('#showPassword').click(function() {
        const passwordInput = $('#password');
        const passwordFieldType = passwordInput.attr('type');

        if (passwordFieldType === 'password') {
            passwordInput.attr('type', 'text');
            $(this).text('Hide');
        } else {
            passwordInput.attr('type', 'password');
            $(this).text('Show');
        }
    });

    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission
        const username = $('#username').val();
        const password = $('#password').val();

        // Simulated login request, replace with actual backend integration
        const success = true; // Change based on actual login response

        if (success) {
            $('#login-form').hide(); // Hide login form
            $('#map').show(); // Display map
            $('#welcomeMessage').text('Welcome, ' + username + '!').show(); // Display welcome message
            initMap(username); // Initialize map with username
        } else {
            $('#loginError').text('Invalid username or password');
        }
    });
});

function initMap(username) {
    const recentTracking = [
        { id: 1, location: 'Kathmandu, Nepal', timestamp: '2023-03-14 10:30:00' },
        { id: 2, location: 'Bhaktapur, Nepal', timestamp: '2023-03-14 09:45:00' },
        { id: 3, location: 'Pokhara, Nepal', timestamp: '2023-03-14 08:10:00' }
    ];

    const vehicleLocation = { lat: 28.2639, lng: 83.9733 };
    const universityLocation = { lat: 28.2639, lng: 83.9733 };
    const mapElement = document.getElementById('map');
    const recentTrackingList = document.getElementById('recent-tracking');

    const map = new google.maps.Map(mapElement, {
        center: vehicleLocation,
        zoom: 10
    });

    const vehicleMarker = new google.maps.Marker({
        position: vehicleLocation,
        map: map,
        title: '🚌 Vehicle Location'
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
                title: '🏫 Your Location'
            });

            const vehicleToUserPath = new google.maps.Polyline({
                path: [vehicleLocation, userLocation],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            vehicleToUserPath.setMap(map);

            const vehicleDistance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(userLocation.lat, userLocation.lng),
                new google.maps.LatLng(vehicleLocation.lat, vehicleLocation.lng)
            );

            const universityDistance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(userLocation.lat, userLocation.lng),
                new google.maps.LatLng(universityLocation.lat, universityLocation.lng)
            );

            recentTracking.forEach(item => recentTrackingList.innerHTML += `<li>Location: ${item.location}, Timestamp: ${item.timestamp}</li>`);
            recentTrackingList.innerHTML += `<li>Distance to vehicle: ${(vehicleDistance / 1000).toFixed(2)} kilometers</li>`;
            recentTrackingList.innerHTML += `<li>Distance to university: ${(universityDistance / 1000).toFixed(2)} kilometers</li>`;
            recentTrackingList.innerHTML += `<li>You are ${(universityDistance / 1000).toFixed(2)} kilometers away from the university.</li>`;
        });
    } else {
        recentTrackingList.innerHTML += `<li>Geolocation is not supported by this browser.</li>`;
    }
}
