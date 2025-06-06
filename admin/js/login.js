document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // セッションの確認
    if (sessionStorage.getItem('isAdmin')) {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('../data/admin.json');
            const adminData = await response.json();

            if (username === adminData.username && password === adminData.password) {
                // ログイン成功
                sessionStorage.setItem('isAdmin', 'true');
                window.location.href = 'index.html';
            } else {
                // ログイン失敗
                errorMessage.style.display = 'block';
                loginForm.reset();
            }
        } catch (error) {
            console.error('ログイン処理に失敗しました:', error);
            errorMessage.textContent = 'ログイン処理に失敗しました。';
            errorMessage.style.display = 'block';
        }
    });
}); 