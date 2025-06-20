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
const header = document.querySelector('.nav');

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

// ハンバーガーメニューの制御
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const body = document.body;

// メニューの開閉
function toggleMenu() {
    navToggle.classList.toggle('nav__toggle--active');
    navMenu.classList.toggle('nav__menu--active');
    body.classList.toggle('menu-open');
}

// メニューを閉じる
function closeMenu() {
    navToggle.classList.remove('nav__toggle--active');
    navMenu.classList.remove('nav__menu--active');
    body.classList.remove('menu-open');
}

// イベントリスナー
navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
});

// メニューリンクをクリックしたときにメニューを閉じる
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// メニュー外をクリックしたときにメニューを閉じる
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('nav__menu--active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        closeMenu();
    }
});

// タッチデバイスでのスワイプ検出
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && navMenu.classList.contains('nav__menu--active')) {
            // 右スワイプでメニューを閉じる
            closeMenu();
        } else if (swipeDistance < 0 && !navMenu.classList.contains('nav__menu--active')) {
            // 左スワイプでメニューを開く
            toggleMenu();
        }
    }
}

// スクロール時のヘッダー表示制御
let currentScrollTop = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollPosition > currentScrollTop && scrollPosition > scrollThreshold) {
        // 下スクロール時
        mainHeader.style.transform = 'translateY(-100%)';
    } else {
        // 上スクロール時
        mainHeader.style.transform = 'translateY(0)';
    }
    
    currentScrollTop = scrollPosition <= 0 ? 0 : scrollPosition;
}, { passive: true });

// タッチデバイスでのスムーズスクロール
if (isTouchDevice) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('touchstart', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// スクロールアニメーション
const scrollElements = document.querySelectorAll('.scroll-animate');

const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= 
        ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scroll-animate--active');
};

const hideScrollElement = (element) => {
    element.classList.remove('scroll-animate--active');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

// スクロールイベントの最適化
let throttleTimer;
const throttle = (callback, time) => {
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
        callback();
        throttleTimer = null;
    }, time);
};

window.addEventListener('scroll', () => {
    throttle(handleScrollAnimation, 250);
});

// 初期表示時のアニメーション
window.addEventListener('load', () => {
    handleScrollAnimation();
});

// カウントアップアニメーション
const animateCount = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCount = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCount();
};

// 数字のアニメーション
const animateNumbers = () => {
    const numberElements = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    numberElements.forEach(element => {
        observer.observe(element);
    });
};

// カルーセル
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.items = element.querySelectorAll('.carousel__item');
        this.currentIndex = 0;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        if (isTouchDevice) {
            this.carousel.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.carousel.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
            this.carousel.addEventListener('touchend', this.handleTouchEnd.bind(this));
        } else {
            this.carousel.addEventListener('mouseenter', () => {
                this.carousel.style.cursor = 'grab';
            });
            this.carousel.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.carousel.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.carousel.addEventListener('mouseup', this.handleMouseUp.bind(this));
            this.carousel.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.carousel.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        const diff = e.clientX - this.startX;
        this.carousel.style.transform = `translateX(${diff}px)`;
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.carousel.style.cursor = 'grab';
        const diff = e.clientX - this.startX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.carousel.style.transform = '';
        }
    }

    next() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.update();
    }

    prev() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.update();
    }

    update() {
        this.items.forEach((item, index) => {
            item.style.transform = `translateX(${(index - this.currentIndex) * 100}%)`;
        });
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }
}

// カルーセルの初期化
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
});

// モーダル
class Modal {
    constructor(element) {
        this.modal = element;
        this.closeButton = element.querySelector('.modal__close');
        this.content = element.querySelector('.modal__content');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.closeButton.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            this.modal.classList.add('active');
            this.content.classList.add('active');
        }, 10);
    }

    close() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        this.content.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// モーダルの初期化
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => new Modal(modal));

    // モーダルを開くトリガーの設定
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                new Modal(modal).open();
            }
        });
    });
});

// 画像の遅延読み込み
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // IntersectionObserverがサポートされていない場合のフォールバック
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

