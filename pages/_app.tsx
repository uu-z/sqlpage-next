import { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SQL-Driven UI</title>
        <meta name="description" content="A demo of SQL-driven UI with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
