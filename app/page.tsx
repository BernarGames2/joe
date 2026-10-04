import { connection } from "next/server";
import { ACasa } from "@/components/ACasa";
import { Avaliacoes } from "@/components/Avaliacoes";
import { Cardapio } from "@/components/Cardapio";
import { ComandaProvider } from "@/components/ComandaProvider";
import { ComoChegar } from "@/components/ComoChegar";
import { ComoFunciona } from "@/components/ComoFunciona";
import { CtaFinal } from "@/components/CtaFinal";
import { FloatingZap } from "@/components/FloatingZap";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatusBar } from "@/components/StatusBar";
import { StatusProvider } from "@/components/StatusProvider";
import { LOGO_SRC, TEM_LOGO } from "@/lib/brand";
import { ENDERECO, HORARIO, INSTAGRAM_URL, NOME, SITE_URL, TEL } from "@/lib/config";
import { openingHoursSpecification } from "@/lib/horario";
import { baseUrl } from "@/lib/site";

// Sem aggregateRating nem review: o Google não aceita avaliação própria no próprio site.
function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: NOME,
    ...(TEM_LOGO ? { image: `${baseUrl()}${LOGO_SRC}` } : {}),
    ...(SITE_URL ? { url: SITE_URL } : {}),
    telephone: TEL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ENDERECO.rua,
      addressLocality: ENDERECO.cidade,
      addressRegion: ENDERECO.uf,
      postalCode: ENDERECO.cep,
      addressCountry: "BR",
    },
    servesCuisine: "Hambúrguer",
    openingHoursSpecification: openingHoursSpecification(HORARIO),
    sameAs: [INSTAGRAM_URL],
  };
}

export default async function Page() {
  // Renderiza no momento do request: o status "chapa acesa/apagada" sai certo já no HTML.
  await connection();
  const agora = Date.now();

  return (
    <StatusProvider inicial={agora}>
      <ComandaProvider>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <div id="topo" />
        <StatusBar />
        <Header />
        <main id="conteudo">
          <Hero />
          <ComoFunciona />
          <Cardapio />
          <ACasa />
          <Avaliacoes />
          <ComoChegar />
          <CtaFinal />
        </main>
        <Footer />
        <FloatingZap />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
        />
      </ComandaProvider>
    </StatusProvider>
  );
}
