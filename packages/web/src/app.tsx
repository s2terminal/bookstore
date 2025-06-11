import myText from '../../bookmarklet/src/notranslate/dist.mjs?raw';

export function App() {
  return (
    <>
      <h1>Bookstore</h1>
      <div>
        <ul>
          <li>
            <a href={myText}>notranslate</a>
          </li>
        </ul>
      </div>
    </>
  )
}
