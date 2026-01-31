// assets/js/lost-data.js

// Supabase Configuration
const SUPABASE_URL = 'https://tdyebwcyamsqnnivynuk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeWVid2N5YW1zcW5uaXZ5bnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODY3NzQsImV4cCI6MjA4MzM0Njc3NH0.m_3QY9xMqohJRFalwf9PFRMDDHy-_d3gLTBC_U9tcYQ';

// Will be populated from database
let MOCK_LOST_ITEMS = [];

// Fetch lost items from Supabase
async function fetchLostItemsFromDB() {
    try {
        console.log('Supabase object available?', !!window.supabase);
        
        if (!window.supabase) {
            console.error('Supabase not loaded');
            return false;
        }

        const { createClient } = window.supabase;
        console.log('Creating Supabase client...');
        
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase client created');

        console.log('Fetching from lost_found_items table...');
        const { data, error } = await supabase
            .from('lost_found_items')
            .select('id, title, description, category, image_url, location_name, status, created_at, reward_amount, view_count, slug, is_anonymous, custody_type, custody_location_name, contact_method, contact_value, key_attributes');

        console.log('Fetch response - Data:', data);
        console.log('Fetch response - Error:', error);

        if (error) {
            console.error('Error fetching lost items:', error);
            return false;
        }

        if (data && data.length > 0) {
            console.log('Loaded', data.length, 'items from database');
            
            // Transform database data to match our display format
            MOCK_LOST_ITEMS = data.map(item => ({
                id: item.id,
                title: item.title,
                snippet: (item.description || '').substring(0, 150),
                status: item.status || 'LOST',
                location: item.location_name || 'Kampala',
                date: formatDate(item.created_at),
                image: item.image_url,
                color: item.status === 'FOUND' ? '#1e8e3e' : '#d93025',
                reward: item.reward_amount || 0,
                views: item.view_count || 0,
                category: item.category,
                slug: item.slug,
                isAnonymous: item.is_anonymous,
                custodyType: item.custody_type,
                custodyLocation: item.custody_location_name,
                contactMethod: item.contact_method,
                contactValue: item.contact_value,
                keyAttributes: item.key_attributes || {}
            }));

            console.log('Transformed items:', MOCK_LOST_ITEMS);
            return true;
        } else {
            console.log('No data returned from database');
            return false;
        }
    } catch (error) {
        console.error('Error in fetchLostItemsFromDB:', error);
        return false;
    }
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}