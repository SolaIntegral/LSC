// モバイルメニューの制御
const menuButton = document.querySelector('.header__menu-button');
const nav = document.querySelector('.header__nav');

menuButton.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});

// 数字のカウントアップアニメーション
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observerを使用して要素の表示を監視
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            if (element.classList.contains('highlight__number')) {
                const targetValue = parseInt(element.getAttribute('data-count'));
                animateValue(element, 0, targetValue, 2000);
            }
            element.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// 監視対象の要素を登録
document.querySelectorAll('.highlight__number').forEach(element => {
    observer.observe(element);
});

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// スクロールに応じたヘッダーの表示/非表示
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // 下スクロール
        header.style.transform = 'translateY(-100%)';
    } else {
        // 上スクロール
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// グループカードの詳細表示機能
document.querySelectorAll('.group-card__toggle').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.group-card');
        const details = card.querySelector('.group-card__details');
        const isExpanded = details.style.display === 'block';
        
        details.style.display = isExpanded ? 'none' : 'block';
        button.textContent = isExpanded ? '詳細を見る' : '閉じる';
    });
});

// メンバー検索とフィルタリング機能
const memberSearch = document.getElementById('memberSearch');
const groupFilter = document.getElementById('groupFilter');
const memberCards = document.querySelectorAll('.member-card');

function filterMembers() {
    const searchTerm = memberSearch.value.toLowerCase();
    const selectedGroup = groupFilter.value;

    memberCards.forEach(card => {
        const name = card.querySelector('.member-card__name').textContent.toLowerCase();
        const group = card.getAttribute('data-group');
        const bio = card.querySelector('.member-card__bio').textContent.toLowerCase();
        const skills = Array.from(card.querySelectorAll('.skill-tag'))
            .map(tag => tag.textContent.toLowerCase());

        const matchesSearch = name.includes(searchTerm) || 
                            bio.includes(searchTerm) || 
                            skills.some(skill => skill.includes(searchTerm));
        const matchesGroup = !selectedGroup || group === selectedGroup;

        card.style.display = matchesSearch && matchesGroup ? 'block' : 'none';
    });
}

if (memberSearch && groupFilter) {
    memberSearch.addEventListener('input', filterMembers);
    groupFilter.addEventListener('change', filterMembers);
}

// メンバーカードの詳細表示機能
document.querySelectorAll('.member-card__toggle').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.member-card');
        const details = card.querySelector('.member-card__details');
        const isExpanded = details.style.display === 'block';
        
        details.style.display = isExpanded ? 'none' : 'block';
        button.textContent = isExpanded ? '詳細を見る' : '閉じる';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // ナビゲーションメニューの制御
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', 
            navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    });

    // スクロールアニメーション
    const animateElements = document.querySelectorAll('.animate');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });

    // カウントアップアニメーション
    const countElements = document.querySelectorAll('[data-count]');
    
    const animateCount = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2秒
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCount = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target;
            }
        };

        updateCount();
    };

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    countElements.forEach(element => {
        countObserver.observe(element);
    });

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // モバイルメニューを閉じる
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // タッチデバイスでのホバー効果の制御
    if ('ontouchstart' in window) {
        document.querySelectorAll('.card, .button').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
}); 