"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
    if(!session){
      router.push("/auth/signin")
    }
  }, [session, router])

  return null
}
