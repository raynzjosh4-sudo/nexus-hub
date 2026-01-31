// assets/js/community-data.js

const MOCK_POSTS = [
    {
        id: "p1",
        title: "Which Boda app is actually reliable in Kampala right now?",
        body: "I've been using SafeBoda for years, but lately the wait times in Kololo are crazy. Has anyone tried the new Union App? Looking for safety first, but price matters too. I heard Bolt is cheaper but drivers cancel a lot.\n\nYesterday I waited 20 mins just to get a rider assigned. Is it just me?",
        category: "Transport",
        author: "Joshua Opiyo",
        created_at: "2 hours ago",
        tags: ["transport", "safety"],
        reply_count: 14,
        // 🟢 NEW: Comments Array
        comments: [
            { author: "Sarah K.", time: "1 hour ago", text: "Bolt is faster but they don't always have helmets. I stick to SafeBoda for night rides." },
            { author: "Mike D.", time: "45 mins ago", text: "Uber Moto is actually the cheapest right now. Try it." },
            { author: "Nexus Team", time: "Just now", text: "We are tracking boda prices live on the Nexus home page now!" }
        ]
    },
    {
        id: "p2",
        title: "Found: National ID for Sarah Namukasa in Wandegeya",
        body: "I found a National ID for Sarah Namukasa near the Wandegeya market entrance this morning. Dropped it at the nearby police post, but posting here just in case she sees it. Please share.",
        category: "Lost & Found",
        author: "Mark K.",
        created_at: "5 hours ago",
        tags: ["ID", "Wandegeya"],
        reply_count: 3,
        comments: [
            { author: "Sarah N.", time: "2 hours ago", text: "Please share this on Twitter too, tags work better there." }
        ]
    },
    // ... keep the rest of your items ...
];