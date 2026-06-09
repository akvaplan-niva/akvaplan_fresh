import type { PageProps } from "$fresh/server.ts";
export default function App(props: PageProps) {
  const { state } = props;

  return (
    <html prefix="og:https://ogp.me/ns#">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Akvaplan-niva</title>
        <meta property="og:site_name" content="Akvaplan-niva" />
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body>
        <props.Component {...props} />
      </body>
    </html>
  );
}
