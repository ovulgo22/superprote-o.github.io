import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Custom Docs Site</title>
        <meta name="description" content="Documentation site like GitHub Docs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Welcome to Custom Docs</h1>
        <p>A modern documentation platform inspired by GitHub Docs.</p>
        <Link href="/docs/getting-started">Get Started</Link>
      </main>
    </div>
  );
}