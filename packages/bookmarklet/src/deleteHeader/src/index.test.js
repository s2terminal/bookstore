/**
 * @jest-environment jsdom
 */
describe('deleteHeader ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('header要素を削除する', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <header>
          <h1>サイトタイトル</h1>
          <nav>ナビゲーション</nav>
        </header>
        <main>
          <p>メインコンテンツ</p>
        </main>
        <footer>フッター</footer>
      </div>
    `;

    // 実行前にheader要素が存在することを確認
    expect(document.querySelector('header')).not.toBeNull();

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(document.querySelector('header')).toBeNull();

    // 他の要素は影響を受けないことを確認
    expect(document.querySelector('main')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();
  });

  test('header要素が存在しない場合は何もしない', () => {
    // 1. header要素のないDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <main>
          <p>メインコンテンツ</p>
        </main>
        <footer>フッター</footer>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. 結果を検証（header要素がないので、変化なし）
    expect(document.querySelector('header')).toBeNull();
    expect(document.querySelector('main')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();
  });

  test('複数のheader要素がある場合は最初の要素のみ削除', () => {
    // 1. 複数のheader要素があるDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <header id="first-header">最初のヘッダー</header>
        <main>
          <header id="nested-header">ネストされたヘッダー</header>
          <p>メインコンテンツ</p>
        </main>
      </div>
    `;

    // 実行前に両方のheader要素が存在することを確認
    expect(document.querySelector('#first-header')).not.toBeNull();
    expect(document.querySelector('#nested-header')).not.toBeNull();

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証（最初の要素のみ削除される）
    expect(document.querySelector('#first-header')).toBeNull();
    expect(document.querySelector('#nested-header')).not.toBeNull();
  });
});
