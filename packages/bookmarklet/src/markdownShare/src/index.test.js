/**
 * @jest-environment jsdom
 */
describe('markdownShareブックマークレット実行', () => {
  let mockShare;
  let originalShare;

  beforeEach(() => {
    // navigator.shareをモック化
    mockShare = jest.fn();
    originalShare = window.navigator.share;
    Object.defineProperty(window.navigator, 'share', {
      value: mockShare,
      writable: true
    });
    document.title = 'Test Page Title';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(window.navigator, 'share', {
      value: originalShare,
      writable: true
    });
  });

  test('navigator.shareを正しいMarkdown形式のテキストで呼び出す', () => {
    jest.isolateModules(() => {
      require('./index.js');
    });
    expect(mockShare).toHaveBeenCalledWith({
      text: '[Test Page Title](http://localhost/)'
    });
    expect(mockShare).toHaveBeenCalledTimes(1);
  });

  test('異なるタイトルとURLでも正しく動作する', () => {
    document.title = 'Another Page';
    jest.isolateModules(() => {
      require('./index.js');
    });
    expect(mockShare).toHaveBeenCalledWith({
      text: '[Another Page](http://localhost/)'
    });
  });

  test('空のタイトルでも正しく動作する', () => {
    document.title = '';
    jest.isolateModules(() => {
      require('./index.js');
    });
    expect(mockShare).toHaveBeenCalledWith({
      text: '[](http://localhost/)'
    });
  });

  test('navigator.shareが利用できない場合はエラーが発生する', () => {
    Object.defineProperty(window.navigator, 'share', {
      value: undefined,
      writable: true
    });
    let error;
    try {
      jest.isolateModules(() => {
        require('./index.js');
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
}); 