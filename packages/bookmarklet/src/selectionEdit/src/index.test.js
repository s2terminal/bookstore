/**
 * @jest-environment jsdom
 */
describe('selectionEdit ブックマークレット実行', () => {
  let originalCreateElement;
  const DIALOG_ID = 'bookstore-selection-edit-dialog';

  beforeEach(() => {
    document.body.innerHTML = '';

    // window.getSelection のモック
    global.window.getSelection = jest.fn();

    // jsdom には <dialog> の showModal がないため、生成時に差し込む
    originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const el = originalCreateElement(tagName, options);
      if (String(tagName).toLowerCase() === 'dialog') {
        el.showModal = jest.fn();
        el.close = jest.fn();
      }
      return el;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (document.createElement.mockRestore) {
      document.createElement.mockRestore();
    }
  });

  test('選択されたテキストをダイアログに表示する', () => {
    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue('選択されたテキスト') });

    jest.isolateModules(() => {
      require('./index.js');
    });

    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(window.getSelection().toString).toHaveBeenCalledTimes(1);

    const dialog = document.getElementById(DIALOG_ID);
    expect(dialog).not.toBeNull();
    const textarea = dialog.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(textarea.value).toBe('選択されたテキスト');
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
  });

  test('テキストが選択されていない場合はダイアログを表示しない（空文字）', () => {
    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue('') });

    jest.isolateModules(() => {
      require('./index.js');
    });

    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(document.getElementById(DIALOG_ID)).toBeNull();
  });

  test('getSelectionがnullを返す場合でもエラーにならずダイアログを表示しない', () => {
    window.getSelection.mockReturnValue(null);

    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    expect(window.getSelection).toHaveBeenCalledTimes(1);
    expect(document.getElementById(DIALOG_ID)).toBeNull();
  });

  test('複数行のテキストが選択されている場合も正常にダイアログに表示する', () => {
    const multilineText = '1行目のテキスト\n2行目のテキスト\n3行目のテキスト';
    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue(multilineText) });

    jest.isolateModules(() => {
      require('./index.js');
    });

    const dialog = document.getElementById(DIALOG_ID);
    expect(dialog).not.toBeNull();
    const textarea = dialog.querySelector('textarea');
    expect(textarea.value).toBe(multilineText);
  });

  test('特殊文字を含むテキストが選択されている場合も正常にダイアログに表示する', () => {
    const specialText = 'HTML要素: <div>test</div> & "quotes" \'single\'';
    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue(specialText) });

    jest.isolateModules(() => {
      require('./index.js');
    });

    const dialog = document.getElementById(DIALOG_ID);
    expect(dialog).not.toBeNull();
    const textarea = dialog.querySelector('textarea');
    expect(textarea.value).toBe(specialText);
  });

  test('日本語テキストが選択されている場合も正常にダイアログに表示する', () => {
    const japaneseText = 'これは日本語のテキストです。漢字、ひらがな、カタカナが含まれています。';
    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue(japaneseText) });

    jest.isolateModules(() => {
      require('./index.js');
    });

    const dialog = document.getElementById(DIALOG_ID);
    expect(dialog).not.toBeNull();
    const textarea = dialog.querySelector('textarea');
    expect(textarea.value).toBe(japaneseText);
  });

  test('再実行時は既存ダイアログを削除して作り直す', () => {
    const firstText = '一度目';
    const secondText = '二度目';

    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue(firstText) });
    jest.isolateModules(() => {
      require('./index.js');
    });
    let dialog = document.getElementById(DIALOG_ID);
    let textarea = dialog.querySelector('textarea');
    expect(textarea.value).toBe(firstText);

    window.getSelection.mockReturnValue({ toString: jest.fn().mockReturnValue(secondText) });
    jest.isolateModules(() => {
      require('./index.js');
    });

    const dialogs = document.querySelectorAll(`#${DIALOG_ID}`);
    expect(dialogs.length).toBe(1);
    dialog = dialogs[0];
    textarea = dialog.querySelector('textarea');
    expect(textarea.value).toBe(secondText);
  });
});
