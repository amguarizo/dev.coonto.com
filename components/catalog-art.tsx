import type { CSSProperties } from "react";

/** Cenas ilustrativas. O título da obra permanece como texto, fora da imagem. */
export function CatalogArt({ index, className="" }:{ index:number; className?:string }) {
  const col=index%4,row=Math.floor(index/4);
  const style:CSSProperties={backgroundPosition:`${col*100/3}% ${row*100/3}%`};
  return <span className={`catalog-art ${className}`} style={style} aria-hidden="true"/>;
}
