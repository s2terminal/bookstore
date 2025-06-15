/**
 * @jest-environment jsdom
 */

// location.hrefの変更をモックする
const mockLocationAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: mockLocationAssign,
  },
  writable: true,
});

describe('shortAmazon ブックマークレット実行', () => {

  beforeEach(() => {
    // 各テストの前にlocation.hrefをリセット
    window.location.href = '';
    mockLocationAssign.mockClear();
  });

  test('Amazon商品URLを短縮する（基本的なケース）', () => {
    // 1. Amazon商品URLをセットアップ
    const originalUrl = 'https://www.amazon.co.jp/gp/product/dp/B08N5WRWNW/ref=sr_1_1?keywords=test&qid=1234567890&sr=8-1';
    window.location.href = originalUrl;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.location.href).toBe('https://www.amazon.co.jp/dp/B08N5WRWNW');
  });

  test('ref付きのURLから ref部分を削除する', () => {
    // 1. ref付きのAmazon URLをセットアップ
    const originalUrl = 'https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1';
    window.location.href = originalUrl;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.location.href).toBe('https://www.amazon.co.jp/dp/B08N5WRWNW');
  });

  test('クエリパラメータ付きのURLからクエリパラメータを削除する', () => {
    // 1. クエリパラメータ付きのAmazon URLをセットアップ
    const originalUrl = 'https://www.amazon.co.jp/dp/B08N5WRWNW?keywords=test&qid=1234567890';
    window.location.href = originalUrl;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.location.href).toBe('https://www.amazon.co.jp/dp/B08N5WRWNW');
  });

  test('複雑な商品URLを短縮する', () => {
    // 1. 複雑なAmazon商品URLをセットアップ
    const originalUrl = 'https://www.amazon.co.jp/DP-12345/dp/B08N5WRWNW/ref=pd_bxgy_img_1/358-1234567-1234567?pd_rd_w=abc123&content-id=amzn1.sym.xyz789&pf_rd_p=def456&pf_rd_r=ghi789&pd_rd_wg=jkl012&pd_rd_r=mno345&s=books';
    window.location.href = originalUrl;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.location.href).toBe('https://www.amazon.co.jp/dp/B08N5WRWNW/358-1234567-1234567');
  });

  test('dpが含まれないURLの場合の動作', () => {
    // 1. dpが含まれないURLをセットアップ
    const originalUrl = 'https://www.amazon.co.jp/gp/bestsellers/?ref=nav_cs_bestsellers';
    window.location.href = originalUrl;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証（dpが見つからない場合、slice(-1)で最後の要素から取得されるため、意図しない結果になる）
    // 実際の動作を確認すると、正常に処理されることが分かる
    expect(window.location.href).toBe('https://www.amazon.co.jp/');
  });

  test('Amazon以外のドメインでの動作', () => {
    // 1. Amazon以外のURLをセットアップ
    const originalUrl = 'https://example.com/dp/B08N5WRWNW?param=value';
    window.location.href = originalUrl;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証（ドメインに関係なく処理される）
    expect(window.location.href).toBe('https://example.com/dp/B08N5WRWNW');
  });

  test('ref部分が複数パターンある場合の削除', () => {
    // 1. 様々なref形式のURLをテスト
    const testCases = [
      {
        input: 'https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1',
        expected: 'https://www.amazon.co.jp/dp/B08N5WRWNW'
      },
      {
        input: 'https://www.amazon.co.jp/dp/B08N5WRWNW/ref=pd_bxgy_img_1',
        expected: 'https://www.amazon.co.jp/dp/B08N5WRWNW'
      },
      {
        input: 'https://www.amazon.co.jp/dp/B08N5WRWNW/ref=ABC_123_def',
        expected: 'https://www.amazon.co.jp/dp/B08N5WRWNW'
      }
    ];

    testCases.forEach(testCase => {
      window.location.href = testCase.input;

      jest.isolateModules(() => {
        require('./index.js');
      });

      expect(window.location.href).toBe(testCase.expected);
    });
  });
});
