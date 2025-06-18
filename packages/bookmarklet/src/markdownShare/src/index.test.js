/**
 * @jest-environment jsdom
 */
describe('markdownShare ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
    // navigator.shareのモックを設定
    global.navigator.share = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('現在のページ情報をMarkdown形式でシェアする', async () => {
    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(navigator.share).toHaveBeenCalledWith({
      text: `[${document.title}](${document.location.href})`
    });
    expect(navigator.share).toHaveBeenCalledTimes(1);
  });

  test('navigator.shareが利用できない場合はエラーが発生する', () => {
    // 1. navigator.shareを削除
    const originalShare = global.navigator.share;
    delete global.navigator.share;

    // 2. スクリプトを実行するとエラーが発生することを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).toThrow('navigator.share is not a function');

    // 元に戻す
    global.navigator.share = originalShare;
  });
});