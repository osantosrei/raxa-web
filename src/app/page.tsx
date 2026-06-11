import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Raxa"
          width={96}
          height={96}
          priority
          className="mb-4 rounded-2xl"
        />
        <h1 className="font-outfit text-4xl font-extrabold text-primary">
          raxa
        </h1>
        <p className="mt-2 text-sm text-muted">Organize sua pelada</p>
      </div>
    </main>
  );
}
