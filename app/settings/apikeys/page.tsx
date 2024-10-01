"use client";

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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AiSettings() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useLocalStorage<Record<string, string>>(
    "aiApiKeys",
    {
      openai: "",
      anthropic: "",
      google: "",
      cohere: "",
      huggingface: "",
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // The apiKeys are already saved in local storage due to our custom hook
    // We're just showing a confirmation toast here
    toast({
      title: "Settings saved",
      description: "Your API keys have been successfully updated and stored.",
      duration: 3000,
    });
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Provider Settings</CardTitle>
        <CardDescription>
          Enter your API keys for each supported AI provider.
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
        <CardFooter>
          <Button type="submit">Save Settings</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
