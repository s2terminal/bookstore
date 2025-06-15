/**
 * @jest-environment jsdom
 */
describe('openPassword ブックマークレット実行', () => {

  // 各テストの前にHTMLの構造をリセットする
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('password型のinput要素をtext型に変更する', () => {
    // 1. テスト用のDOMをセットアップ
    document.body.innerHTML = `
      <form>
        <input type="text" value="ユーザー名" />
        <input type="password" value="秘密のパスワード" id="password-field" />
        <input type="submit" value="送信" />
      </form>
    `;

    const passwordField = document.querySelector('#password-field');
    
    // 実行前にpassword型であることを確認
    expect(passwordField.getAttribute('type')).toBe('password');

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(passwordField.getAttribute('type')).toBe('text');
    
    // 値は変更されないことを確認
    expect(passwordField.value).toBe('秘密のパスワード');
    
    // 他のinput要素は影響を受けないことを確認
    const textField = document.querySelector('input[type="text"]');
    expect(textField.getAttribute('type')).toBe('text');
    const submitButton = document.querySelector('input[type="submit"]');
    expect(submitButton.getAttribute('type')).toBe('submit');
  });

  test('password型のinput要素が存在しない場合は何もしない', () => {
    // 1. password型input要素のないDOMをセットアップ
    document.body.innerHTML = `
      <form>
        <input type="text" value="ユーザー名" />
        <input type="email" value="email@example.com" />
        <input type="submit" value="送信" />
      </form>
    `;

    // 2. スクリプトを実行してもエラーが起きないことを確認
    expect(() => {
      jest.isolateModules(() => {
        require('./index.js');
      });
    }).not.toThrow();

    // 3. 結果を検証（password型がないので、変化なし）
    expect(document.querySelector('input[type="password"]')).toBeNull();
    expect(document.querySelector('input[type="text"]')).not.toBeNull();
    expect(document.querySelector('input[type="email"]')).not.toBeNull();
  });

  test('複数のpassword型input要素がある場合は最初の要素のみ変更', () => {
    // 1. 複数のpassword型input要素があるDOMをセットアップ
    document.body.innerHTML = `
      <form>
        <input type="password" id="password1" value="パスワード1" />
        <input type="password" id="password2" value="パスワード2" />
        <input type="password" id="password3" value="パスワード3" />
      </form>
    `;

    const password1 = document.querySelector('#password1');
    const password2 = document.querySelector('#password2');
    const password3 = document.querySelector('#password3');
    
    // 実行前にすべてpassword型であることを確認
    expect(password1.getAttribute('type')).toBe('password');
    expect(password2.getAttribute('type')).toBe('password');
    expect(password3.getAttribute('type')).toBe('password');

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証（最初の要素のみtext型に変更される）
    expect(password1.getAttribute('type')).toBe('text');
    expect(password2.getAttribute('type')).toBe('password');
    expect(password3.getAttribute('type')).toBe('password');
  });

  test('既にtext型に変更されたinput要素がある場合の動作確認', () => {
    // 1. password型とtext型が混在するDOMをセットアップ
    document.body.innerHTML = `
      <form>
        <input type="text" id="already-text" value="既にテキスト型" />
        <input type="password" id="still-password" value="まだパスワード型" />
      </form>
    `;

    const alreadyText = document.querySelector('#already-text');
    const stillPassword = document.querySelector('#still-password');
    
    // 実行前の状態を確認
    expect(alreadyText.getAttribute('type')).toBe('text');
    expect(stillPassword.getAttribute('type')).toBe('password');

    // 2. テスト対象のスクリプトを実行
    jest.isolateModules(() => {
      require('./index.js');
    });

    // 3. 結果を検証
    expect(alreadyText.getAttribute('type')).toBe('text'); // 変化なし
    expect(stillPassword.getAttribute('type')).toBe('text'); // password -> text
  });
});
