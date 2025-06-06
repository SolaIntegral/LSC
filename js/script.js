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