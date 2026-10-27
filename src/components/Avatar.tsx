import { useState } from "react";
import photo from "../../assets/me/pfp.jpeg";

// Foto redonda como um adesivo: a ponta inferior direita descola no hover ou no toque.
export function Avatar({ alt }: { alt: string }) {
  const [peeled, setPeeled] = useState(false);

  return (
    <div
      className={`avatar${peeled ? " is-peeled" : ""}`}
      onClick={() => setPeeled((value) => !value)}
      onMouseLeave={() => setPeeled(false)}
    >
      <img className="avatar-photo" src={photo} alt={alt} width="548" height="548" />
      <span className="avatar-peel" aria-hidden="true">
        <span />
      </span>
    </div>
  );
}
