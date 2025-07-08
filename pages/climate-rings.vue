<template>
    <v-container class="pa-0 ma-0" width="100%" height="100%" fluid style="position: relative; overflow: hidden;">
        <v-row class="ma-0 pa-0" style="height: 100%; width: 100%; position: relative;">
            <v-col :cols="selectedCity ? 8 : 12" class="pa-0 ma-0">
                <div id="map" ref="mapContainer" class="map-container">
                    <HistoricalCitySearch style="position:absolute; right: 16px; z-index: 1001;" />
                </div>
            </v-col>

            <v-col v-if="selectedCity" cols="4">
                <HistoricalPanel :city="selectedCity" @close="selectedCity = null" />
            </v-col>
        </v-row>

        <HistoricalInfo style="position:absolute; top:16px; left: 16px; z-index: 1001;" />
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, unref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { storeToRefs } from 'pinia'

// SEO Meta Tags
useSeoMeta({
  title: 'Climate Rings - Interactive Historical Climate Data Visualization',
  description: 'Explore historical climate data through interactive maps and visualizations. Discover temperature patterns, climate trends, and weather data for cities worldwide from 1940 onwards.',
  keywords: 'climate data, historical weather, temperature maps, climate visualization, weather patterns, climate change, environmental data',
  author: 'Sialuk',
  ogTitle: 'Climate Rings - Interactive Historical Climate Data',
  ogDescription: 'Explore historical climate data through interactive maps and visualizations. Discover temperature patterns and climate trends for cities worldwide.',
  ogImage: '/og-image.jpg', // Make sure you have a good OG image
  ogUrl: 'https://sialuk.com/climate-rings',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Climate Rings - Interactive Climate Data',
  twitterDescription: 'Explore historical climate data through interactive maps and visualizations.',
  twitterImage: '/og-image.jpg'
})

// Structured Data for SEO
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Climate Rings",
      "description": "Interactive historical climate data visualization tool",
      "url": "https://sialuk.com/climate-rings",
      "applicationCategory": "EnvironmentalApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "Sialuk"
      }
    })
  }]
})

const historicalStore = useHistoricalStore()

const { selectedCity } = storeToRefs(historicalStore)
// Get the Mapbox access token from runtime config
const config = useRuntimeConfig()


/////////////////////////  REFS  /////////////////////////
const map = ref<mapboxgl.Map | null>(null)
// const selectedCity = ref<{ name: string, country: string, lat: number, lng: number } | null>(null)
const mapContainer = ref<HTMLElement | null>(null)

/////////////////////////  HOOKS  /////////////////////////
onMounted(() => {
    // Set the access token from environment variables
    mapboxgl.accessToken = config.public.mapboxAccessToken

    // Initialize the map
    map.value = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/oceangns/cleg55s1e001r01p7pk89id51?fresh=true', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 3, // starting zoom,
        minZoom: 3,
        maxZoom: 7,
        projection: 'globe' // use globe projection
    })

    // Add navigation controls (zoom in/out, rotate)
    map.value.addControl(new mapboxgl.NavigationControl({
        showCompass: false // Hide the compass
    }), 'bottom-right')

    map.value.on('load', () => {
        // Add the video layer after the map has loaded
        setTimeout(() => {
            addLayer()
        }, 1000);

        // Add click event for city names
        setupCityClickHandlers()
    })

    // console.log(map.value);

    // Add resize observer to handle container size changes
    if (mapContainer.value) {
        const resizeObserver = new ResizeObserver(() => {
            if (map.value) {
                map.value.resize()
            }
        })
        resizeObserver.observe(mapContainer.value)

        // Clean up observer on unmount
        onUnmounted(() => {
            resizeObserver.disconnect()
        })
    }
})


/////////////////////////  WATCHERS  /////////////////////////
watch(selectedCity, (newCity) => {
    // Resize the map when the layout changes
    if (map.value) {
        // Use setTimeout to ensure the DOM has updated
        setTimeout(() => {
            map.value!.resize()
            map.value!.flyTo({
                center: [newCity.lng, newCity.lat],
                zoom: 5,
                speed: 1.2, // Adjust speed as needed
                curve: 1.42, // Adjust curve for smoother animation
                essential: true // This animation is considered essential with respect to prefers-reduced-motion
            })
        }, 100)
    }

    toggleSelectedCell()
})

