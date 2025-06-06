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
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.nav');
    
    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuButton.classList.toggle('active');
        });

        // メニュー項目のクリックでメニューを閉じる
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuButton.classList.remove('active');
            });
        });
    }

    // スクロールアニメーション
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を監視
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // ヘッダーの高さ
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ページトップへ戻るボタン
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'ページトップへ戻る');
        document.body.appendChild(button);

        const showButton = () => {
            if (window.pageYOffset > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        window.addEventListener('scroll', showButton);
        button.addEventListener('click', scrollToTop);
    };

    createBackToTopButton();

    // 画像の遅延読み込み
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // ブラウザがネイティブの遅延読み込みをサポートしている場合
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // フォールバック: Intersection Observerを使用
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // タッチデバイスでのホバーエフェクト対応
    if ('ontouchstart' in window) {
        document.querySelectorAll('.hover-effect').forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-hover');
            });

            element.addEventListener('touchend', () => {
                element.classList.remove('touch-hover');
            });
        });
    }

    // ページ読み込み完了時のアニメーション
    document.body.classList.add('loaded');
}); 