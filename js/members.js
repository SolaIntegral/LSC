document.addEventListener('DOMContentLoaded', () => {
    // 検索とフィルターの要素
    const searchInput = document.getElementById('searchInput');
    const groupFilter = document.getElementById('groupFilter');
    const memberCards = document.querySelectorAll('.member-card');
    const memberModal = document.getElementById('memberModal');
    const modalClose = document.querySelector('.member-modal__close');

    // メンバーカードのフィルタリング
    const filterMembers = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGroup = groupFilter.value;

        memberCards.forEach(card => {
            const name = card.querySelector('.member-card__name').textContent.toLowerCase();
            const bio = card.querySelector('.member-card__bio').textContent.toLowerCase();
            const skills = Array.from(card.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.toLowerCase());
            const group = card.dataset.group;

            const matchesSearch = name.includes(searchTerm) ||
                                bio.includes(searchTerm) ||
                                skills.some(skill => skill.includes(searchTerm));
            const matchesGroup = !selectedGroup || group === selectedGroup;

            card.style.display = matchesSearch && matchesGroup ? 'block' : 'none';
        });
    };

    // 検索とフィルターのイベントリスナー
    searchInput.addEventListener('input', filterMembers);
    groupFilter.addEventListener('change', filterMembers);

    // メンバー詳細モーダルの制御
    const showMemberModal = (card) => {
        const modalBody = memberModal.querySelector('.member-modal__body');
        const name = card.querySelector('.member-card__name').textContent;
        const group = card.querySelector('.member-card__group').textContent;
        const bio = card.querySelector('.member-card__bio').textContent;
        const skills = Array.from(card.querySelectorAll('.skill-tag'))
            .map(tag => tag.textContent);
        const linkedinUrl = card.querySelector('.member-card__linkedin').href;
        const imageSrc = card.querySelector('.member-card__image img').src;

        modalBody.innerHTML = `
            <div class="member-modal__image">
                <img src="${imageSrc}" alt="${name}">
            </div>
            <div class="member-modal__info">
                <h2 class="member-modal__name">${name}</h2>
                <p class="member-modal__group">${group}</p>
                <p class="member-modal__bio">${bio}</p>
                <div class="member-modal__skills">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <a href="${linkedinUrl}" target="_blank" rel="noopener" class="member-modal__linkedin">
                    <i class="fab fa-linkedin"></i>
                    LinkedInプロフィールを見る
                </a>
            </div>
        `;

        memberModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // モーダルを閉じる
    const closeModal = () => {
        memberModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // メンバーカードのクリックイベント
    memberCards.forEach(card => {
        card.addEventListener('click', () => {
            showMemberModal(card);
        });
    });

    // モーダルを閉じるイベント
    modalClose.addEventListener('click', closeModal);
    memberModal.addEventListener('click', (e) => {
        if (e.target === memberModal) {
            closeModal();
        }
    });

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && memberModal.classList.contains('active')) {
            closeModal();
        }
    });

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

    memberCards.forEach(card => {
        observer.observe(card);
    });

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
}); 