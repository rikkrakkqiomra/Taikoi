# Language System Documentation

## Overview

The website uses a custom JavaScript-based internationalization (i18n) system that supports seven languages: Finnish (fi), English (en), German (de), French (fr), Spanish (es), Dutch (nl), and Polish (pl). The system is designed to provide seamless language switching without page reloads while maintaining user preferences across sessions.

## Architecture

### Core Components

1. **i18n.js** - Main internationalization framework
2. **Translation Files** - JSON files in `/translations/` directory
3. **HTML Markup** - Elements with `data-i18n` attributes
4. **Language Switcher** - Flag buttons in the header

### Supported Languages

- 🇫🇮 **Finnish (fi)** - Default language
- 🇺🇸 **English (en)**
- 🇩🇪 **German (de)**
- 🇫🇷 **French (fr)**
- 🇪🇸 **Spanish (es)**
- 🇳🇱 **Dutch (nl)**
- 🇵🇱 **Polish (pl)**

## Translation Pipeline

### 1. Initialization Process

```javascript
// When page loads:
1. DOMContentLoaded event fires
2. I18n class constructor runs
3. Language detection occurs (stored preference → URL path → browser language → default)
4. Translation files are loaded via fetch()
5. Page content is translated
6. Language switcher is set up
```

### 2. Translation File Format

Translation files are stored as JSON in the `/translations/` directory:

```json
{
  "site_title": "Gold Digger Technologies",
  "hero_title": "Complete verifiability. Manageability. Modularity.",
  "nav_contact": "Contact",
  "form_name": "Name"
}
```

**File Structure:**
- `translations/fi.json` - Finnish translations
- `translations/en.json` - English translations  
- `translations/de.json` - German translations
- `translations/fr.json` - French translations
- `translations/es.json` - Spanish translations
- `translations/nl.json` - Dutch translations
- `translations/pl.json` - Polish translations

### 3. HTML Markup System

Elements that need translation are marked with `data-i18n` attributes:

```html
<!-- Text content -->
<h1 data-i18n="hero_title">Default Finnish text</h1>

<!-- Placeholder text -->
<input data-i18n="form_name" placeholder="Default placeholder">

<!-- Alt attributes -->
<img data-i18n-alt="logo_alt" alt="Default alt text">

<!-- Page title -->
<title data-i18n="site_title">Default title</title>
```

### 4. Translation Process

```javascript
// Translation workflow:
1. Element with data-i18n attribute is found
2. Key is extracted (e.g., "hero_title")
3. Translation is looked up in current language's JSON
4. Element content is replaced with translated text
5. Process repeats for all marked elements
```

### 5. Language Switching

```javascript
// When user clicks a flag:
1. switchLanguage(newLang) is called
2. Current language is updated
3. Language preference is stored in localStorage
4. New translation file is loaded
5. Page content is re-translated
6. Active flag state is updated
7. Hreflang tags are updated for SEO
```

## Language Detection Priority

1. **Stored Preference** - `localStorage.getItem('preferred-language')`
2. **URL Path** - `/en/`, `/de/`, `/fr/` (not currently implemented)
3. **Browser Language** - `navigator.language`
4. **Default** - Finnish (fi)

## Storage and Persistence

- **localStorage Key**: `preferred-language`
- **Format**: Language code (e.g., "en", "fi", "de", "fr")
- **Persistence**: Survives browser sessions and page reloads

## SEO Integration

The system automatically generates `hreflang` tags for search engines:

```html
<link rel="alternate" hreflang="fi" href="https://example.com/">
<link rel="alternate" hreflang="en" href="https://example.com/en/">
<link rel="alternate" hreflang="de" href="https://example.com/de/">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

## Fallback System

If translation files fail to load, the system uses hardcoded fallback translations:

```javascript
getFallbackTranslations(lang) {
  // Returns basic translations for core functionality
  // Ensures site remains functional even if JSON files are unavailable
}
```

## Current Issues and Why Language Switching May Not Work

### 1. **Path Resolution Problem** ✅ FIXED
**Issue**: The system was using absolute paths (`/translations/`) instead of relative paths (`translations/`)
**Impact**: Translation files couldn't be loaded, causing 404 errors
**Fix**: Changed fetch path from `/translations/${lang}.json` to `translations/${lang}.json`

### 2. **Hardcoded Active State** ✅ FIXED  
**Issue**: Finnish flag had `active` class hardcoded in HTML
**Impact**: JavaScript couldn't properly manage active states
**Fix**: Removed hardcoded `active` class, let JavaScript manage all states

### 3. **Translation Loading Failure** ✅ FIXED
**Issue**: Due to path problems, fallback translations were used instead of JSON files
**Impact**: Language switching appeared to work but used hardcoded text
**Fix**: Fixed path resolution to load actual JSON files

### 4. **Potential Remaining Issues**

#### A. **File Server Configuration**
- **Problem**: Some web servers don't serve JSON files by default
- **Solution**: Ensure server is configured to serve `.json` files with correct MIME type

#### B. **CORS Issues** (if testing locally)
- **Problem**: Local file:// protocol may block fetch requests
- **Solution**: Use a local web server (e.g., `python -m http.server 8000`)

#### C. **JavaScript Errors**
- **Problem**: Console errors may prevent i18n initialization
- **Solution**: Check browser console for JavaScript errors

#### D. **Timing Issues**
- **Problem**: i18n.js may load before DOM is ready
- **Solution**: The code has multiple initialization attempts to handle this

## Debugging Steps

### 1. Check Browser Console
```javascript
// Look for these messages:
"Initializing i18n with language: fi"
"Loading translations for language: fi"
"Successfully loaded translations for fi"
"Translating page with language: fi"
```

### 2. Verify File Loading
```javascript
// Check Network tab in DevTools
// Look for requests to: translations/fi.json, translations/en.json, etc.
// Status should be 200, not 404
```

### 3. Test Translation Loading
```javascript
// In browser console:
fetch('translations/en.json')
  .then(response => response.json())
  .then(data => console.log('EN translations:', data))
  .catch(error => console.error('Error:', error));
```

### 4. Check localStorage
```javascript
// In browser console:
localStorage.getItem('preferred-language')
// Should return current language code or null
```

## Best Practices

### 1. **Translation Keys**
- Use descriptive, hierarchical keys: `nav_contact`, `hero_title`
- Keep keys consistent across all language files
- Use lowercase with underscores for consistency

### 2. **Content Management**
- Always provide fallback text in HTML
- Keep translation files synchronized
- Test all languages regularly

### 3. **Performance**
- Translation files are loaded on-demand
- Only current language is loaded initially
- Fallback system ensures site functionality

### 4. **Maintenance**
- Add new translations to all language files
- Update fallback translations when adding new keys
- Test language switching on all pages

## File Structure Summary

```
Taikoi/
├── i18n.js                    # Main i18n framework
├── index.html                 # Main page with language switcher
├── contact.html              # Contact page
├── gdt.html                  # GDT page  
├── intelligentleman.html     # Research page
├── translations/
│   ├── fi.json              # Finnish translations
│   ├── en.json              # English translations
│   ├── de.json              # German translations
│   └── fr.json              # French translations
└── language.md              # This documentation
```

## Current Status

✅ **Language switching is working correctly** after fixing the path resolution and active state issues. The system now:

- Loads translation files properly from JSON
- Updates page content when language is switched
- Maintains active state for selected language
- Persists language preference across sessions
- Works on both mobile and desktop
- Only shows language switcher on the main page (index.html)

The language system is fully functional and ready for production use. 