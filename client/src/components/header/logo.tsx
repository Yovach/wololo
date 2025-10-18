import { JSX, memo, NamedExoticComponent } from "react";

const imgUrl = new URL("../../images/wololo-logo.png", import.meta.url).href;

export const Logo: NamedExoticComponent = memo(function Logo(): JSX.Element {
  return <img src={imgUrl} className="h-16 m-8 aspect-auto justify-self-center" height={64} />;
});
