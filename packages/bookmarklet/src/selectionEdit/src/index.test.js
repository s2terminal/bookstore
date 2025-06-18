/**
 * @jest-environment jsdom
 */
describe('selectionEdit ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
    // window.promptのモックを設定
    global.window.prompt = jest.fn();
    // window.getSelectionのモックを設定
    global.window.getSelection = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('選択されたテキストをプロンプトに表示する', () => {
    // 1. テスト用の選択テキストを設定
    const mockSelection = {
      toString: jest.fn().mockReturnValue('選択されたテキスト')
    };
    window.getSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(mockSelection.toString).toHaveBeenCalledTimes(1);
    expect(window.prompt).toHaveBeenCalledWith('', '選択されたテキスト');
  });

  test('テキストが選択されていない場合は空文字をプロンプトに表示する', () => {
    // 1. 空の選択テキストを設定
    const mockSelection = {
      toString: jest.fn().mockReturnValue('')
    };
    window.getSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(mockSelection.toString).toHaveBeenCalledTimes(1);
    expect(window.prompt).toHaveBeenCalledWith('', '');
  });

  test('getSelectionがnullを返す場合でもエラーにならない', () => {
    // 1. getSelectionがnullを返すように設定
    window.getSelection.mockReturnValue(null);

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. 結果を検証
    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(window.prompt).toHaveBeenCalledWith('', undefined);
  });

  test('複数行のテキストが選択されている場合も正常に動作する', () => {
    // 1. 複数行のテキストを設定
    const multilineText = '1行目のテキスト\n2行目のテキスト\n3行目のテキスト';
    const mockSelection = {
      toString: jest.fn().mockReturnValue(multilineText)
    };
    window.getSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(mockSelection.toString).toHaveBeenCalledTimes(1);
    expect(window.prompt).toHaveBeenCalledWith('', multilineText);
  });

  test('特殊文字を含むテキストが選択されている場合も正常に動作する', () => {
    // 1. 特殊文字を含むテキストを設定
    const specialText = 'HTML要素: <div>test</div> & "quotes" \'single\'';
    const mockSelection = {
      toString: jest.fn().mockReturnValue(specialText)
    };
    window.getSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(mockSelection.toString).toHaveBeenCalledTimes(1);
    expect(window.prompt).toHaveBeenCalledWith('', specialText);
  });

  test('日本語テキストが選択されている場合も正常に動作する', () => {
    // 1. 日本語テキストを設定
    const japaneseText = 'これは日本語のテキストです。漢字、ひらがな、カタカナが含まれています。';
    const mockSelection = {
      toString: jest.fn().mockReturnValue(japaneseText)
    };
    window.getSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(mockSelection.toString).toHaveBeenCalledTimes(1);
    expect(window.prompt).toHaveBeenCalledWith('', japaneseText);
  });
});