<template>
    <v-app>
        <v-app-bar density="compact">
            <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
            <v-toolbar-title>Sialuk Daily Forecast Videos</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="drawerOpen" location="left" width="300">
            <v-list>
                <v-list-subheader>Provinces</v-list-subheader>
                <v-list-item v-for="(province, index) in provinces" :key="province.value"
                    @click="iSelectedProvince = index" :active="iSelectedProvince === index"
                    :title="province.label" />
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                <div v-if="iSelectedProvince !== null">
                    <v-row>
                        <v-col cols="auto">
                            <h2 class="mb-4">{{ provinces[iSelectedProvince].label }}</h2>
                        </v-col>
                        <v-col>
                            <v-btn icon size="x-small" class="mb-4" color="primary" @click="toggleAllVideos">
                                <v-icon>{{ allVideosPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>


                    <v-row>
                        <v-col v-for="field in fields" :key="field.key" cols="12" md="4">
                            <v-card>
                                <video controls loop autoplay muted style="width:100%;"
                                    :key="`${provinces[iSelectedProvince].value}_${field.key}`">
                                    <source
                                        :src="`https://taimazdo.ddns.net/sialuk_videos/${provinces[iSelectedProvince].value}_${field.key}.mp4`"
                                        type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
                <div v-else>
                    <v-alert type="info">Please select a province to view videos.</v-alert>
                </div>
            </v-col>
        </v-row>
    </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, navigateTo } from '#imports';
import { useDisplay } from 'vuetify';

const route = useRoute();
const { lgAndUp } = useDisplay();

const drawerOpen = ref<boolean>(lgAndUp.value);
const allVideosPaused = ref<boolean>(false);
const iSelectedProvince = ref<number | null>(null);
const selectedProvince = ref<string | null>(null);
const provinces = ref([
    { label: 'Newfoundland', value: 'N' },
    { label: 'Labrador', value: 'L' },
    { label: 'Nova Scotia', value: 'NS' },
    { label: 'New Brunswick', value: 'NB' },
    { label: 'Quebec', value: 'QC' },
    { label: 'Ontario', value: 'ON' },
    { label: 'Manitoba', value: 'MB' },
    { label: 'Saskatchewan', value: 'SK' },
    { label: 'Alberta', value: 'AB' },
    { label: 'British Columbia', value: 'BC' }
]);
const fields = ref([
    { label: 'Temperature', key: 'TMP' },
    { label: 'Humidex', key: 'Humidex' },
    { label: 'Wind Chill', key: 'WCHIL' },
    { label: 'Cloud Cover', key: 'TCDC' },
    { label: 'Rain', key: 'CONDALPCPN' },
    { label: 'Total Rain', key: 'TOTALRAIN' },
    { label: 'Snow', key: 'CONDASSN' },
    { label: 'Total Snow', key: 'TOTALSNOW' },
    { label: 'Snow Depth', key: 'SNOD' },
    { label: 'Wind Speed', key: 'WSPD' },
    { label: 'Gust', key: 'GUST' },
    { label: 'Pressure', key: 'PRMSL' },
    { label: 'Humidity', key: 'RH' },
    { label: 'PM2.5 at Surface µg/m³', key: 'PM25SFC' }
])

// Pause all videos function
function toggleAllVideos() {
    allVideosPaused.value = !allVideosPaused.value;
    document.querySelectorAll('video').forEach((video) => {
        if (allVideosPaused.value) {
            video.pause();
        } else {
            video.play();
        }
    });
}

// Watch for changes in iSelectedProvince and update the URL
watch(iSelectedProvince, (newValue) => {
    if (newValue !== null) {
        selectedProvince.value = provinces.value[newValue].value;
        navigateTo(`/daily?province=${provinces.value[newValue].value}`);
    }
});

// On page load, check if there's a province in the URL
onMounted(() => {
    const provinceParam = route.query.province as string;
    if (provinceParam) {
        const provinceIndex = provinces.value.findIndex(p => p.value === provinceParam);
        if (provinceIndex !== -1) {
            iSelectedProvince.value = provinceIndex;
            selectedProvince.value = provinceParam;
        }
    }
});
</script>

<style scoped>
.sialuk-page {
    padding: 20px;
}
</style>