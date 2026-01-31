// assets/js/lost-widgets.js

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'df8w2fain';

function renderLostItem(item) {
    if (!item) return "";

    // Use absolute path so widgets work when rendered from root
    const detailLink = `/lost-and-found/detail.html?id=${item.id}`;

    // Handle image display with fallback
    let imageHtml = '';
    if (item.image) {
        let imageUrl = item.image;
        
        // If it's just a filename (no http), construct the Cloudinary URL
        if (!item.image.startsWith('http')) {
            imageUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${item.image}`;
        }
        
        console.log('Image URL:', imageUrl); // Debug log
        imageHtml = `<img src="${imageUrl}" alt="${item.title}" style="margin-left:16px; min-width:90px; width:90px; height:90px; object-fit:cover; border-radius:8px; border:1px solid #3c4043;" onerror="this.style.display='none'; console.log('Image failed to load: ${imageUrl}');" />`;
    }

    return `
    <div class="result-card" style="display:flex; justify-content:space-between; align-items:start;">
        <div style="flex:1;">
            <div class="site-info">
                <div class="site-icon-circle">
                    <span style="font-size:12px; font-weight:bold; color:${item.color};">
                        ${item.status === 'FOUND' ? '✓' : '!'}
                    </span>
                </div>
                <div class="site-name-block">
                    <span class="site-name">Nexus Lost & Found</span>
                    <span class="site-url">nexassearch.com › lost › ${item.location.toLowerCase().replace(/, /g, '-')}</span>
                </div>
            </div>

            <a href="${detailLink}" class="result-title">${item.title}</a>

            <div class="result-snippet">
                <span style="color:#bdc1c6;">${item.date} — </span>
                ${item.snippet}
            </div>
            
            <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                 <span style="color:#9aa0a6; font-size:12px; border:1px solid #3c4043; padding:2px 8px; border-radius:12px;">
                    📍 ${item.location}
                 </span>
                 ${item.category ? `<span style="color:#a855f7; font-size:12px; border:1px solid #8b5cf6; padding:2px 8px; border-radius:12px; background:rgba(168, 85, 247, 0.1);">
                    ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                 </span>` : ''}
            </div>
        </div>
        ${imageHtml}
    </div>
    `;
}