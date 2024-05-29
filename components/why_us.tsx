import {
  eco,
  flexible,
  Icon,
  science,
  share,
} from "akvaplan_fresh/components/icon.tsx";

const card = {
  fill: "var(--text2)",
  display: "grid",
  //padding: "var(--size-1)",
  gap: "var(--size-2)",
  placeItems: "center",
  gridTemplateColumns: "1fr",
};
const li = {
  display: "grid",
  placeItems: "center",
  justifyContent: "middle",
  //gridTemplateColumns: "320px",
  //fontSize: "2rem",
  gap: "1rem",
  //marginBottom: "1rem",
  background: "var(--surface0)",
};

export const WeAre = (lang) => <Icon name="eco">Bærekraftig</Icon>;
export const WhyUs = () => (
  <div
    style={{
      background: "var(--surface3)",
      opacity: 0.5,
      placeItems: "center",
      justifyContent: "middle",
      margin: 0,
      //padding: "1rem",
    }}
  >
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr", //"repeat(auto-fit, minmax(320px, 1fr))",
        placeItems: "center",
        justifyContent: "middle",
        margin: 0,
        padding: "1rem",
      }}
    >
      <li style={li}>
        <div style={card}>
          {share}
          <span>
            tverrfaglig
          </span>
        </div>
      </li>

      <li style={li}>
        <div style={card}>
          {science}
          <span>
            vitenskapelig
          </span>
        </div>
      </li>
      <li style={li}>
        <div style={card}>
          {flexible}
          <span>
            fleksibel
          </span>
        </div>
      </li>
      <li style={li}>
        <div style={card}>
          {eco}
          <span>
            bærekraftig
          </span>
        </div>
      </li>
    </ul>
  </div>
);
