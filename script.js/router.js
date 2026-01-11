import { supabase } from './services/supabase.js';

// 1. PAGE HANDLER
export async function router() {
    const main = document.querySelector('main');
    const hash = window.location.hash || '#home';

    // একটিভ মেনু হাইলাইট করা
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.remove('active');
        if(el.getAttribute('onclick')?.includes(hash.replace('#',''))) {
            el.classList.add('active');
        }
    });

    // লোডিং দেখানো
    main.innerHTML = `
        <div style="height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <div class="spinner"></div>
            <p style="margin-top:15px; color:var(--text-muted); animation:pulse 1.5s infinite">
                Connecting to ${hash.replace('#','').toUpperCase()}...
            </p>
        </div>`;

    try {
        // --- HOME / FEED PAGE ---
        if (hash === '#home' || hash === '#feed') {
            const { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('type', 'post') // শুধু পোস্ট দেখাবে
                .order('created_at', { ascending: false });

            if (error) throw error;
            renderPosts(posts, main, 'No posts yet. Be the first!');
        }

        // --- VIDEO HUB ---
        else if (hash === '#video') {
            const { data: videos } = await supabase
                .from('posts')
                .select('*')
                .eq('type', 'video') // শুধু ভিডিও দেখাবে
                .order('created_at', { ascending: false });

            renderPosts(videos, main, 'No videos available.');
        }

        // --- MARKETPLACE ---
        else if (hash === '#market') {
            const { data: products } = await supabase
                .from('posts')
                .select('*')
                .eq('type', 'product') // শুধু প্রোডাক্ট দেখাবে
                .order('created_at', { ascending: false });

            renderMarket(products, main);
        }

        // --- PROFILE PAGE ---
        else if (hash === '#profile') {
            if (!window.currentUser) {
                main.innerHTML = `
                    <div class="card text-center" style="max-width:400px; margin:50px auto;">
                        <h2>Access Denied</h2>
                        <p>Please login to view your profile.</p>
                        <button class="btn btn-primary mt-2" onclick="login()">Login with Google</button>
                    </div>`;
            } else {
                renderProfile(window.currentUser, main);
            }
        }

        // --- TOOLS PAGE ---
        else if (hash === '#tools') {
            renderTools(main);
        }

    } catch (err) {
        console.error('Error loading page:', err);
        main.innerHTML = `<div class="card error"><h3>Error Loading Content</h3><p>${err.message}</p></div>`;
    }
}

// 2. RENDER FUNCTIONS (Reusable)

function renderPosts(items, container, emptyMsg) {
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="text-center" style="padding:50px; color:var(--text-muted)">${emptyMsg}</div>`;
        return;
    }

    let html = '<div class="content-grid">';
    items.forEach(p => {
        html += `
        <div class="card">
            <div class="card-header">
                <div class="avatar"></div>
                <div>
                    <div style="font-weight:700">NEVOX Official</div>
                    <small style="color:var(--text-muted)">${new Date(p.created_at).toLocaleDateString()}</small>
                </div>
            </div>
            
            ${p.image ? `<img src="${p.image}" class="card-img" loading="lazy" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin:10px 0;">` : ''}
            
            <h3 class="card-title">${p.title}</h3>
            <p class="card-text">${p.content.substring(0, 150)}...</p>

            <div class="card-actions">
                <div class="action-btn"><i class="fa-regular fa-heart"></i> Like</div>
                <div class="action-btn"><i class="fa-regular fa-comment"></i> Comment</div>
                <div class="action-btn"><i class="fa-solid fa-share"></i> Share</div>
                <button class="btn btn-outline" style="margin-left:auto; padding:5px 15px; font-size:12px">Read</button>
            </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderMarket(items, container) {
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="text-center">No products found.</div>`;
        return;
    }

    let html = '<div class="content-grid">';
    items.forEach(p => {
        html += `
        <div class="card product-card">
            <div class="badge" style="position:absolute; top:10px; right:10px; z-index:10">$${p.price}</div>
            <img src="${p.image}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
            <h3 style="margin-top:10px">${p.title}</h3>
            <button class="btn btn-buy mt-2" style="width:100%" onclick="window.open('${p.link}', '_blank')">Buy Now</button>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderProfile(user, container) {
    container.innerHTML = `
        <div class="card text-center" style="max-width:500px; margin:0 auto;">
            <img src="${user.user_metadata.avatar_url}" style="width:100px; height:100px; border-radius:50%; border:3px solid var(--brand-primary); margin-bottom:15px;">
            <h2>${user.user_metadata.full_name}</h2>
            <p style="color:var(--text-muted)">${user.email}</p>
            
            <div style="display:flex; justify-content:space-around; margin:20px 0; border-top:1px solid var(--border); padding-top:20px;">
                <div><strong>0</strong><br><small>Posts</small></div>
                <div><strong>0</strong><br><small>Followers</small></div>
                <div><strong>$0.00</strong><br><small>Earnings</small></div>
            </div>
            
            <button class="btn btn-primary">Edit Profile</button>
            <button class="btn btn-outline" onclick="logout()">Logout</button>
        </div>
    `;
}

function renderTools(container) {
    container.innerHTML = `
        <div class="content-grid">
            <div class="card text-center" onclick="alert('QR Tool')">
                <i class="fa-solid fa-qrcode" style="font-size:40px; color:var(--brand-primary); margin-bottom:10px;"></i>
                <h3>QR Generator</h3>
            </div>
            <div class="card text-center" onclick="alert('PDF Tool')">
                <i class="fa-solid fa-file-pdf" style="font-size:40px; color:var(--danger); margin-bottom:10px;"></i>
                <h3>PDF Editor</h3>
            </div>
            <div class="card text-center" onclick="alert('AI Tool')">
                <i class="fa-solid fa-robot" style="font-size:40px; color:var(--brand-accent); margin-bottom:10px;"></i>
                <h3>AI Assistant</h3>
            </div>
        </div>
    `;
}
