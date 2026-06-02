import type { PageProps } from "$fresh/server.ts";
export default function App(props: PageProps) {
  const { state } = props;

  return (
    <html prefix="og:https://ogp.me/ns#">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>

        <meta property="og:site_name" content="Akvaplan-niva" />
        {
          /* <script
          type="application/json"
          id="state"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(state) }}
        /> */
        }
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:ital,wght@0,100..900;1,100..900&family=Geist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body>
        <props.Component {...props} />
      </body>
    </html>
  );
}
