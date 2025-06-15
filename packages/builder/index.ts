import { readFile, writeFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { minify_sync } from "terser";

// TODO: 設定ファイルに出す
const buildSettings = [
  { src: 'noTranslate' },
  { src: 'shortAmazon' },
  { src: 'openPassword' },
  { src: 'deleteHeader' },
];

const build = async (src: string, distDir: string, distFile: string) => {
  try {
    // 出力先ディレクトリがなければ作成
    await mkdir(distDir, { recursive: true });

    // 読み込むファイルを取得
    const sourceFile = await readFile(src);
    const script = minify_sync(sourceFile.toString()).code;
    const content = `javascript: ${script}\n`;

    await writeFile(path.join(distDir, distFile), content);

    console.log(`✅ ファイルの結合が完了しました: ${path.join(distDir, distFile)}`);

  } catch (err) {
    console.error('❌ エラーが発生しました:', err);
  }
};

const main = async () => {
  const bookmarkletPackage = '../bookmarklet/';
  buildSettings.forEach((setting) => {
    build(
      path.join(bookmarkletPackage, 'src', setting.src, 'src/index.js'),
      path.join(bookmarkletPackage, 'src', setting.src),
      'bookmarklet.txt'
    );
  });
}

main();
