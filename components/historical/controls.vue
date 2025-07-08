<template>
    <v-container class="historical-controls" fluid>
        <!-- Search Bar -->
        <v-row>
            <!-- <v-col cols="12">
                <v-text-field v-model="searchQuery" label="Search cities..." prepend-inner-icon="mdi-magnify"
                    variant="outlined" clearable density="compact" hide-details />
            </v-col> -->

            <!-- Stat -->
            <!-- <v-col cols="12">
                <div class="d-flex align-center">
                    <v-select v-model="selectedStat" :items="stats" label="Stat" variant="outlined"
                        density="compact" hide-details class="mx-2" />
                </div>
            </v-col> -->

            <!-- Year Selection -->
            <v-col cols="12">
                <div class="d-flex align-center">
                    <v-select v-model="selectedYear" :items="availableYears" label="Year" variant="outlined"
                        density="compact" hide-details class="mx-2" />
                    <v-btn @click="firstYear" icon="mdi-chevron-double-left" variant="text" size="small" />
                    <v-btn @click="previousYear" icon="mdi-chevron-left" variant="text" size="small" />
                    <v-btn @click="nextYear" icon="mdi-chevron-right" variant="text" size="small" />
                    <v-btn @click="lastYear" icon="mdi-chevron-double-right" variant="text" size="small" />
                    <v-btn @click="togglePlayback" :icon="isPlaying ? 'mdi-pause-circle' : 'mdi-play-circle'" variant="text"
                        size="small" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHistoricalStore } from '~/stores/historical'
import { storeToRefs } from 'pinia'
const historicalStore = useHistoricalStore()

// Use storeToRefs to maintain reactivity when destructuring


////////////////////////////////  REFS  ////////////////////////////////////
const {
    selectedYear,
    availableYears,
    isPlaying
} = storeToRefs(historicalStore)

// Destructure methods (these don't need reactivity)
const {
    previousYear,
    nextYear,
    firstYear,
    lastYear,
    initializeDefaults,
    togglePlayback
} = historicalStore

////////////////////////////////  HOOKS  ////////////////////////////////////
onMounted(() => {
    // Initialize defaults if not already set
    if (!selectedYear.value) {
        initializeDefaults()
    }
})


////////////////////////////////  METHODS  ////////////////////////////////////

</script>

<style scoped>
.historical-controls {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}
</style>