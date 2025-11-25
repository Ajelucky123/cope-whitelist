// COPE PAIN Checker - Main Script

// COPE PAIN Tiers
const COPE_TIERS = [
    'Fresh Coper',
    'Initiated Survivor',
    'Battle-Hardened Degen',
    'Veteran of Cycles',
    'Supreme Cope Elder',
    'The Original Coper'
];

// Crypto Eras
const CRYPTO_ERAS = [
    'Bitcoin Genesis',
    'Altcoin Spring',
    'ICO Mania',
    'DeFi Summer',
    'NFT Boom',
    'Meme Coin Chaos',
    'Layer 2 Wars',
    'AI Token Hype',
    'RWA Revolution',
    'The Great Consolidation',
    'Regulatory Winter',
    'Institutional Adoption',
    'CBDC Era',
    'Quantum Resistance',
    'Interchain Future'
];

// COPE Arsenal Traits
const COPE_ARSENAL = [
    'Diamond Hands',
    'HODL Master',
    'DCA Strategist',
    'Yield Farmer',
    'NFT Collector',
    'DeFi Explorer',
    'Meme Coin Survivor',
    'Technical Analyst',
    'Fundamental Believer',
    'Community Builder',
    'Early Adopter',
    'Risk Manager',
    'Portfolio Diversifier',
    'Staking Enthusiast',
    'Cross-Chain Navigator',
    'Liquidity Provider',
    'Governance Participant',
    'Airdrop Hunter',
    'Whale Watcher',
    'FOMO Resister',
    'FUD Fighter',
    'Market Cycle Veteran',
    'Token Unlock Survivor',
    'Rug Pull Survivor',
    'Exchange Migration Expert',
    'Gas Fee Optimizer',
    'Smart Contract Auditor',
    'MEV Resistant',
    'Privacy Advocate',
    'Decentralization Purist'
];

// Cope Wisdom Quotes
const COPE_WISDOM = [
    "Time in the market beats timing the market.",
    "The best time to buy was yesterday. The second best time is now.",
    "We're still early.",
    "This is just the beginning.",
    "Adoption is inevitable.",
    "The fundamentals haven't changed.",
    "Zoom out on the chart.",
    "History doesn't repeat, but it rhymes.",
    "The market can stay irrational longer than you can stay solvent.",
    "Buy the dip, sell the rip.",
    "Not your keys, not your crypto.",
    "WAGMI - We're All Gonna Make It.",
    "The bear market is where fortunes are made.",
    "Patience is the ultimate alpha.",
    "Diversification is for protection, concentration is for wealth.",
    "The best investment is the one you understand.",
    "Fear and greed are the only two emotions in crypto.",
    "The market rewards patience and punishes panic.",
    "Every cycle brings new opportunities.",
    "The future is decentralized.",
    "Code is law, but community is everything.",
    "The only way to lose is to sell.",
    "Your keys, your crypto, your responsibility.",
    "The blockchain doesn't sleep.",
    "Innovation never stops, neither should you."
];

// Mock X OAuth 2.0 - Simulates connecting to X account
async function connectXAccount() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock user data - In production, this would come from X OAuth API
    const mockUserData = {
        username: 'crypto_warrior',
        profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto',
        created_at: '2015-03-15T10:30:00Z' // Random date for demo
    };

    // For demo purposes, randomize the created_at date to show different results
    const yearsAgo = Math.floor(Math.random() * 10) + 1; // 1-10 years ago
    const mockDate = new Date();
    mockDate.setFullYear(mockDate.getFullYear() - yearsAgo);
    mockDate.setMonth(Math.floor(Math.random() * 12));
    mockDate.setDate(Math.floor(Math.random() * 28) + 1);
    
    mockUserData.created_at = mockDate.toISOString();

    return mockUserData;
}

// Calculate account age in years
function calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return parseFloat(diffYears.toFixed(2));
}

// Calculate COPE PAIN Score
function calculateCopePain(accountAge) {
    return Math.floor(accountAge * 777);
}

// Assign COPE PAIN Tier based on account age
function assignPainTier(accountAge) {
    if (accountAge < 1) return COPE_TIERS[0]; // Fresh Coper
    if (accountAge < 2) return COPE_TIERS[1]; // Initiated Survivor
    if (accountAge < 3) return COPE_TIERS[2]; // Battle-Hardened Degen
    if (accountAge < 5) return COPE_TIERS[3]; // Veteran of Cycles
    if (accountAge < 8) return COPE_TIERS[4]; // Supreme Cope Elder
    return COPE_TIERS[5]; // The Original Coper
}

// Generate crypto eras survived based on account age
function generateErasSurvived(accountAge) {
    const erasCount = Math.min(
        Math.max(Math.floor(accountAge / 0.5), 2), // At least 2, scales with age
        CRYPTO_ERAS.length
    );
    
    // Shuffle and select eras
    const shuffled = [...CRYPTO_ERAS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, erasCount);
}

