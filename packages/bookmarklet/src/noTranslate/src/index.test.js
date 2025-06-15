/**
 * @jest-environment jsdom
 */
describe('ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('すべての <pre> 要素に "notranslate" クラスを追加', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>これはpタグです</p>
        <pre><code>const a = 1;</code></pre>
        <pre><code>const b = 2;</code></pre>
      </div>
    `;

    // 2. テスト対象のスクリプトを実行
    // jest.isolateModulesを使い、各テストでスクリプトがクリーンな状態で実行されるようにする
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    const preElements = document.querySelectorAll('pre');
    expect(preElements.length).toBe(2); // 2つの<pre>要素が存在することを確認
    preElements.forEach(pre => {
      expect(pre.classList.contains('notranslate')).toBe(true);
    });

    // 他の要素には影響がないことを確認
    const pElement = document.querySelector('p');
    expect(pElement.classList.contains('notranslate')).toBe(false);
  });

  test('<pre>要素が存在しない場合は何もしない', () => {
    // 1. <pre>要素のないDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>No pre elements here.</p>
        <span>A span element.</span>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. 結果を検証（pre要素がないので、当然クラスもつかない）
    const preElements = document.querySelectorAll('pre');
    expect(preElements.length).toBe(0);
  });
});
