import { readFile, writeFile, mkdir } from 'fs/promises';
import * as path from 'path';

const build = async (src: string, distDir: string, distFile: string) => {
  try {
    // 出力先ディレクトリがなければ作成
    await mkdir(distDir, { recursive: true });

    // 読み込むファイルを取得
    const sourceFile = await readFile(src);
    const content = `javascript: ${sourceFile}`;

    await writeFile(path.join(distDir, distFile), content);

    console.log(`✅ ファイルの結合が完了しました: ${path.join(distDir, distFile)}`);

  } catch (err) {
    console.error('❌ エラーが発生しました:', err);
  }
};

const main = async () => {
  const bookmarkletPackage = '../bookmarklet/';
  const buildSettings = [
    {
      src: 'noTranslate',
    },
    {
      src: 'shortAmazon',
    }
  ];
  buildSettings.forEach((setting) => {
    build(
      path.join(bookmarkletPackage, 'src', setting.src, 'src/index.js'),
      path.join(bookmarkletPackage, 'src', setting.src),
      'bookmarklet.txt'
    );
  });
}

main();
