import Head from "next/head"
import Navbar from "./Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Hackathon Team Builder</title>
        <meta name="description" content="Find your perfect hackathon team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  )
}

