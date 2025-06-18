/**
 * @jest-environment jsdom
 */
describe('kaggleNotranslate ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('input要素にnotranslateクラスを追加する', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <div class="input">
          <p>入力エリア1</p>
        </div>
        <div class="input">
          <p>入力エリア2</p>
        </div>
        <div class="other-class">
          <p>その他のエリア</p>
        </div>
      </div>
    `;

    const inputElements = document.querySelectorAll('.input');
    const otherElement = document.querySelector('.other-class');

    // 実行前にnotranslateクラスがないことを確認
    inputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(false);
    });
    expect(otherElement.classList.contains('notranslate')).toBe(false);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    inputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });
    // 他のクラスは影響を受けないことを確認
    expect(otherElement.classList.contains('notranslate')).toBe(false);
  });

  test('output_wrapper要素にnotranslateクラスを追加する', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <div class="output_wrapper">
          <p>出力エリア1</p>
        </div>
        <div class="output_wrapper">
          <p>出力エリア2</p>
        </div>
        <div class="other-wrapper">
          <p>その他のラッパー</p>
        </div>
      </div>
    `;

    const outputElements = document.querySelectorAll('.output_wrapper');
    const otherElement = document.querySelector('.other-wrapper');

    // 実行前にnotranslateクラスがないことを確認
    outputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(false);
    });
    expect(otherElement.classList.contains('notranslate')).toBe(false);

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    outputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });
    // 他のクラスは影響を受けないことを確認
    expect(otherElement.classList.contains('notranslate')).toBe(false);
  });

  test('body要素のoverflowYスタイルをvisibleに設定する', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>コンテンツ</p>
      </div>
    `;

    // 実行前のbodyのスタイルを確認（初期値は空文字）
    const initialOverflowY = document.body.style.overflowY;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(document.body.style.overflowY).toBe('visible');
  });

  test('input要素とoutput_wrapper要素が存在しない場合も正常に動作する', () => {
    // 1. 対象要素のないDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>通常のコンテンツ</p>
        <div class="other-class">その他のクラス</div>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. bodyのスタイルは変更されることを確認
    expect(document.body.style.overflowY).toBe('visible');
  });

  test('inputとoutput_wrapper要素が混在する場合の動作確認', () => {
    // 1. 混在するDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <div class="input">入力エリア</div>
        <div class="output_wrapper">出力エリア</div>
        <div class="input">入力エリア2</div>
        <div class="unrelated">関係ないエリア</div>
      </div>
    `;

    const inputElements = document.querySelectorAll('.input');
    const outputElements = document.querySelectorAll('.output_wrapper');
    const unrelatedElement = document.querySelector('.unrelated');

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    inputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });
    outputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });
    expect(unrelatedElement.classList.contains('notranslate')).toBe(false);
    expect(document.body.style.overflowY).toBe('visible');
  });
});