export interface Blog {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    featured_image: string;
    author: string;
    published_at: string;
    read_time: number;
    content: string;
}

export const DEMO_BLOGS: Blog[] = [
    // BACK TO BASICS
    {
        id: 1,
        title: "Understanding Financial Statements",
        slug: "financial-statements-deep-dive",
        category: "back-to-basics",
        excerpt: "A comprehensive guide to reading and interpreting balance sheets, income statements, and cash flow statements.",
        featured_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-10",
        read_time: 5,
        content: "..."
    },
    {
        id: 2,
        title: "What is Market Capitalization?",
        slug: "market-cap-explained",
        category: "back-to-basics",
        excerpt: "Learn the fundamentals of market cap and why it matters for every modern investor.",
        featured_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-08",
        read_time: 4,
        content: "..."
    },
    {
        id: 3,
        title: "IPO Basics: The Investor's Entry Point",
        slug: "ipo-investing-basics",
        category: "back-to-basics",
        excerpt: "Everything you need to know about Initial Public Offerings before putting your capital at risk.",
        featured_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-05",
        read_time: 6,
        content: "..."
    },
    {
        id: 4,
        title: "Debt vs Equity: Choosing the Source",
        slug: "debt-vs-equity-finance",
        category: "back-to-basics",
        excerpt: "A breakdown of the two primary ways companies raise capital and what it means for growth.",
        featured_image: "https://images.unsplash.com/photo-1454165833767-027ffea7025c?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-01",
        read_time: 5,
        content: "..."
    },

    // CASE STUDIES
    {
        id: 5,
        title: "Tata Motors' Turnaround Strategy",
        slug: "tata-motors-success",
        category: "case-studies",
        excerpt: "How Tata Motors transformed from heavy losses to consistent profitability through strategic shifts.",
        featured_image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-12",
        read_time: 8,
        content: "..."
    },
    {
        id: 6,
        title: "Reliance Jio: The Digital Disruption",
        slug: "reliance-jio-impact",
        category: "case-studies",
        excerpt: "How Jio completely redefined the Indian telecom landscape with a data-first digital strategy.",
        featured_image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-09",
        read_time: 10,
        content: "..."
    },
    {
        id: 7,
        title: "Zomato's Journey to the Public Market",
        slug: "zomato-ipo-case-study",
        category: "case-studies",
        excerpt: "Analyzing the path of India's first food-tech unicorn to a blockbuster stock market debut.",
        featured_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-06",
        read_time: 7,
        content: "..."
    },
    {
        id: 8,
        title: "Nykaa: Building a Beauty Empire",
        slug: "nykaa-business-model",
        category: "case-studies",
        excerpt: "The strategic masterclass of Falguni Nayar in building a profitable niche e-commerce leader.",
        featured_image: "https://images.unsplash.com/photo-1596462502278-27bf87f65746?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-01-28",
        read_time: 9,
        content: "..."
    },

    // STOCK ANALYSIS
    {
        id: 9,
        title: "HDFC Bank: A Financial Fortress?",
        slug: "hdfc-bank-stock-analysis",
        category: "stock-analysis",
        excerpt: "Comprehensive analysis of HDFC Bank's financials, growth prospects, and post-merger position.",
        featured_image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-11",
        read_time: 9,
        content: "..."
    },
    {
        id: 10,
        title: "Infosys: Navigating the Tech Slowdown",
        slug: "infosys-q4-results-analysis",
        category: "stock-analysis",
        excerpt: "Detailed breakdown of Infosys' quarterly performance and what the future holds for IT stocks.",
        featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-07",
        read_time: 6,
        content: "..."
    },
    {
        id: 11,
        title: "Asian Paints: The Premium Valuation",
        slug: "asian-paints-metrics",
        category: "stock-analysis",
        excerpt: "Is the market favorite finally starting to look overvalued? A deep dive into paint sector metrics.",
        featured_image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-04",
        read_time: 7,
        content: "..."
    },
    {
        id: 12,
        title: "ITC: Beyond the Cigarette Business",
        slug: "itc-conglomerate-valuation",
        category: "stock-analysis",
        excerpt: "Analyzing the FMCG and Hotel business of ITC and its impact on long-term shareholder value.",
        featured_image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-01-30",
        read_time: 8,
        content: "..."
    },

    // 100 DAYS CHALLENGE
    {
        id: 13,
        title: "Day 1: Defining Your Financial North Star",
        slug: "investing-day-1",
        category: "100-days-challenge",
        excerpt: "Starting the journey to mastery. Today: how to define investment goals that actually matter.",
        featured_image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-13",
        read_time: 4,
        content: "..."
    },
    {
        id: 14,
        title: "Day 15: The Psychology of Risk Appetite",
        slug: "investing-day-15",
        category: "100-days-challenge",
        excerpt: "Assessing how your personal psychology shapes your portfolio's performance during market volatility.",
        featured_image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-10",
        read_time: 5,
        content: "..."
    },
    {
        id: 15,
        title: "Day 30: Advanced Portfolio Construction",
        slug: "investing-day-30",
        category: "100-days-challenge",
        excerpt: "Moving beyond simple diversification to building a resilient, all-weather investment portfolio.",
        featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-08",
        read_time: 6,
        content: "..."
    },
    {
        id: 16,
        title: "Day 45: Mastering Tax-Efficient Investing",
        slug: "investing-day-45",
        category: "100-days-challenge",
        excerpt: "It's not about how much you make, but how much you keep. A guide to legal tax optimization.",
        featured_image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-01-25",
        read_time: 7,
        content: "..."
    },

    // M&A DIARIES
    {
        id: 17,
        title: "The Walmart-Flipkart $16B Masterstroke",
        slug: "walmart-flipkart-acquisition",
        category: "ma-diaries",
        excerpt: "Breaking down the mechanics of Walmart's mega-bet on the Indian e-commerce consumer.",
        featured_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-12",
        read_time: 8,
        content: "..."
    },
    {
        id: 18,
        title: "Air India's Homecoming: The Tata Merger",
        slug: "air-india-tata-acquisition",
        category: "ma-diaries",
        excerpt: "Analyzing the strategic rationale and the massive challenges in integrating a legacy airline giant.",
        featured_image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-09",
        read_time: 9,
        content: "..."
    },
    {
        id: 19,
        title: "HDFC-HDFC Bank: The Mega-Merger Impact",
        slug: "hdfc-bank-merger-insights",
        category: "ma-diaries",
        excerpt: "The largest corporate marriage in Indian history. What it means for the banking ecosystem.",
        featured_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-02-05",
        read_time: 10,
        content: "..."
    },
    {
        id: 20,
        title: "L&T's Hostile Takeover of Mindtree",
        slug: "lt-mindtree-acquisition",
        category: "ma-diaries",
        excerpt: "A rare case study on hostile takeovers in the Indian IT sector and its eventual outcome.",
        featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        author: "Pushkar",
        published_at: "2024-01-20",
        read_time: 12,
        content: "..."
    }
];
