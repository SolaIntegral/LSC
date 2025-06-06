document.addEventListener('DOMContentLoaded', () => {
    // ナビゲーションメニューの制御
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.nav');
    
    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuButton.classList.toggle('active');
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
    document.querySelectorAll('.achievements__item, .gallery__item, .timeline__item').forEach(element => {
        observer.observe(element);
    });

    // 数字のカウントアップアニメーション
    const countElements = document.querySelectorAll('[data-count]');
    
    const animateCount = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2秒
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCount = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCount();
    };

    // 数字の要素を監視
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

    // 画像ギャラリーの制御
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const image = item.querySelector('.gallery__image');
            const caption = item.querySelector('.gallery__caption');
            
            // モーダルの作成
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'gallery-modal__content';
            
            const modalImage = document.createElement('img');
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            
            const modalCaption = document.createElement('p');
            modalCaption.textContent = caption.textContent;
            
            modalContent.appendChild(modalImage);
            modalContent.appendChild(modalCaption);
            modal.appendChild(modalContent);
            
            // モーダルの表示
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // モーダルの閉じる処理
            modal.addEventListener('click', () => {
                modal.remove();
                document.body.style.overflow = '';
            });
        });
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
            }
        });
    });

    // 企業ロゴのスクロールアニメーション
    const companiesScroll = document.querySelector('.companies__scroll');
    if (companiesScroll) {
        let isScrolling = false;
        let startX;
        let scrollLeft;

        companiesScroll.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - companiesScroll.offsetLeft;
            scrollLeft = companiesScroll.scrollLeft;
        });

        companiesScroll.addEventListener('mouseleave', () => {
            isScrolling = false;
        });

        companiesScroll.addEventListener('mouseup', () => {
            isScrolling = false;
        });

        companiesScroll.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.pageX - companiesScroll.offsetLeft;
            const walk = (x - startX) * 2;
            companiesScroll.scrollLeft = scrollLeft - walk;
        });
    }
}); 