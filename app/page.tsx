'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const handleGetStarted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/dashboard")
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>
        <div className="hero bg-base-200 p-20 rounded-xl">
          <div className="hero-content text-center">
            <form className="max-w-md flex flex-col gap-2"
              onSubmit={handleGetStarted}>
              <h1 className="text-5xl font-bold">GDRR</h1>
              <p className="py-6">
                Game Data Retrieval with RAG
              </p>
              <button className="btn btn-primary">Get Started</button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
