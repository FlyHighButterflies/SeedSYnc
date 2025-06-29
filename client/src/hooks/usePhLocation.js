import { useState, useEffect } from "react";

export function usePhLocation() {
    const [locationData, setLocationData] = useState({
        regions: [],
        provinces: [],
        cities: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/util/ph-location.json");
                if (!response.ok) {
                    throw new Error("Failed to fetch location data");
                }
                const data = await response.json();
                setLocationData({
                    regions: data.region || [],
                    provinces: data.province || [],
                    cities: data.city || [],
                });
            } catch (err) {
                setError(err.message);
                console.error("Error loading location data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocationData();
    }, []);

    return {
        regions: locationData.regions,
        provinces: locationData.provinces,
        cities: locationData.cities,
        loading,
        error,
    };
}
