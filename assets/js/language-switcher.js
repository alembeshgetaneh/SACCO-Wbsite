// Language Switcher functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('selectedLanguage') || 'en';
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.services': 'Services',
                'nav.membership': 'Membership',
                'nav.news': 'News',
                'nav.downloads': 'Downloads',
                'nav.gallery': 'Gallery',
                'nav.contact': 'Contact',
                'nav.memberLogin': 'Member Login',
                
                // Hero Section
                'hero.title': 'Welcome to Maaddii SACCOs',
                'hero.subtitle': 'Your trusted partner for savings, loans, and financial growth.',
                'hero.joinNow': 'Join Now',
                'hero.exploreMore': 'Explore More',
                
                // About Section
                'about.title': 'About Maaddii SACCOs',
                'about.description': 'Maaddii SACCOs is a community-based financial cooperative dedicated to improving the economic well-being of our members through savings, loans, and financial education. Since our establishment, we\'ve helped members achieve financial stability and growth.',
                'about.readMore': 'Read More',
                
                // Services Section
                'services.title': 'Our Services',
                'services.subtitle': 'Comprehensive financial solutions designed for your success',
                
                // Membership Section
                'membership.title': 'Membership Benefits',
                'membership.subtitle': 'Join our cooperative and enjoy exclusive benefits',
                
                // News Section
                'news.title': 'Latest News & Updates',
                'news.subtitle': 'Stay informed about our latest activities and announcements',
                
                // Contact Section
                'contact.title': 'Contact Us',
                'contact.subtitle': 'Get in touch with us for any inquiries or support',
                
                // Footer
                'footer.description': 'Empowering communities through financial inclusion and cooperative development.',
                'footer.quickLinks': 'Quick Links',
                'footer.services': 'Services',
                'footer.contactInfo': 'Contact Info',
                'footer.copyright': '© 2024 Maaddii SACCOs. All rights reserved.'
            },
            am: {
                // Navigation
                'nav.home': 'ዋና ገጽ',
                'nav.about': 'ስለ እኛ',
                'nav.services': 'አገልግሎቶች',
                'nav.membership': 'አባልነት',
                'nav.news': 'ዜና',
                'nav.downloads': 'ያውርዱ',
                'nav.gallery': 'ጋለሪ',
                'nav.contact': 'አድራሻ',
                'nav.memberLogin': 'የአባል መግቢያ',
                
                // Hero Section
                'hero.title': 'ወደ ማድዲ ሳኮ እንኳን በደህና መጡ',
                'hero.subtitle': 'የተማፀነ አጋራዎ ለገንዘብ መቆጠብ፣ ብድር እና የገንዘብ እድገት።',
                'hero.joinNow': 'አሁን ተቀላቀል',
                'hero.exploreMore': 'ተጨማሪ ይመልከቱ',
                
                // About Section
                'about.title': 'ስለ ማድዲ ሳኮ',
                'about.description': 'ማድዲ ሳኮ በማህበረሰብ ላይ የተመሰረተ የገንዘብ ተባባሪ ማህበር ነው፣ አባላታችንን በገንዘብ መቆጠብ፣ ብድር እና የገንዘብ ትምህርት በኩል የኢኮኖሚ ደህንነት ለማሻሻል የተሰማራን። ከተመሰረትን ጀምሮ፣ አባላት የገንዘብ መረጋጋት እና እድገት እንዲያገኙ ረድተናል።',
                'about.readMore': 'ተጨማሪ ያንብቡ',
                
                // Services Section
                'services.title': 'የእኛ አገልግሎቶች',
                'services.subtitle': 'ለድህረ ምስክርዎ የተዘጋጁ ሁለገብ የገንዘብ መፍትሄዎች',
                
                // Membership Section
                'membership.title': 'የአባልነት ጥቅሞች',
                'membership.subtitle': 'ተባባሪ ማህበራችንን ተቀላቀል እና ልዩ ጥቅሞችን ተደስተህ ተጠቀም',
                
                // News Section
                'news.title': 'የቅርብ ጊዜ ዜናዎች እና ዝመናዎች',
                'news.subtitle': 'የቅርብ ጊዜ እንቅስቃሴዎቻችን እና ማስታወቂያዎች ስለ መረጃ ይሁኑ',
                
                // Contact Section
                'contact.title': 'አድራሻችን',
                'contact.subtitle': 'ለማንኛውም ጥያቄ ወይም ድጋፍ አድራሻችንን ያግኙ',
                
                // Footer
                'footer.description': 'ማህበረሰቦችን በገንዘብ ማካተት እና ተባባሪ ማህበር ማሳደጊያ በኩል እናሳድጋለን።',
                'footer.quickLinks': 'ፈጣን አውራጃዎች',
                'footer.services': 'አገልግሎቶች',
                'footer.contactInfo': 'የአድራሻ መረጃ',
                'footer.copyright': '© 2024 ማድዲ ሳኮ። ሁሉም መብቶች የተጠበቁ ናቸው።'
            },
            or: {
                // Navigation
                'nav.home': 'Mana',
                'nav.about': 'Waa\'ee',
                'nav.services': 'Tajaajila',
                'nav.membership': 'Mana\'iinsa',
                'nav.news': 'Oduu',
                'nav.downloads': 'Bu\'aa',
                'nav.gallery': 'Fakkii',
                'nav.contact': 'Quunnamaa',
                'nav.memberLogin': 'Seeniinsa Mana\'aa',
                
                // Hero Section
                'hero.title': 'Baga nagaan dhuftan Maaddii SACCOs',
                'hero.subtitle': 'Hojii keessan amanamaa qabeenya, liqii fi guddina qabeenyaa.',
                'hero.joinNow': 'Amma Makuu',
                'hero.exploreMore': 'Waliin Baay\'ee Ilaalaa',
                
                // About Section
                'about.title': 'Waa\'ee Maaddii SACCOs',
                'about.description': 'Maaddii SACCOs uruu qabeenyaa bulchiinsa irratti hundaa\'e kan mana\'oota keenya qabeenyaa fi guddina qabeenyaa keessatti gargaaruu fi barsiisaa qabeenyaa irratti hundaa\'e kan mana\'oota keenya jireenya qabeenyaa fi guddina argachuuf gargaaruu dha. Akaakuu keenya irraa kaasee, mana\'oota keenya qabeenyaa fi guddina argachuuf isaan gargaaruu dha.',
                'about.readMore': 'Baay\'ee Dubbisaa',
                
                // Services Section
                'services.title': 'Tajaajila Keenya',
                'services.subtitle': 'Furmaata qabeenyaa guutuu milkaa\'a keessanif kan qopheessan',
                
                // Membership Section
                'membership.title': 'Fayyadama Mana\'iinsa',
                'membership.subtitle': 'Makuu uruu keenya waliinii fi fayyadama gaarii addaa',
                
                // News Section
                'news.title': 'Oduu Dhiyootti Dhiyaatee & Jijjirama',
                'news.subtitle': 'Oduu keenya dhiyootti dhiyaatee hojii fi dhaqdhaqaaqa keessan beekaa',
                
                // Contact Section
                'contact.title': 'Nu Quunnamaa',
                'contact.subtitle': 'Nu quunnamaa gaaffii ykn deeggarsa kamiyyuu',
                
                // Footer
                'footer.description': 'Bulchiinsa awwaalaa qabeenyaa fi guddina waliinii keessatti gargaaruu.',
                'footer.quickLinks': 'Quunnamaa Dhiyootti',
                'footer.services': 'Tajaajila',
                'footer.contactInfo': 'Odeeffannoo Quunnamaa',
                'footer.copyright': '© 2024 Maaddii SACCOs. Mirga hunda kan eeguu dha.'
            }
        };
        
        this.init();
    }
    
    init() {
        this.updateLanguageDisplay();
        this.translatePage();
        this.bindEvents();
    }
    
    bindEvents() {
        // Language option clicks
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.currentTarget.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }
    
    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        this.updateLanguageDisplay();
        this.translatePage();
        
        // Show notification
        this.showNotification(`Language changed to ${this.getLanguageName(lang)}`);
    }
    
    updateLanguageDisplay() {
        const currentLangElement = document.querySelector('.current-lang');
        if (currentLangElement) {
            currentLangElement.textContent = this.currentLang.toUpperCase();
        }
    }
    
    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'am': 'አማርኛ',
            'so': 'Soomaali',
            'or': 'Afaan Oromoo'
        };
        return names[lang] || lang;
    }
    
    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.translations[this.currentLang]?.[key];
            if (translation) {
                element.textContent = translation;
            }
        });
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
}); 