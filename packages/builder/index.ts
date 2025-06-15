import * as path from 'path';
import * as fs from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { minify_sync } from "terser";
import * as yaml from 'js-yaml';

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
  const yamlContent = fs.readFileSync('../../bookmarklets.yaml', "utf8");
  const settings =  await yaml.load(yamlContent) as { bookmarklets: Record<string, never> };
  console.log('📄 設定', settings);

  Object.keys(settings["bookmarklets"]).forEach((key) => {
    console.log(`📦 ビルド中: ${key}`);
    build(
      path.join(bookmarkletPackage, 'src', key, 'src/index.js'),
      path.join(bookmarkletPackage, 'src', key),
      'bookmarklet.txt'
    );
  });
}

main();
