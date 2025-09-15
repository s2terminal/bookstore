/**
 * @jest-environment jsdom
 */

describe('connpassOsaka ブックマークレット', () => {
  const FIXED_ISO = '2024-01-02T12:34:56.000Z';

  beforeEach(() => {
    // Date を固定
    jest.useFakeTimers();
    jest.setSystemTime(new Date(FIXED_ISO));

    // window.location をスタブ（href セッターで値を保持するだけにする）
  const locationState = { href: 'https://example.com/' };
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: {
        get href() {
          return locationState.href;
        },
        set href(v) {
          locationState.href = v; // ナビゲーションは行わない
        },
        toString() {
          return locationState.href;
        },
        // コード内で使われる可能性のある最低限の API をダミー実装
  assign: (v) => { locationState.href = v; },
  replace: (v) => { locationState.href = v; },
        reload: () => {},
        origin: 'https://example.com',
        protocol: 'https:',
        host: 'example.com',
        hostname: 'example.com',
        port: '',
        pathname: '/',
        search: '',
        hash: ''
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('本日の大阪イベント検索ページにリダイレクトする', () => {
    // 実行前確認
  expect(window.location.href).toBe('https://example.com/');

    // スクリプト実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    const current = new URL(window.location.href);

    expect(current.origin + current.pathname).toBe('https://connpass.com/search/');

    // クエリパラメータ検証
    expect(current.searchParams.get('prefectures')).toBe('osaka');
    expect(current.searchParams.get('selectItem')).toBe('osaka');

    // start_from が固定日付 (モックした Date) で YYYY/MM/DD 形式
    expect(current.searchParams.get('start_from')).toBe('2024/01/02');
  });
});
