import presentationData from "../data/data.json";
import type { PresentationData } from "./types";
import Presentation from "./components/Presentation";

export default function Home() {
  const data = presentationData as PresentationData;
  return <Presentation data={data} />;
}
