import { Inter } from "next/font/google";
import HomeFeatures from "@/features/home";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <HomeFeatures/>
    </>
  );
}
