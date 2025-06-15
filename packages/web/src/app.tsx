const bookmarklets = import.meta.glob(
  '../../bookmarklet/src/*/bookmarklet.txt',
  { eager: true, query: '?raw', import: 'default' }
);

// @ts-ignore
import settings from '../../../bookmarklets.yaml';

export function App() {
  return (
    <>
      <div>
        <ul>
          {Object.keys(bookmarklets).map(key => {
            const name = key.replace('../../bookmarklet/src/', '').replace('/bookmarklet.txt', '');
            const bookmarklet = bookmarklets[key];
            if (typeof bookmarklet !== 'string') {
              console.error(`${name}のブックマークレットを読み込めませんでした`);
              return null;
            }
            const setting = settings["bookmarklets"][name];
            if (!setting) {
              console.error(`${name}の設定が見つかりません`);
              return null;
            }
            return (
              <li key={key}>
                <a href={bookmarklet} target="_blank" rel="noopener noreferrer">
                  {setting["title"] || name}
                </a>: <span>{setting["description"]}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}
