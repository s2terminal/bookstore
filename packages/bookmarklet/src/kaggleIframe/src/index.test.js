/**
 * @jest-environment jsdom
 */
describe('kaggleIframeブックマークレット実行', () => {
  let mockOpen;

  beforeEach(() => {
    document.body.innerHTML = '';
    // window.openをモック化
    mockOpen = jest.fn();
    window.open = mockOpen;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('iframeのsrc属性を取得してwindow.openを呼び出す', () => {
    // 1. テスト用のDOMをセットアップ（iframeを含む）
    document.body.innerHTML = `
      <div>
        <iframe src=\"https://www.kaggle.com/code/example\"></iframe>
      </div>
    `;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(mockOpen).toHaveBeenCalledWith('https://www.kaggle.com/code/example', '_blank');
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  test('iframeが存在しない場合はwindow.open(undefined, "_blank")が呼ばれる', () => {
    // 1. iframeのないDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>No iframe here.</p>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. window.openが呼ばれないことを確認
    expect(mockOpen).toHaveBeenCalledWith(undefined, '_blank');
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  test('iframeにsrc属性がない場合はwindow.open(null, "_blank")が呼ばれる', () => {
    // 1. src属性のないiframeを含むDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <iframe></iframe>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. window.openが呼ばれないことを確認
    expect(mockOpen).toHaveBeenCalledWith(null, '_blank');
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });
}); 