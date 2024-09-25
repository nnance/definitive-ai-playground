"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Chat</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 h-32">
            A simple chat application to demonstrate the use of LLM.
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/chat")}>
              Get Started
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Long Term Memory</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 h-32">
            A feature to store and retrieve long-term information.
          </CardContent>
          <CardFooter>
            <Button className="w-full">Learn More</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
