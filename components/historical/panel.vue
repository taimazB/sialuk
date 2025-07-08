<template>
    <v-card height="100%" class="d-flex flex-column overflow-hidden">
        <HistoricalControls class="historical-controls" />
        <v-card-title>
            {{ props.city?.name }}
        </v-card-title>
        <v-card-subtitle>
            {{ props.city?.country }}
        </v-card-subtitle>
        <v-card-text class="flex-grow-1 pa-0" style="min-height: 0; overflow: hidden;">
            <!-- <div v-if="isLoading" class="text-center d-flex align-center justify-center" style="height: 100%;">
                <div>
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <p class="mt-2">Loading image...</p>
                </div>
            </div> -->
            <div v-if="imageError || isRequestSubmitted" class="text-center d-flex align-center justify-center"
                style="height: 100%;">
                <div>
                    <v-icon v-if="imageError" color="error" size="48">mdi-alert-circle</v-icon>
                    <p v-if="imageError" class="mt-2 text-error">{{ imageError }}</p>

                    <HistoricalRequestForm v-if="imageError && !isRequestSubmitted" :city-name="props.city?.name"
                        :lat="props.city?.lat" :lng="props.city?.lng" @request-submitted="isRequestSubmitted = true" @error="imageError = $event" />

                    <v-alert v-if="isRequestSubmitted" type="success" class="ma-3"
                        text="Request submitted successfully! You will be notified when the image is available."></v-alert>
                </div>
            </div>
            <v-img v-else-if="imageUrl" :src="imageUrl" :alt="props.city?.name" cover style=" width: 100%;"
                @error="imageError = 'Failed to load image'">
                <v-row class="ma-0 pa-2" style="position: absolute; top: 0; right: 0;">
                    <v-btn size="x-small" icon v-if="imageUrl" variant="tonal" color="primary" @click="downloadImage"
                        :disabled="isLoading" class="mr-1">
                        <v-icon>mdi-download</v-icon>
                        <v-tooltip activator="parent" location="bottom">Download Image</v-tooltip>
                    </v-btn>
                    <v-btn size="x-small" icon v-if="imageUrl" variant="tonal" color="secondary" @click="openInNewTab"
                        :disabled="isLoading">
                        <v-icon>mdi-open-in-new</v-icon>
                        <v-tooltip activator="parent" location="bottom">Open in New Tab</v-tooltip>
                    </v-btn>
                </v-row>
            </v-img>
            <div v-else class="text-center d-flex align-center justify-center" style="height: 100%;">
                <div>
                    <v-icon color="grey" size="48">mdi-image-off</v-icon>
                    <p class="mt-2 text-grey">No image available</p>
                </div>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="warning" @click="$emit('close')">
                Close
            </v-btn>
        </v-card-actions>
    </v-card>

</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useHistoricalStore } from '~/stores/historical';
const historicalStore = useHistoricalStore();


interface Props {
    city: { name: string; country: string, lat: number, lng: number } | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const { selectedYear } = storeToRefs(historicalStore);


/////////////////////////////////////  REFS  ////////////////////////////////////
const imageUrl = ref<string>('');
const isLoading = ref<boolean>(false);
const imageError = ref<string>('');
const isRequestSubmitted = ref<boolean>(false);


/////////////////////////////////////  METHODS  ////////////////////////////////////
const fetchImage = async (lat: number, lng: number, year?: number) => {
    try {
        isLoading.value = true;
        imageError.value = '';

        lat = Math.floor(lat * 4) / 4
        lng = Math.floor(lng * 4) / 4

        const yearToUse = year || selectedYear.value || 1940;
        const url = `http://localhost:3001/renders/minmax/lat${lat.toFixed(2)}/lon${lng.toFixed(2)}/${yearToUse}_1.png`;

        // Test if the image URL is accessible
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Data not available for ${props.city?.name} in ${yearToUse}.`);
        }

        // If the request is successful, set the URL directly
        imageUrl.value = url;

    } catch (error) {
        console.error('Error loading image:', error);
        imageUrl.value = ''; // Clear the image on error
        imageError.value = error instanceof Error ? error.message : 'Failed to load image';
    } finally {
        isLoading.value = false;
    }
};

const downloadImage = async () => {
    if (!imageUrl.value) return;

    try {
        const response = await fetch(imageUrl.value);
        const blob = await response.blob();

        // Create a download link
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;

        // Generate filename based on city and year
        const fileName = `${props.city?.name || 'image'}_${selectedYear.value || 1940}.png`;
        link.download = fileName;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

const openInNewTab = () => {
    if (!imageUrl.value) return;
    window.open(imageUrl.value, '_blank');
};


// Watch for city changes
watch(() => props.city, (newCity) => {
    if (newCity) {
        fetchImage(newCity.lat, newCity.lng);
    } else {
        // Clear image when no city is selected
        imageUrl.value = '';
        imageError.value = '';
        isLoading.value = false;
    }
}, { immediate: true });

// Watch for selectedYear changes
watch(selectedYear, (newYear) => {
    if (props.city && newYear) {
        fetchImage(props.city.lat, props.city.lng, newYear);
    }
});

</script>