// パフォーマンス最適化
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // 非同期で実行可能な処理
        const deferredScripts = document.querySelectorAll('script[defer]');
        deferredScripts.forEach(script => {
            if (script.dataset.src) {
                script.src = script.dataset.src;
            }
        });
    });
}

// タッチデバイスでのホバー効果の無効化
if (isTouchDevice) {
    document.querySelectorAll('.card, .button, .nav__link').forEach(element => {
        element.addEventListener('touchstart', () => {}, { passive: true });
    });
}

// フォームのバリデーション
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            const invalidInputs = form.querySelectorAll(':invalid');
            invalidInputs.forEach(input => {
                input.classList.add('invalid');
            });
        }
    });
});

// 入力フィールドのバリデーション
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('invalid');
    });
    
    // モバイルでの入力最適化
    if (isTouchDevice) {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                window.scrollTo({
                    top: input.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 300);
        });
    }
});

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    animateNumbers();
});

document.addEventListener('DOMContentLoaded', function() {
    // チームカードのクリックイベント
    document.querySelectorAll('.team-card').forEach(card => {
        // カード全体のクリックイベント
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.team-member')) {
                showTeamPopup(this);
            }
        });

        // チーム名のクリックイベント
        const teamTitle = card.querySelector('h3');
        if (teamTitle) {
            teamTitle.addEventListener('click', function(e) {
                e.stopPropagation();
                showTeamPopup(this.closest('.team-card'));
            });
        }
    });

    // メンバーカードのクリックイベント
    document.querySelectorAll('.team-member').forEach(member => {
        // カード全体のクリックイベント
        member.addEventListener('click', function(e) {
            e.stopPropagation();
            showMemberPopup(this);
        });

        // メンバー名のクリックイベント
        const memberName = member.querySelector('h4');
        if (memberName) {
            memberName.addEventListener('click', function(e) {
                e.stopPropagation();
                showMemberPopup(this.closest('.team-member'));
            });
        }
    });

    // ポップアップを閉じる
    document.querySelectorAll('.popup__close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.popup').classList.remove('popup--active');
        });
    });

    // ポップアップ外をクリックして閉じる
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('popup--active');
            }
        });
    });
});

// チームポップアップを表示する関数
function showTeamPopup(teamCard) {
    const teamId = teamCard.dataset.team;
    const popup = document.getElementById('team-popup');
    const title = teamCard.querySelector('h3').textContent;
    const description = teamCard.querySelector('.team-description').textContent;
    const members = Array.from(teamCard.querySelectorAll('.team-member')).map(member => ({
        name: member.querySelector('h4').textContent,
        role: member.querySelector('.team-member__role').textContent,
        university: member.querySelector('.team-member__university').textContent,
        image: member.querySelector('img').src
    }));

    popup.querySelector('.popup__title').textContent = title;
    popup.querySelector('.popup__description').textContent = description;
    
    const membersHtml = members.map(member => `
        <div class="popup__member">
            <img src="${member.image}" alt="${member.name}" class="popup__member-image">
            <div class="popup__member-info">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
                <p>${member.university}</p>
            </div>
        </div>
    `).join('');
    
    popup.querySelector('.popup__members').innerHTML = membersHtml;
    popup.classList.add('popup--active');
}

// メンバーポップアップを表示する関数
function showMemberPopup(memberCard) {
    const memberId = memberCard.dataset.member;
    const popup = document.getElementById('member-popup');
    const name = memberCard.querySelector('h4').textContent;
    const role = memberCard.querySelector('.team-member__role').textContent;
    const university = memberCard.querySelector('.team-member__university').textContent;
    const image = memberCard.querySelector('img').src;

    popup.querySelector('.popup__image').src = image;
    popup.querySelector('.popup__image').alt = name;
    popup.querySelector('.popup__title').textContent = name;
    popup.querySelector('.popup__info').innerHTML = `
        <p class="popup__role">${role}</p>
        <p class="popup__university">${university}</p>
    `;
    popup.querySelector('.popup__linkedin').href = `https://www.linkedin.com/in/${memberId}/`;
    
    popup.classList.add('popup--active');
} 