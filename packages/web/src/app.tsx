const bookmarklets = import.meta.glob(
  '../../bookmarklet/src/*/bookmarklet.txt',
  { eager: true, query: '?raw', import: 'default' }
);


export function App() {
  return (
    <>
      <h1>Bookstore</h1>
      <div>
        <ul>
          {Object.keys(bookmarklets).map(key => {
            const name = key.replace('../../bookmarklet/src/', '').replace('/bookmarklet.txt', '');
            const bookmarklet = bookmarklets[key];
            if (typeof bookmarklet !== 'string') {
              console.error(`${name}のブックマークレットを読み込めませんでした`);
              return null;
            }
            return (
              <li key={key}>
                <a href={bookmarklet} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}