// Randomly select 4-7 traits from COPE Arsenal
function selectCopeArsenal() {
    const count = Math.floor(Math.random() * 4) + 4; // 4-7 traits
    const shuffled = [...COPE_ARSENAL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Randomly select 1 line from Cope Wisdom
function selectCopeWisdom() {
    return COPE_WISDOM[Math.floor(Math.random() * COPE_WISDOM.length)];
}

// Generate referral link
function generateReferralLink(username, copePain, tier) {
    const baseUrl = window.location.origin + window.location.pathname;
    const referralCode = btoa(`${username}-${copePain}-${tier}`).replace(/[+/=]/g, '').substring(0, 16);
    return `${baseUrl}?ref=${referralCode}`;
}

// Copy referral link to clipboard
async function copyReferralLink() {
    const referralLink = document.getElementById('referral-link');
    const copyBtn = document.getElementById('copy-btn');
    
    try {
        await navigator.clipboard.writeText(referralLink.value);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        referralLink.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    }
}

// Render COPE PAIN Card
function renderCopeCard(userData, accountAge, copePain, tier, eras, wisdom) {
    // Hide connect section
    document.getElementById('connect-section').classList.add('hidden');
    
    // Show card section
    const cardSection = document.getElementById('cope-card-section');
    cardSection.classList.remove('hidden');
    
    // Populate card data
    document.getElementById('profile-image').src = userData.profile_image_url;
    document.getElementById('profile-image').alt = `@${userData.username}`;
    document.getElementById('username').textContent = `@${userData.username}`;
    document.getElementById('age-years').textContent = accountAge.toFixed(2);
    document.getElementById('cope-pain-score').textContent = copePain.toLocaleString();
    document.getElementById('pain-tier').textContent = tier;
    
    // Generate and set referral link
    const referralLink = generateReferralLink(userData.username, copePain, tier);
    document.getElementById('referral-link').value = referralLink;
    
    // Render eras
    const erasList = document.getElementById('eras-list');
    erasList.innerHTML = '';
    eras.forEach(era => {
        const eraBadge = document.createElement('div');
        eraBadge.className = 'era-badge';
        eraBadge.textContent = era;
        erasList.appendChild(eraBadge);
    });
    
    // Render wisdom
    document.getElementById('cope-wisdom').textContent = `"${wisdom}"`;
}

// Main function to handle X account connection
async function handleConnect() {
    const connectBtn = document.getElementById('connect-btn');
    
    // Disable button and show loading state
    connectBtn.disabled = true;
    connectBtn.innerHTML = '<span>Connecting...</span>';
    
    try {
        // Connect to X account (mocked)
        const userData = await connectXAccount();
        
        // Calculate metrics
        const accountAge = calculateAccountAge(userData.created_at);
        const copePain = calculateCopePain(accountAge);
        const tier = assignPainTier(accountAge);
        const eras = generateErasSurvived(accountAge);
        const wisdom = selectCopeWisdom();
        
        // Render the card
        renderCopeCard(userData, accountAge, copePain, tier, eras, wisdom);
        
    } catch (error) {
        console.error('Error connecting to X account:', error);
        alert('Failed to connect to X account. Please try again.');
        connectBtn.disabled = false;
        connectBtn.innerHTML = `
            <svg class="x-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Connect X Account
        `;
    }
}

// Create floating background characters
function createFloatingBackground() {
    const floatingContainer = document.getElementById('floating-background');
    if (!floatingContainer) return;
    
    const numCharacters = 8; // Number of floating characters
    const minSize = 80;
    const maxSize = 150;
    
    for (let i = 0; i < numCharacters; i++) {
        const character = document.createElement('div');
        character.className = 'floating-character';
        
        const img = document.createElement('img');
        img.src = 'images/image.png';
        img.alt = 'Floating COPE';
        character.appendChild(img);
        
        // Random size
        const size = Math.random() * (maxSize - minSize) + minSize;
        character.style.width = `${size}px`;
        character.style.height = `${size}px`;
        
        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        character.style.left = `${startX}%`;
        character.style.top = `${startY}%`;
        
        // Random rotation
        const rotation = Math.random() * 360;
        character.style.transform = `rotate(${rotation}deg)`;
        
        // Random animation duration (15-30 seconds)
        const duration = Math.random() * 15 + 15;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        // Create unique animation with random movement
        const animationName = `float-${i}`;
        const moveX1 = (Math.random() * 300 - 150).toFixed(2);
        const moveY1 = (Math.random() * 300 - 150).toFixed(2);
        const moveX2 = (Math.random() * 300 - 150).toFixed(2);
        const moveY2 = (Math.random() * 300 - 150).toFixed(2);
        const moveX3 = (Math.random() * 300 - 150).toFixed(2);
        const moveY3 = (Math.random() * 300 - 150).toFixed(2);
        const rot1 = (rotation + Math.random() * 180).toFixed(2);
        const rot2 = (rotation + Math.random() * 360).toFixed(2);
        const rot3 = (rotation + Math.random() * 180).toFixed(2);
        
        const keyframes = `
            @keyframes ${animationName} {
                0% {
                    transform: translate(0, 0) rotate(${rotation}deg);
                }
                25% {
                    transform: translate(${moveX1}px, ${moveY1}px) rotate(${rot1}deg);
                }
                50% {
                    transform: translate(${moveX2}px, ${moveY2}px) rotate(${rot2}deg);
                }
                75% {
                    transform: translate(${moveX3}px, ${moveY3}px) rotate(${rot3}deg);
                }
                100% {
                    transform: translate(0, 0) rotate(${rotation}deg);
                }
            }
        `;
        
        // Add animation to style
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        // Apply animation
        character.style.animation = `${animationName} ${duration}s ease-in-out infinite`;
        character.style.animationDelay = `${delay}s`;
        
        floatingContainer.appendChild(character);
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-btn');
    connectBtn.addEventListener('click', handleConnect);
    
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyReferralLink);
    }
    
    // Create floating background
    createFloatingBackground();
});

