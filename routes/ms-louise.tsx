import { Page } from "akvaplan_fresh/components/page.tsx";

import { type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "{/:lang(en|no)}?/{ms-}?louise",
};
const louise = (
  <main id="main" class="site-main">
    <figure class="page-thumbnail">
      <img
        src="https://resources.mynewsdesk.com/image/upload/f1mpl9ton5mxj2m7lrt0.jpg"
        alt="MS Louise"
      />
    </figure>
    <header class="page-header">
      <div class="page-summary">
        <h1 class="page-title">MS Louise</h1>
        <div class="page-intro">
          MS Louise er en 12 meters båt utstyrt for prøvetaking og håndtering av
          utstyr.
        </div>
      </div>
    </header>
    <div class="page-content">
      <p>
        Båten har 2 linehalere (300 kg kapasitet) og nokk (1 tonn kapasitet).
        Båten er innredet med vaskestasjon for bunnprøver. <em>MS Louise</em>
        {" "}
        har videre en DP (dynamisk posisjonering) som holder båten i fast
        posisjon under prøvetaking. Dette bidrar til å effektivisere arbeidet om
        bord.{" "}
        <em>MS Louise</em>&nbsp;har tilstrekkelig dekksplass og løfteutstyr som
        bidrar til at båten kan fungere som en plattform for eksempelvis
        ROV-undersøkelse og bunnkartlegging.
      </p>
      <p>
        Fartøyet har høy marsjfart (28) knop), og også effektiviserer
        gjennomføring av oppdrag og gir båten en meget god rekkevidde.{" "}
        <em>MS Louise</em>{" "}
        er klassifisert for fartsområde 5 – Liten kystfart. Dette betyr at båten
        kan nå alle lokaliteter som ligger innenfor 20 nautiske mil fra
        grunnlinjen, i praksis vil dette si at fartøyet er godkjent for bruk på
        alle dagens lokaliteter for oppdrett langs norskekysten. Båten er
        utstyrt med påkrevet sikkerhetsutstyr og navigasjonsmidler, og føres av
        personell med de nødvendige kvalifikasjoner.
      </p>
      <p>
        Under dekk finner man 2 Iveco motorer med 430 hk og Doen waterjet
        system. ROV som anvendes på fartøyet er en <em>Argus Mini</em>{" "}
        og ekoloddet som tas i bruk til bunnkartlegging er{" "}
        <em>Kongsberg EM2040P MKII</em>.
      </p>
      <p>
        <iframe
          align="center"
          src="https://www.youtube.com/embed/4iwvMp2Ghe0"
          width="560"
          height="315"
          frameborder="0"
          allowfullscreen="allowfullscreen"
        >
        </iframe>
      </p>
    </div>
  </main>
);

export default function Nav() {
  return <Page>{louise}</Page>;
}
