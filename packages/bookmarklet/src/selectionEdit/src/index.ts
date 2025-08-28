(function() {
  function showSelectionDialog(text?: string): void {
    if (!text) {
      return;
    }
    const DIALOG_ID = 'bookstore-selection-edit-dialog';
    // 既存のダイアログがあれば削除
    const existingDialog = document.getElementById(DIALOG_ID);
    if (existingDialog) {
      existingDialog.remove();
    }
    // ダイアログ要素を作成
    const dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.id = DIALOG_ID;

    // 選択されたテキストを表示するためのテキストエリアを作成
    const textarea = document.createElement('textarea') as HTMLTextAreaElement;
    textarea.value = text;
    textarea.style.width = '400px';
    textarea.style.height = '200px';
    textarea.style.resize = 'both';

    // 閉じるボタンを作成
    const closeButton = document.createElement('button');
    closeButton.textContent = '閉じる';
    closeButton.addEventListener('click', function() {
      dialog.close();
      dialog.remove();
    });

    // 要素を追加
    dialog.appendChild(closeButton);
    dialog.appendChild(textarea);
    document.body.appendChild(dialog);

    // ダイアログを表示
    dialog.showModal();
  }

  showSelectionDialog(window.getSelection()?.toString());
})();
