# Video Setup for Mapbox

## How to add your video file

You have two options for serving your video file to Mapbox:

### Option 1: Public Directory (Recommended)
Place your video file at:
```
/public/videos/z.mp4
```

This is the simplest approach for static video files. The file will be served directly by Nuxt's static file server.

### Option 2: Server API (For dynamic or large files)
Place your video file at:
```
/server/videos/z.mp4
```

This approach uses a custom API endpoint at `/api/video/z.mp4` which can handle:
- Dynamic video selection
- Authentication/authorization
- Streaming for large files
- Custom headers and caching

## Video Requirements

- Format: MP4 (recommended for web compatibility)
- The video will be overlaid on the entire world map
- Coordinates are set to cover the full world bounds
- Video opacity is set to 80% so the map is still visible underneath

## Current Configuration

The code automatically tries both paths and uses whichever is available:
1. First tries `/videos/z.mp4` (public directory)
2. Falls back to `/api/video/z.mp4` (server API)
3. Shows console warnings if neither is found

## Customization

You can modify the video coordinates, opacity, and other properties in the `addLayer()` function in `/pages/index.vue`.
