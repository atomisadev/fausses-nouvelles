import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center flex-col">
        <Image
          src="/assets/header.svg"
          alt="Header"
          width={1200}
          height={200}
          priority
        />
        <div className="flex gap-4 mt-4">
          <button className="btn-download px-5 py-2 rounded-lg">
            Download
          </button>
          <button className="btn-outline px-5 py-2 rounded-lg">
            <a href="https://github.com/atomisadev/fausses-nouvelles-backend" target="_blank">Github</a>
          </button>
        </div>
      </main>
    </>
  );
}
