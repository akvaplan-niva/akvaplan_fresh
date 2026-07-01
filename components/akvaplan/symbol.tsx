//const _path = "./static/akvaplan_symbol.svg";
//await Deno.readTextFile(_path)
//export const symbolDataURI = `data:image/svg+xml,${encodeURIComponent()}`;
/*
light/dark from media query:
.akvaplan_symbol {
  display: inline;
  --green: #00A2B2;
  --blue: #005392;
  --black: hsl(200 66% 7%);
  --white: white;
  background: transparent;
}
.upper-wave { fill: var(--white); }
.lower-wave { fill: var(--blue);  }
.circle { fill: var(--green); }

@media (prefers-color-scheme: dark) {
  .upper-wave{ fill: var(--blue); }
  .lower-wave{ fill: var(--green); }
  .circle { fill: var(--black); }
}*/

const style = `.akvaplan_symbol {
  display: inline;
  --green: #00A2B2;
  --blue: #005392;
  --black: hsl(200 66% 7%);
  --white: white;
  background: transparent;
}
.upper-wave{ fill: var(--blue); }
.lower-wave{ fill: var(--green); }
.circle { fill: var(--black); }

@media (prefers-color-scheme: white) {}`;

export const UseApnSym = (props) => (
  <svg class="icon" {...props}>
    <use href={`#akvaplan_symbol`} />
  </svg>
);
export const ApnSym = (props) => (
  <svg
    id="akvaplan_symbol"
    class="akvaplan_symbol"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 436 436"
    {...props}
  >
    <style type="text/css" dangerouslySetInnerHTML={{ __html: style }}></style>
    <g>
      <path
        class="circle"
        d="M417.81,129.59C383.79,53.25,307.31,0,218.33,0C97.75,0,0,97.75,0,218.33c0,5.89,0.3,11.71,0.76,17.49
		C143.34,215.52,210.21,39.3,417.81,129.59"
      />
      <path
        class="circle"
        d="M5.44,266.7c22.01,97.29,108.94,169.97,212.89,169.97c120.58,0,218.33-97.75,218.33-218.33
		c0-26.41-4.69-51.73-13.28-75.16C231.16,90.05,170.56,284.22,5.44,266.7"
      />
      <path
        class="lower-wave"
        d="M15.25,298.47c2.29,5.79,4.8,11.46,7.55,16.99c191.34,73.83,252.81-113.13,412.96-116.65
		c-0.78-8.75-2.04-17.35-3.82-25.77C249.38,138.24,188.69,332.68,15.25,298.47"
      />
      <path
        class="upper-wave"
        d="M0.76,235.82c142.58-20.3,209.45-196.52,417.05-106.23c0,0,3.18,6.39,6.04,14.9c-0.15-0.44-0.31-0.88-0.47-1.32
	C231.16,90.05,170.56,284.22,5.44,266.7C2.78,254.44,0.76,235.82,0.76,235.82z"
      />
    </g>
  </svg>
);
