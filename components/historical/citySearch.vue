<template>
    <v-container class="searchBox" fluid>
        <v-card>
            <v-card-text>
                <v-autocomplete
                    v-model="selectedCityName"
                    :items="cityNames"
                    label="Currently Available Cities"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                ></v-autocomplete>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useHistoricalStore } from '~/stores/historical'
import { storeToRefs } from 'pinia'
const historicalStore = useHistoricalStore()

const { selectedCity } = storeToRefs(historicalStore)
const { get } = useApi()

const selectedCityName = ref<string>(''); // This will hold the selected city name
const cities = ref<{ City: string; Country: string; Lat: number; Lon: number; lat: number; lon: number }[]>([]); // This will hold the fetched city data
const cityNames = ref<string[]>([]);

onMounted(async () => {
    try {
        const response = await get('/cities')
        const data = await response.json()
        // Assuming data is an array of city names
        cities.value = data;
        cityNames.value = data.map((x: { City: string }) => x.City);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
});

// Watch for changes in selectedCityName and update the historical store
watch(selectedCityName, (newCityName) => {
    const city = cities.value.find(c => c.City === newCityName);
    if (city) {
        selectedCity.value = {
            name: city.City,
            country: city.Country,
            lat: city.Lat,
            lng: city.Lon
        };
    } else {
        selectedCity.value = null; // Reset if no city is found
    }
});
</script>


<style scoped>
.searchBox {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 16px;
    max-width: 400px;
    margin: auto;
}
</style>