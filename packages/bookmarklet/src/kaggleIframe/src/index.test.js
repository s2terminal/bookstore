/**
 * @jest-environment jsdom
 */
describe('kaggleIframe ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
    // window.openのモックを設定
    global.window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('iframe要素のsrc属性を取得して新しいタブで開く', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <iframe src="https://example.com/notebook" width="100%" height="400"></iframe>
        <p>その他のコンテンツ</p>
      </div>
    `;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.open).toHaveBeenCalledWith('https://example.com/notebook', '_blank');
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  test('iframe要素が存在しない場合はundefinedで新しいタブを開こうとする', () => {
    // 1. iframe要素のないDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>iframe要素がありません</p>
        <video src="video.mp4"></video>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. 結果を検証（undefinedでwindow.openが呼ばれることを確認）
    expect(window.open).toHaveBeenCalledWith(undefined, '_blank');
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  test('iframe要素にsrc属性が存在しない場合はnullで新しいタブを開こうとする', () => {
    // 1. src属性のないiframe要素があるDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <iframe width="100%" height="400"></iframe>
        <p>その他のコンテンツ</p>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. 結果を検証（nullでwindow.openが呼ばれることを確認）
    expect(window.open).toHaveBeenCalledWith(null, '_blank');
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  test('複数のiframe要素がある場合は最初の要素のsrcを開く', () => {
    // 1. 複数のiframe要素があるDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <iframe src="https://first-iframe.com" width="100%" height="400"></iframe>
        <iframe src="https://second-iframe.com" width="100%" height="400"></iframe>
        <iframe src="https://third-iframe.com" width="100%" height="400"></iframe>
      </div>
    `;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証（最初のiframe要素のsrcのみが開かれる）
    expect(window.open).toHaveBeenCalledWith('https://first-iframe.com', '_blank');
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});