/////////////////////////  METHODS  /////////////////////////
const setupCityClickHandlers = () => {
    if (!map.value) return

    // Method 1: Target specific common layer names
    const commonPlaceLayerNames = [
        'place-city-lg-n',
        'place-city-lg-s',
        'place-city-md-n',
        'place-city-md-s',
        'place-city-sm-n',
        'place-city-sm-s',
        'place-town',
        'place-village',
        'settlement-major-label',
        'settlement-minor-label',
        'place-label',
        'place-label-city',
        'place-label-town'
    ]

    // Get all layers in the map style
    const layers = map.value.getStyle().layers

    // Find layers that contain place/city labels
    const placeLayers = layers?.filter(layer =>
        layer.type === 'symbol' && (
            layer.id.includes('place') ||
            layer.id.includes('city') ||
            layer.id.includes('settlement') ||
            layer.id.includes('town') ||
            layer.id.includes('village') ||
            commonPlaceLayerNames.includes(layer.id)
        )
    )

    // Add click handlers for each place layer
    placeLayers?.forEach(layer => {
        // Change cursor to pointer when hovering over cities
        map.value!.on('mouseenter', layer.id, () => {
            map.value!.getCanvas().style.cursor = 'pointer'
        })

        // Reset cursor when leaving cities
        map.value!.on('mouseleave', layer.id, () => {
            map.value!.getCanvas().style.cursor = ''
        })

        // Handle click events
        map.value!.on('click', layer.id, (e) => {
            const features = e.features
            if (features && features.length > 0) {
                const feature = features[0]
                const properties = feature.properties

                // Get city name from properties (try multiple common property names)
                const cityName = properties?.name_en ||
                    properties?.name ||
                    properties?.name_local ||
                    properties?.name_int ||
                    properties?.text ||
                    properties?.label ||
                    'Unknown Place'
                const country = properties?.iso_3166_1


                if (cityName) {
                    selectedCity.value = { name: cityName, country, lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1] }
                    // Force reactivity update
                    nextTick(() => {
                    })
                }
            }
        })
    })

    // Method 2: Add a general click handler for any missed places
    map.value.on('click', (e) => {
        // Query all features at the click point
        const allFeatures = map.value!.queryRenderedFeatures(e.point)

        const features = map.value!.queryRenderedFeatures(e.point, {
            layers: placeLayers?.map(l => l.id) || []
        })

        if (features.length === 0) {
            // Check if we clicked on any other place-related features
            const placeFeatures = allFeatures.filter(f =>
                f.properties?.name &&
                (f.source?.includes('composite') || f.source?.includes('mapbox')) &&
                f.layer?.type === 'symbol'
            )

            if (placeFeatures.length > 0) {
                const country = placeFeatures[0].properties?.iso_3166_1
                const cityName = placeFeatures[0].properties?.name
                if (cityName) {
                    selectedCity.value = { name: cityName, country, lat: placeFeatures[0].geometry.coordinates[0][0][1], lng: placeFeatures[0].geometry.coordinates[0][0][0] }
                    // Force reactivity update
                    nextTick(() => {
                    })
                }
            }
        }
    })
}

const addLayer = () => {
    if (!map.value) return

    const emptyGeojson = {
        type: 'FeatureCollection',
        features: []
    }

    // Add a vector source
    map.value.addSource('vector-source', {
        type: 'geojson',
        data: emptyGeojson
    })

    // Add a fill layer using the vector source
    map.value.addLayer({
        id: 'vector-fill-layer',
        type: 'fill',
        source: 'vector-source',
        paint: {
            'fill-color': 'rgba(255, 0, 0, 0.6)',
        }
    })
}

const toggleSelectedCell = () => {
    if (!map.value) return

    if (selectedCity.value && selectedCity.value.lat && selectedCity.value.lng) {
        let lat = selectedCity.value.lat
        let lng = selectedCity.value.lng

        lat = Math.floor(lat * 4) / 4
        lng = Math.floor(lng * 4) / 4

        // Create a point feature for the selected city
        const cityFeature = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [lng - 0.25, lat - 0.25],
                    [lng + 0.25, lat - 0.25],
                    [lng + 0.25, lat + 0.25],
                    [lng - 0.25, lat + 0.25],
                    [lng - 0.25, lat - 0.25]
                ]]
            },
            properties: {
                name: selectedCity.value.name,
                country: selectedCity.value.country
            }
        }

        // Update the vector source with the city point
        const source = map.value.getSource('vector-source') as mapboxgl.GeoJSONSource
        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: [cityFeature]
            })
        }
    } else {
        // Clear the vector source if no city is selected
        const source = map.value.getSource('vector-source') as mapboxgl.GeoJSONSource
        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: []
            })
        }
    }

}


const paintRasterTiles = () => {
    const minOrg = -100
    const step = 0.1
    const max = 100
    const palette = [
        { stop: -70, color: "rgba(102, 102, 102,1)", visible: true },
        { stop: -60, color: "rgba(153, 153, 153,1)", visible: true },
        { stop: -50, color: "rgba(102, 0, 102,1)", visible: true },
        { stop: -40, color: "rgba(153, 51, 255,1)", visible: true },
        { stop: -30, color: "rgba(0, 0, 255,1)", visible: true },
        { stop: -20, color: "rgba(0, 102, 153,1)", visible: true },
        { stop: -10, color: "rgba(0, 204, 255,1)", visible: true },
        { stop: 0, color: "rgba(102, 255, 255,1)", visible: true },
        { stop: 0.1, color: "rgba(0, 153, 51,1)", visible: false },
        { stop: 10, color: "rgba(0, 255, 0,1)", visible: true },
        { stop: 20, color: "rgba(255, 255, 0,1)", visible: true },
        { stop: 25, color: "rgba(255, 153, 51,1)", visible: true },
        { stop: 30, color: "rgba(255, 0, 0,1)", visible: true },
        { stop: 40, color: "rgba(255, 102, 204,1)", visible: true },
        { stop: 50, color: "rgba(255, 204, 255,1)", visible: true },
    ]

    let stops;
    let colors;
    stops = palette.map((x) => (x.stop - minOrg) / step);
    colors = palette.map((x) => x.color);


    const range = [0, (max - minOrg) / step];
    const mix = [256 * 256 * 256 * 1, 256 * 256 * 1, 256 * 1, 0];
    const colorScale = [];
    for (let i = 0; i < stops.length; i++) {
        colorScale.push(stops[i], colors[i]);
    }


    unref(map).setPaintProperty("raster-tiles-layer", "raster-color", [
        "interpolate",
        ["linear"],
        ["raster-value"],
        ...colorScale,
    ]);
    unref(map).setPaintProperty("raster-tiles-layer", "raster-color-mix", mix);
    unref(map).setPaintProperty("raster-tiles-layer", "raster-color-range", range);
}

</script>

<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100vh;
}

.historical-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    width: 300px;
}
</style>