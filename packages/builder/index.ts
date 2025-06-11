import { readFile, writeFile, mkdir } from 'fs/promises';
import * as path from 'path';

const build = async (src: string, distDir: string, distFile: string) => {
  try {
    // 出力先ディレクトリがなければ作成
    await mkdir(distDir, { recursive: true });

    // 読み込むファイルの一覧を取得
    const sourceFile = await readFile(src);
    const content = `javascript: ${sourceFile}`;

    await writeFile(path.join(distDir, distFile), content);

    console.log(`✅ ファイルの結合が完了しました: ${path.join(distDir, distFile)}`);

  } catch (err) {
    console.error('❌ エラーが発生しました:', err);
  }
};

build('../bookmarklet/src/notranslate/src/index.js', '../bookmarklet/src/notranslate', 'dist.mjs');
