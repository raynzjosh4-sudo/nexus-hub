function renderGoogleResult(post) {
    if (!post) return "";

    // 🟢 NEW: Link to the detail page
    const link = `detail.html?id=${post.id}`;

    return `
    <div class="result-card">
        <div class="site-info">
            <div class="site-icon-circle">
                <img src="../assets/icon.png" style="width:18px; height:18px; object-fit:contain;">
            </div>
            <div class="site-name-block">
                <span class="site-name">Nexus Community</span>
                <span class="site-url">nexassearch.com › community › ${post.category.toLowerCase()}</span>
            </div>
            <div style="margin-left:auto; color:#9aa0a6;">⋮</div>
        </div>

        <a href="${link}" class="result-title">${post.title}</a>

        <div class="result-snippet">
            <span style="color:#bdc1c6;">${post.created_at} — </span>
            ${post.body.substring(0, 120)}...
        </div>

        <div class="sub-results">
            <a href="${link}" class="sub-link">Jump to ${post.reply_count} answers</a>
        </div>
    </div>
    `;
}