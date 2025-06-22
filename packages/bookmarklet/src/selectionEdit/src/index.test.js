/**
 * @jest-environment jsdom
 */
describe('selectionEditブックマークレット実行', () => {
  let mockPrompt;
  let mockGetSelection;

  beforeEach(() => {
    // window.promptをモック化
    mockPrompt = jest.fn();
    window.prompt = mockPrompt;

    // window.getSelectionをモック化
    mockGetSelection = jest.fn();
    window.getSelection = mockGetSelection;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('選択されたテキストをpromptで表示する', () => {
    // 1. 選択されたテキストをモック化
    const mockSelection = {
      toString: jest.fn().mockReturnValue('Selected text content')
    };
    mockGetSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(mockPrompt).toHaveBeenCalledWith('', 'Selected text content');
    expect(mockPrompt).toHaveBeenCalledTimes(1);
    expect(mockGetSelection).toHaveBeenCalledTimes(1);
  });

  test('選択されたテキストが空の場合でも正しく動作する', () => {
    // 1. 空の選択をモック化
    const mockSelection = {
      toString: jest.fn().mockReturnValue('')
    };
    mockGetSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(mockPrompt).toHaveBeenCalledWith('', '');
    expect(mockPrompt).toHaveBeenCalledTimes(1);
  });

  test('選択が存在しない場合でも正しく動作する', () => {
    // 1. 選択が存在しない場合をモック化
    mockGetSelection.mockReturnValue(null);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(mockPrompt).toHaveBeenCalledWith('', undefined);
    expect(mockPrompt).toHaveBeenCalledTimes(1);
  });

  test('長いテキストが選択された場合でも正しく動作する', () => {
    // 1. 長いテキストをモック化
    const longText = 'This is a very long selected text that contains multiple words and should be displayed in the prompt dialog. It might contain special characters like !@#$%^&*() and numbers 123456789.';
    const mockSelection = {
      toString: jest.fn().mockReturnValue(longText)
    };
    mockGetSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(mockPrompt).toHaveBeenCalledWith('', longText);
    expect(mockPrompt).toHaveBeenCalledTimes(1);
  });

  test('特殊文字が含まれるテキストでも正しく動作する', () => {
    // 1. 特殊文字を含むテキストをモック化
    const specialText = 'Text with special chars: \n\t\r"\'\\&<>';
    const mockSelection = {
      toString: jest.fn().mockReturnValue(specialText)
    };
    mockGetSelection.mockReturnValue(mockSelection);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(mockPrompt).toHaveBeenCalledWith('', specialText);
    expect(mockPrompt).toHaveBeenCalledTimes(1);
  });
}); 