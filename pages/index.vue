<template>
  <div>
    <!-- This page will redirect to climate-rings -->
  </div>
</template>

<script setup lang="ts">
// SEO for homepage before redirect
useSeoMeta({
  title: 'Sialuk - Climate Data Visualization Platform',
  description: 'Interactive platform for exploring climate data and environmental trends. Visualize temperature patterns, weather data, and climate change through interactive maps.',
  keywords: 'climate data, weather visualization, environmental data, climate change, temperature maps',
  ogTitle: 'Sialuk - Climate Data Visualization',
  ogDescription: 'Interactive platform for exploring climate data and environmental trends.',
  ogImage: '/og-image.jpg',
  ogUrl: 'https://sialuk.com',
  ogType: 'website'
})

// Redirect to climate-rings page when accessing the home page
await navigateTo('/climate-rings', { redirectCode: 301 })
</script>
