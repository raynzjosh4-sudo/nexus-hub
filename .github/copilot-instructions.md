# Nexus Hub - AI Coding Agent Instructions

**Project**: Nexus - "The Operating System for Uganda" - a community platform for lost & found, community forums, item swaps, and local services discovery.

## Architecture Overview

Nexus is a **static frontend application** with JavaScript interactivity and Supabase backend integration:

```
Frontend (HTML/CSS/JS) 
  └─ supabase-js library →  Supabase Database (lost_found_items, community posts)
  └─ Cloudinary API → Image hosting for lost items
  └─ Vercel deployment
```

**Key Pages**:
- `index.html` - Homepage with theme toggle (light/dark), navigation, hero section  
- `community/index.html` - Forum-style community posts with Google search result styling
- `lost-and-found/index.html` - Lost & found items grid with Cloudinary image display
- `category/index.html`, `swap/`, `help/` - Feature-specific pages

## SEO & Search Discoverability

### Sitemap & Robot Configuration
- **`robots.txt`**: Allows all crawlers, disallows `/api/`, links to sitemap
- **`sitemap.xml`**: Contains all main pages; dynamic item URLs commented (requires Supabase fetch during build)
- **Submit to Google**: Use Google Search Console to submit sitemap and monitor indexing

### Dynamic Meta Tags for SEO
Both detail pages (`lost-and-found/detail.html` and `community/detail.html`) implement dynamic meta tag updates:
- Page title updates: `document.title` + `#page-title` element
- Meta description: `#meta-description` element updated per item
- OG tags: `#og-title`, `#og-description`, `#og-image`, `#og-url` for social sharing
- Twitter cards: `#twitter-title`, `#twitter-description`, `#twitter-image`

**Implementation Pattern**:
```javascript
// After fetching item from Supabase, call:
updateOGTags({
  title: `${item.title} - Lost & Found`,
  description: item.description.substring(0, 155),
  image: cloudinaryUrl,
  url: window.location.href
});
```

### JSON-LD Schema Markup
- **Lost items**: Article schema with Report type, location, status (LOST/FOUND)
- **Community posts**: DiscussionForumPosting schema with interaction statistics
- **Schema placeholders**: `#schema-placeholder` (lost) and `#community-schema` (community)
- Updated via `updateJSONLDSchema()` and `updateCommunityJSONLD()` functions

### Helper File
- `js/seo-helpers.js`: Contains meta tag templates and schema.org structure definitions (for future server-side sitemap generation)

## Styling & Theme System

### Color Palette (Dark/Light Mode)
**Primary**: Deep purple `#a855f7` (accents, borders)
**Dark**: `#1a0f2e` (nav, headers), `#000000` (background), `#0f0a1a` (sections)
**Light Mode**: Override with `body.light-mode` class for `#f9f9f9` background + `#1a1a1a` text

Theme toggle controlled via `body.light-mode` class - add CSS overrides for light mode variant.

### Key Files
- `assets/css/theme.css` - Base theme variables
- `assets/css/google-dark.css` - Google search result styling 
- Inline `<style>` blocks in each HTML for page-specific customization

## Data & Backend Integration

### Supabase (`js/lost-data.js`)
**Database Table**: `lost_found_items` with schema:
```
id, title, description, category, image_url, location_name, 
status (LOST|FOUND), created_at, reward_amount, view_count, 
slug, is_anonymous, custody_type, custody_location_name, 
contact_method, contact_value, key_attributes
```

**Pattern**: 
1. Fetch live data → `fetchLostItemsFromDB()`
2. Transform DB format to display format (e.g., `location_name` → `location`)
3. Render using widget function

**Environment**: Set `SUPABASE_URL` and `SUPABASE_KEY` in `.env` (exposed in `lost-data.js` for client-side use)

### Community Posts (`js/community-data.js`)
Mock posts structure:
```javascript
{
  id, title, body, category, author, created_at, tags, reply_count, 
  comments: [{ author, time, text }]
}
```
Implement real Supabase integration by replacing mock `MOCK_POSTS` array.

### Cloudinary Images (`js/lost-widgets.js`)
- Cloud name: `df8w2fain`
- Image URLs: Transform `image_url` from storage path to full CDN URL:
  ```javascript
  // If not http, build: https://res.cloudinary.com/df8w2fain/image/upload/{image}
  ```
- Fallback: `onerror` handler hides broken images

## Widget Pattern

Render functions transform data objects into HTML strings. **Avoid templating engines** - use string concatenation:

```javascript
function renderLostItem(item) {
  const detailLink = `/lost-and-found/detail.html?id=${item.id}`;
  return `
    <div class="result-card">
      <a href="${detailLink}">${item.title}</a>
      ...
    </div>
  `;
}
```

**Key convention**: Use absolute URLs (`/path`) for cross-page navigation so widgets work from any page.

## Navigation & Routing

- **Query params for state**: `detail.html?id=123` passes item ID from list to detail view
- **Always use absolute paths** in links (`/page` not `./page`) 
- **Index navigation**: Each section folder has `index.html` as main page, `detail.html` for individual items

## Development Workflow

1. **Local data**: Use mock arrays (`MOCK_POSTS`, `MOCK_LOST_ITEMS`) for dev/testing
2. **Async loading**: Detail pages use shimmer skeleton loaders during Supabase fetch
3. **Error handling**: Log to console; fallback to hardcoded data if DB unavailable
4. **Image fallback**: Cloudinary URLs auto-fail gracefully with `onerror`

## Deployment

- **Vercel** (`vercel.json`): Environment variables exposed as build-time secrets
- **Set vars**: `SUPABASE_URL`, `SUPABASE_KEY`, `CLOUDINARY_CLOUD_NAME` in Vercel dashboard
- **Procfile**: Legacy Heroku config - Vercel is primary target

## Common Tasks

**Add new page section**:
1. Create folder with `index.html`
2. Use Google result styling from `google-dark.css` for consistency
3. Add nav link to main header
4. Fetch data via Supabase if needed

**Add modal/form**:
- Keep styling dark theme with `#2d1b4e` borders
- Use inline styles or link `theme.css`
- Avoid framework dependencies

**Debug data flow**:
- Check `fetchLostItemsFromDB()` in browser console for Supabase errors
- Verify `image_url` format in DB - must be Cloudinary path or full URL
- Log `MOCK_POSTS` structure if community posts not rendering

**Debug SEO issues**:
- Check meta tags in `<head>` using DevTools Inspector
- Verify OG tags update after data loads: `document.querySelector('meta[property="og:title"]').content`
- Test schema markup on [Schema.org validator](https://validator.schema.org/)
- Submit URLs to Google Search Console for manual indexing (wait 2-4 weeks for crawl)
