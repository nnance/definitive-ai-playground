"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AiSettings() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    google: "",
    cohere: "",
    huggingface: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating an API call to save the keys
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your API keys have been successfully updated.",
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>AI Platform Settings</CardTitle>
        <CardDescription>
          Enter your API keys for each supported AI platform.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-4">
          {Object.entries(apiKeys).map(([platform, value]) => (
            <div key={platform} className="space-y-2">
              <Label htmlFor={platform} className="capitalize">
                {platform} API Key
              </Label>
              <div className="relative">
                <Input
                  id={platform}
                  name={platform}
                  type="password"
                  value={value}
                  onChange={handleInputChange}
                  className="pr-10"
                />
                {value ? (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                ) : (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Save</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
