# Debug: Content Not Showing

## Quick Browser Console Check

Open your browser console (F12) and run these commands:

### 1. Check if page loaded:
```javascript
// Check if React app is running
console.log('React DevTools:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? 'Available' : 'Not available');
```

### 2. Check if topic loaded:
```javascript
// Check URL params
const urlParams = new URLSearchParams(window.location.search);
console.log('URL Params:', Object.fromEntries(urlParams));
console.log('Current Path:', window.location.pathname);
```

### 3. Check for JavaScript errors:
Look in the Console tab for any RED error messages.

### 4. Check Network requests:
1. Go to Network tab
2. Refresh page
3. Look for failed requests (red status)
4. Check requests to `/rest/v1/topics` and `/rest/v1/subtopics`

## What You Should See

When the page loads, in the Console you should see:
- ✅ Supabase client initialized
- Loading topics...
- Topics loaded: X topics
- Subtopics loaded: X subtopics

## If Nothing Shows in Console

1. **Check if page is actually loading**
   - Look at the browser tab - is it stuck loading?
   - Check Network tab for pending requests

2. **Check if there's a JavaScript error blocking render**
   - Look for red errors in Console
   - Check if React is initialized

3. **Try in incognito mode**
   - Open new incognito/private window
   - Go to the page
   - See if it works there

## Share This Information

Please share:
1. Any error messages from Console (copy/paste)
2. Screenshot of the Network tab showing failed requests
3. What you see on the page (screenshot or description)

