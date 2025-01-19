import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center flex-col">
        <Image
          src="/assets/header.svg"
          alt="Header"
          width={1500}
          height={200}
          priority
        />
        <div className="flex gap-4 mt-8">
          <button className="font-sora btn-download px-6 py-3 rounded-lg">
            Download
          </button>
          <button className="btn-outline px-6 py-3 rounded-lg">
            Learn More
          </button>
        </div>
      </main>
    </>
  );
}
