export const Forbidden = () =>
  new Response(
    `<body>
    <h1>403 Forbidden</h1>
    <a href="/auth/sign-in">Sign in</a>
    </body>`,
    {
      status: 403,
      headers: { "content-type": "text/html" },
    },
  );
