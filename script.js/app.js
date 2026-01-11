import { supabase } from './services/supabase.js';
import { router } from './router.js';
import { renderLayout } from './utils.js'; // এটা আমরা পরে বানাবো, এখন থাক

// অ্যাপ শুরু
async function initApp() {
    console.log("🚀 NEVOX System Booting...");

    // ১. লোডিং স্ক্রিন দেখানো
    const loader = document.querySelector('.loader-screen');
    
    // ২. ইউজার লগিন আছে কিনা চেক করা
    const { data: { session } } = await supabase.auth.getSession();
    window.currentUser = session ? session.user : null;

    // ৩. রাউটার চালু করা (পেজ লোড)
    router();

    // ৪. হ্যাশ চেঞ্জ হলে পেজ বদলানো (Single Page App Logic)
    window.addEventListener('hashchange', router);

    // ৫. লোডার বন্ধ করা
    if(loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    }
}

// ডকুমেন্ট রেডি হলে চালু হবে
document.addEventListener('DOMContentLoaded', initApp);
