// import { ArrowLeftCircle } from "lucide-react";

// export default function Home() {
//   return (
//     <main className="flex space—x—2 items—center animate—pulse">
//       <ArrowLeftCircle className="w—12 h—12" />
//       <h1 className="font—bold">Get started with creating a New Document</h1>
//     </main>
//   );
// }

import Header from "./landingPageComponents/Header";
import Hero from "./landingPageComponents/Hero";
import Footer from "./landingPageComponents/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
