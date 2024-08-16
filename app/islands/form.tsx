import { useCallback } from "hono/jsx";

export function Form() {
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    console.log("onsubmit");
  }, []);
  return (
    <form action="#" method="POST" onSubmit={onSubmit}>
      <div>
        Récupérer les fichiers à convertir
      </div>
      <div>
        <input type="file" />
      </div>

      <select name="format">
        <option>mp4</option>
        <option>avi</option>
      </select>

      <button type="submit">envoyer</button>
    </form>
  );
}
