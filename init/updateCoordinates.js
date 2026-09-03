const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

require("dotenv").config();

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({
    accessToken: mapToken
});

async function updateCoordinates() {

    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

    console.log("Connected to:", mongoose.connection.name);

    // Get ALL listings
    const listings = await Listing.find({});

    console.log("Total listings:", listings.length);

    for (let listing of listings) {

        // Skip only if valid coordinates already exist
        if (
            listing.geometry &&
            listing.geometry.coordinates &&
            listing.geometry.coordinates.length === 2
        ) {
            console.log("Already has coordinates:", listing.title);
            continue;
        }

        console.log("Updating:", listing.title);
        console.log("Location:", listing.location);

        try {
            //ask mapbox for coordinates
            const response = await geocodingClient
                .forwardGeocode({
                    query: listing.location,
                    limit: 1 //Gives only the best/first result.
                })
                .send();

            if (response.body.features.length === 0) { //Mapbox couldn't find the location.

                console.log(
                    " Location not found:",
                    listing.location
                );

                continue;
            }

            // Save Mapbox geometry
            listing.geometry = response.body.features[0].geometry;

            await listing.save();

            console.log(
                "updated",
                listing.title,
                "=>",
                listing.geometry.coordinates
            );

        } catch (err) {

            console.log(
                "error",
                listing.title,
                err.message
            );
        }
    }

    await mongoose.connection.close();

    console.log("Finished updating coordinates!");
}

updateCoordinates();