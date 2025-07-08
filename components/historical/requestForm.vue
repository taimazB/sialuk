<template>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="submitRequest" class="ma-3"
        style="border: 1px solid #eee; padding: 16px; border-radius: 8px;">
        <v-label class="mb-9">You can submit a request using the form below.</v-label>
        <v-text-field v-model="cityName" density="compact" variant="outlined" label="City Name" :rules="rules.required"></v-text-field>
        <v-text-field v-model="lat" density="compact" variant="outlined" label="Latitude" type="number" step="any" :rules="rules.required"></v-text-field>
        <v-text-field v-model="lng" density="compact" variant="outlined" label="Longitude" type="number" step="any" :rules="rules.required"></v-text-field>
        <v-text-field v-model="email" density="compact" variant="outlined" label="Your Email" persistent-hint
            hint="Enter your email to get notified" type="email" :rules="rules.email"></v-text-field>

        <v-btn class="mt-2" color="primary" text="Submit Request" type="submit"></v-btn>
    </v-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const email = ref<string>('');
const formRef = ref();

const rules = {
    email: [
        (v: string) => !v || /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    required: [(v: string) => !!v || 'This field is required']
};

const cityName = ref<string>('');
const lat = ref<number | null>(null);
const lng = ref<number | null>(null);

const props = defineProps<{
    cityName?: string;
    lat?: number;
    lng?: number;
}>();

const emit = defineEmits<{
    (e: 'request-submitted'): void;
    (e: 'error', message: string): void;
}>();

onMounted(() => {
    // If city is provided, pre-fill the form fields
    cityName.value = props.cityName || '';
    lat.value = props.lat || null;
    lng.value = props.lng || null;

});

// Submit request for image
const submitRequest = async () => {
    // Validate the form before submitting
    const { valid } = await formRef.value.validate();
    
    if (!valid) {
        console.log('Form validation failed');
        return; // Don't submit if form is not valid
    }

    try {
        const requestData = {
            city: cityName.value,
            lat: lat.value,
            lng: lng.value,
            email: email.value,
        };

        const response = await fetch('http://localhost:3001/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit request');
        }

        emit('request-submitted');
    } catch (error) {
        console.error('Error submitting request:', error);
        // emit an error event if needed
        emit('error', error instanceof Error ? error.message : 'Unknown error');
    }
};

</script>