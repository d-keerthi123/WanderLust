
    const map = new mapboxgl.Map({
        accessToken : mapToken,
        container: 'map', // container ID
        // center: [77.2090, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        center:listing.geometry.coordinates,
        zoom: 10 // starting zoom
    });

 // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .addTo(map);
