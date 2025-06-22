/**
 * @jest-environment jsdom
 */
describe('kaggleNotranslateブックマークレット実行', () => {

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('inputクラスとoutput_wrapperクラスにnotranslateクラスを追加し、bodyのoverflowYをvisibleにする', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <div class="input">Input content</div>
        <div class="output_wrapper">Output content</div>
        <div class="other">Other content</div>
      </div>
    `;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    const inputElements = document.querySelectorAll('.input');
    expect(inputElements.length).toBe(1);
    inputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });

    const outputElements = document.querySelectorAll('.output_wrapper');
    expect(outputElements.length).toBe(1);
    outputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });

    // bodyのoverflowYがvisibleに設定されていることを確認
    const bodyElements = document.querySelectorAll('body');
    expect(bodyElements.length).toBe(1);
    bodyElements.forEach(element => {
      expect(element.style.overflowY).toBe('visible');
    });

    // 他の要素には影響がないことを確認
    const otherElement = document.querySelector('.other');
    expect(otherElement.classList.contains('notranslate')).toBe(false);
  });

  test('対象要素が存在しない場合は何もしない', () => {
    // 1. 対象要素のないDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <p>No target elements here.</p>
        <span>A span element.</span>
      </div>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. bodyのoverflowYは設定されることを確認
    const bodyElements = document.querySelectorAll('body');
    expect(bodyElements.length).toBe(1);
    bodyElements.forEach(element => {
      expect(element.style.overflowY).toBe('visible');
    });
  });

  test('複数の対象要素が存在する場合、すべてに適用される', () => {
    // 1. 複数の対象要素を含むDOMをセットアップ
    document.body.innerHTML = `
      <div>
        <div class="input">Input 1</div>
        <div class="input">Input 2</div>
        <div class="output_wrapper">Output 1</div>
        <div class="output_wrapper">Output 2</div>
      </div>
    `;

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    const inputElements = document.querySelectorAll('.input');
    expect(inputElements.length).toBe(2);
    inputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });

    const outputElements = document.querySelectorAll('.output_wrapper');
    expect(outputElements.length).toBe(2);
    outputElements.forEach(element => {
      expect(element.classList.contains('notranslate')).toBe(true);
    });
  });
}); 