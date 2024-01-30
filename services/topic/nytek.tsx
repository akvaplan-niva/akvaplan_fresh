const no = (
  <div class="nytek">
    Akvaplan-niva er akkreditert etter NS-EN ISO/IEC 17020 for inspeksjon av
    flytende oppdrettsanlegg i henhold til NS 9415 og tilbyr{" "}
    <b>lokalitetsundersøkelser</b> og inspeksjon av anlegg før utstedelse av
    {" "}
    <b>anleggssertifikat</b>.
    <details>
      <summary>Lokalitetsundersøkelse</summary>
      <span>
        En lokalitetsundersøkelse leder til fastsettelsen av dimensjonerende
        verdier for bølgehøyder, strømforhold og andre relevante miljøkrefter på
        en oppdrettslokalitet. Resultatene av denne undersøkelsen utgjør
        lokalitetsrapporten. Dette er den viktigste rapporten for videre arbeid
        med krav som stilles i NYTEK23-forskriften og som setter rammer for bruk
        og dimensjonering av teknisk utstyr.

        Lokalitetsrapporter fra Akvaplan-niva inneholder påkrevd og relevant
        informasjon om miljøforhold på en lokalitet.
      </span>
    </details>
    <details>
      <summary>Anleggssertifikat</summary>
      <p>
        Et anleggssertifikat utstedes av et akkreditert inspeksjonsorgan og er
        en bekreftelse på at et flytende oppdrettsanlegg tilfredsstiller kravene
        i NYTEK23-forskriften og NS 9415:2009. Gjennom vår akkreditering{" "}
        <a
          href="https://www.akkreditert.no/akkrediterte-organisasjoner/inspeksjon/?AkkId=542"
          target="_blank"
          rel="noopener noreferrer"
        >
          INSP 013
        </a>{" "}
        innehar Akvaplan-niva den nødvendige kompetanse til å utstede
        anleggssertifikat.
      </p>
      <p>
        Et anleggssertifikat utstedes for fem år. Før et anleggssertifikat kan
        utstedes vil Akvaplan-niva foreta en gjennomgang av lokalitetsrapport,
        oppdretters dokumenter, inspisere anlegget og sjekke for avvik.
      </p>
      <p>
        Et anleggssertifikat beskriver det flytende akvakulturanleggets
        nåværende og fremtidige konfigurasjon. Anleggets konfigurasjon beskrives
        i form av fortøyning, flåte, flytekrage, not og ekstrautstyr. Dersom det
        gjennomføres endringer ut over beskrivelser gitt i anleggssertifikatet,
        må sertifikatet oppdateres. Den endrede delen av anlegget kan ikke tas i
        bruk før nytt anleggssertifikat er innhentet.
      </p>
      <p>
        Følgende dokumentasjon må foreligge før et anleggssertifikat kan
        utstedes:
      </p>
      <menu>
        <li>
          Fortøyningsanalyse som&nbsp;er
          I&nbsp;samsvar&nbsp;med&nbsp;installasjon&nbsp;på&nbsp;lokalitet
        </li>
        <li>Kart over fortøyningen</li>
        <li>Oversikt over fortøyningens konstruksjonsdeler</li>
        <li>Fortøyningsrapport etter utlegginsarbeidet</li>
        <li>Fortøyningsinspeksjonrapport (ROV-inspeksjon)</li>
        <li>Produktsertifikat for hovedkomponentene/hovedkomponentbevis</li>
        <li>Brukerhåndbøker for hovedkomponenter og ekstrautstyr</li>
      </menu>
    </details>
  </div>
);

const en = (
  <div class="nytek">
    <h2>Location Investigations and Construction Certificates</h2>
    Akvaplan-niva is accredited according to NS-EN ISO / IEC 17020 for
    inspection of floating aquaculture plants in accordance with NS 9415 and
    offers site surveys and inspection of plants before issuing a NYTEK23 plant
    certificate.
  </div>
);
export const nytek = new Map([
  ["no", no],
  ["en", en],
]);
