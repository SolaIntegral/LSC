const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 画像の最適化設定
const optimizationSettings = {
    quality: 80,
    width: 1920, // 最大幅
    height: 1080, // 最大高さ
    format: 'webp' // 最適なフォーマット
};

// 画像ディレクトリの設定
const imageDirs = [
    'images',
    'images/hero',
    'images/gallery',
    'images/members',
    'images/groups',
    'images/career_week'
];

// 画像を最適化する関数
async function optimizeImage(inputPath, outputPath) {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // 画像のリサイズ
        if (metadata.width > optimizationSettings.width || metadata.height > optimizationSettings.height) {
            image.resize(optimizationSettings.width, optimizationSettings.height, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // WebP形式に変換
        await image
            .webp({ quality: optimizationSettings.quality })
            .toFile(outputPath);

        console.log(`最適化完了: ${outputPath}`);
    } catch (error) {
        console.error(`エラー: ${inputPath}`, error);
    }
}

// ディレクトリ内の画像を処理する関数
async function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const inputPath = path.join(dir, file);
        const stats = fs.statSync(inputPath);

        if (stats.isDirectory()) {
            await processDirectory(inputPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
            const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            await optimizeImage(inputPath, outputPath);
        }
    }
}

// メイン処理
async function main() {
    console.log('画像の最適化を開始します...');

    for (const dir of imageDirs) {
        if (fs.existsSync(dir)) {
            console.log(`ディレクトリを処理中: ${dir}`);
            await processDirectory(dir);
        }
    }

    console.log('画像の最適化が完了しました！');
}

main().catch(console.error); 