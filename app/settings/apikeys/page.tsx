"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-localstorage";

const formSchema = z.object({
  openai: z.string().min(1, "OpenAI API Key is required"),
  anthropic: z.string().min(1, "Anthropic API Key is required"),
  google: z.string().min(1, "Google API Key is required"),
  huggingface: z.string().min(1, "Hugging Face API Key is required"),
  cohere: z.string().min(1, "Cohere API Key is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const defaultValues: FormValues = {
    openai: "",
    anthropic: "",
    google: "",
    huggingface: "",
    cohere: "",
  };

  const [storedSettings, setStoredSettings] = useLocalStorage(
    "aiApiKeys",
    defaultValues
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    // Load values from localStorage when the component mounts
    Object.keys(storedSettings).forEach((key) => {
      form.setValue(
        key as keyof z.infer<typeof formSchema>,
        storedSettings[key as keyof typeof storedSettings]
      );
    });
  }, [form, storedSettings]);

  const onSubmit = async (values: FormValues) => {
    // In a real application, you would send this data to your server
    // NEVER store API keys in the browser or expose them to the client in production
    console.log("API Keys:", values);

    // Store values in localStorage
    setStoredSettings(values);

    toast({
      title: "Settings saved",
      description: "Your API keys have been updated successfully.",
    });
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>AI Provider Settings</CardTitle>
        <CardDescription>
          Enter your API keys for each supported AI provider.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {Object.keys(form.getValues()).map((provider) => (
              <FormField
                key={provider}
                control={form.control}
                name={provider as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {provider} API Key
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={`Enter your ${provider} API key`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">
              Save Settings
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
