<template>
    <div>
        <v-btn icon color="warning" variant="text" @click="showInfo = true">
            <v-icon>mdi-information-variant-circle-outline</v-icon>
        </v-btn>

        <v-dialog v-model="showInfo" scrollable max-width="600px">
            <v-card class="pa-4" elevation="2">
                <v-card-title class="text-h6">
                    <v-icon left class="mr-2">mdi-information</v-icon>
                    About This Page
                </v-card-title>

                <v-card-text style="font-size: small;">
                    <v-expansion-panels multiple>
                        <!-- HOW TO USE -->
                        <v-expansion-panel>
                            <v-expansion-panel-title>
                                <v-icon left class="mr-2">mdi-compass</v-icon>
                                How to Use
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list dense>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-map-marker</v-icon>
                                        Select a city from the map or search box.
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-calendar</v-icon>
                                        Choose a year between 1940 and 2025.
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-magnify</v-icon>
                                        Click the expand icon to open the plot in a new tab.
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-download</v-icon>
                                        Click the download icon to save the image.
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>

                        <!-- WHAT YOU'RE SEEING -->
                        <v-expansion-panel>
                            <v-expansion-panel-title>
                                <v-icon left class="mr-2">mdi-chart-donut</v-icon>
                                What You're Seeing
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p>
                                    Each circular diagram displays 365 (366) daily 2m temperature bars in a year-long
                                    ring:
                                </p>
                                <v-list dense>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-arrow-up-down</v-icon>
                                        <strong>Bar length</strong>: daily 2m air temperature range
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-palette</v-icon>
                                        <strong>Color</strong>: indicates temperature
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon left class="mr-2">mdi-calendar-month</v-icon>
                                        <strong>Labels</strong>: help you track months and seasonal shifts
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>

                        <!-- DATA SOURCE -->
                        <v-expansion-panel>
                            <v-expansion-panel-title>
                                <v-icon left class="mr-2">mdi-database</v-icon>
                                Data Source
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p>
                                    All data is sourced from the
                                    <strong>ERA5 reanalysis dataset</strong> (Copernicus Climate Data Store),
                                    using the <em>“ERA5 daily statistics on single levels from 1940 to present”</em>.
                                </p>
                            </v-expansion-panel-text>
                        </v-expansion-panel>

                        <!-- REQUEST NEW LOCATION -->
                        <v-expansion-panel>
                            <v-expansion-panel-title>
                                <v-icon left class="mr-2">mdi-map-plus</v-icon>
                                Request Another Location
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p>
                                    Want to see a different city or region? We're expanding coverage regularly.
                                </p>
                                <HistoricalRequestForm class="mt-2" @request-submitted="isRequestSubmitted = true"
                                    @error="isRequestFailed = true" />
                                <p v-if="isRequestSubmitted" class="mt-2 text-success">
                                    {{ successMsg }}
                                </p>
                                <p v-if="isRequestFailed" class="mt-2 text-error">
                                    {{ errorMsg }}
                                </p>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const showInfo = ref(false)
const isRequestSubmitted = ref(false)
const isRequestFailed = ref(false)

const successMsg = ref('Request submitted successfully! You will be notified when the image is available.')
const errorMsg = ref('An error occurred while submitting your request. Please try again later.')

watch(showInfo, () => {
    isRequestSubmitted.value = false
    isRequestFailed.value = false
})
</script>