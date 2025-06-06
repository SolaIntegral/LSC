document.addEventListener('DOMContentLoaded', () => {
    // 認証チェック
    if (!sessionStorage.getItem('isAdmin')) {
        window.location.href = 'login.html';
        return;
    }

    // ログアウトボタンの追加
    const header = document.querySelector('.admin-header');
    const logoutButton = document.createElement('button');
    logoutButton.className = 'admin-button';
    logoutButton.textContent = 'ログアウト';
    logoutButton.style.marginLeft = 'auto';
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('isAdmin');
        window.location.href = 'login.html';
    });
    header.appendChild(logoutButton);

    // ナビゲーションの切り替え
    const navButtons = document.querySelectorAll('.admin-nav button');
    const sections = document.querySelectorAll('.admin-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // アクティブなボタンの切り替え
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // セクションの表示切り替え
            sections.forEach(section => {
                section.style.display = section.id === targetSection ? 'block' : 'none';
            });
        });
    });

    // 初期表示設定
    navButtons[0].click();

    // コンテンツの読み込み
    loadContent();

    // フォームのイベントリスナー設定
    setupFormListeners();
});

async function loadContent() {
    try {
        const response = await fetch('../data/content.json');
        const content = await response.json();

        // ヒーローセクションの設定
        document.getElementById('heroTitle').value = content.hero.title;
        document.getElementById('heroSubtitle').value = content.hero.subtitle;

        // ハイライトの設定
        const highlightsList = document.getElementById('highlightsList');
        content.highlights.forEach(highlight => {
            const item = createHighlightItem(highlight);
            highlightsList.appendChild(item);
        });

        // Career Weekの設定
        document.getElementById('eventTitle').value = content.careerWeek.title;
        document.getElementById('eventSubtitle').value = content.careerWeek.subtitle;
        document.getElementById('eventDate').value = content.careerWeek.date;
        document.getElementById('eventVenue').value = content.careerWeek.venue;
        document.getElementById('eventTheme').value = content.careerWeek.theme;

        // ギャラリーの設定
        const galleryList = document.getElementById('galleryList');
        content.careerWeek.gallery.forEach(item => {
            const galleryItem = createGalleryItem(item);
            galleryList.appendChild(galleryItem);
        });

        // グループの設定
        const groupsList = document.getElementById('groupsList');
        content.groups.forEach(group => {
            const groupItem = createGroupItem(group);
            groupsList.appendChild(groupItem);
        });

        // メンバーの設定
        const membersList = document.getElementById('membersList');
        content.members.forEach(member => {
            const memberItem = createMemberItem(member);
            membersList.appendChild(memberItem);
        });

    } catch (error) {
        console.error('コンテンツの読み込みに失敗しました:', error);
        alert('コンテンツの読み込みに失敗しました。');
    }
}

function setupFormListeners() {
    // ヒーローセクションのフォーム
    document.getElementById('heroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            backgroundImage: formData.get('backgroundImage')
        };
        await saveContent('hero', data);
    });

    // ハイライトの追加
    document.getElementById('addHighlight').addEventListener('click', () => {
        const highlightsList = document.getElementById('highlightsList');
        const newHighlight = createHighlightItem({
            title: '',
            value: '',
            icon: ''
        });
        highlightsList.appendChild(newHighlight);
    });

    // Career Weekのフォーム
    document.getElementById('careerWeekForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            date: formData.get('date'),
            venue: formData.get('venue'),
            theme: formData.get('theme')
        };
        await saveContent('careerWeek', data);
    });

    // ギャラリー項目の追加
    document.getElementById('addGalleryItem').addEventListener('click', () => {
        const galleryList = document.getElementById('galleryList');
        const newItem = createGalleryItem({
            image: '',
            caption: ''
        });
        galleryList.appendChild(newItem);
    });

    // グループの追加
    document.getElementById('addGroup').addEventListener('click', () => {
        const groupsList = document.getElementById('groupsList');
        const newGroup = createGroupItem({
            name: '',
            description: '',
            image: '',
            activities: []
        });
        groupsList.appendChild(newGroup);
    });

    // メンバーの追加
    document.getElementById('addMember').addEventListener('click', () => {
        const membersList = document.getElementById('membersList');
        const newMember = createMemberItem({
            name: '',
            group: '',
            image: '',
            bio: '',
            linkedin: '',
            skills: []
        });
        membersList.appendChild(newMember);
    });
}

function createHighlightItem(highlight) {
    const div = document.createElement('div');
    div.className = 'admin-list-item';
    div.innerHTML = `
        <div class="form-group">
            <input type="text" value="${highlight.title}" placeholder="タイトル">
            <input type="text" value="${highlight.value}" placeholder="値">
            <input type="text" value="${highlight.icon}" placeholder="アイコン">
        </div>
        <button type="button" class="delete-button">削除</button>
    `;
    return div;
}

function createGalleryItem(item) {
    const div = document.createElement('div');
    div.className = 'admin-list-item';
    div.innerHTML = `
        <div class="form-group">
            <input type="file" accept="image/*">
            <input type="text" value="${item.caption}" placeholder="キャプション">
        </div>
        <button type="button" class="delete-button">削除</button>
    `;
    return div;
}

function createGroupItem(group) {
    const div = document.createElement('div');
    div.className = 'admin-list-item';
    div.innerHTML = `
        <div class="form-group">
            <input type="text" value="${group.name}" placeholder="グループ名">
            <textarea placeholder="説明">${group.description}</textarea>
            <input type="file" accept="image/*">
            <div class="activities-list">
                ${group.activities.map(activity => `
                    <input type="text" value="${activity}" placeholder="活動内容">
                `).join('')}
            </div>
            <button type="button" class="add-activity">活動を追加</button>
        </div>
        <button type="button" class="delete-button">削除</button>
    `;
    return div;
}

function createMemberItem(member) {
    const div = document.createElement('div');
    div.className = 'admin-list-item';
    div.innerHTML = `
        <div class="form-group">
            <input type="text" value="${member.name}" placeholder="名前">
            <select>
                <option value="${member.group}">${member.group}</option>
            </select>
            <input type="file" accept="image/*">
            <textarea placeholder="自己紹介">${member.bio}</textarea>
            <input type="url" value="${member.linkedin}" placeholder="LinkedIn URL">
            <div class="skills-list">
                ${member.skills.map(skill => `
                    <input type="text" value="${skill}" placeholder="スキル">
                `).join('')}
            </div>
            <button type="button" class="add-skill">スキルを追加</button>
        </div>
        <button type="button" class="delete-button">削除</button>
    `;
    return div;
}

async function saveContent(section, data) {
    try {
        const response = await fetch('../data/content.json');
        const content = await response.json();
        
        content[section] = { ...content[section], ...data };

        const saveResponse = await fetch('../data/content.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        });

        if (saveResponse.ok) {
            alert('保存が完了しました。');
        } else {
            throw new Error('保存に失敗しました。');
        }
    } catch (error) {
        console.error('保存に失敗しました:', error);
        alert('保存に失敗しました。');
    }
} 