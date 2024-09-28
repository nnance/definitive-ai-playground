"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

enum Providers {
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
  Google = "Google",
  Cohere = "Cohere",
}

enum UseCases {
  Chat = "chat",
  Reasoning = "reasoning",
  Fast = "fast",
  Accurate = "accurate",
}

const useCaseDescriptions = {
  chat: "Optimized for conversational interactions and natural language processing.",
  reasoning:
    "Designed for complex problem-solving, analysis, and logical deductions.",
  fast: "Prioritizes quick response times, ideal for real-time applications.",
  accurate:
    "Focuses on high precision and reliability in outputs, suitable for critical tasks.",
};

const models = {
  OpenAI: ["GPT-3.5", "GPT-4"],
  Anthropic: ["Claude", "Claude 2"],
  Google: ["PaLM", "Gemini"],
  Cohere: ["Command", "Command-Nightly"],
};

const FormSchema = z.object({
  chatProvider: z.string(),
  chatModel: z.string(),
  reasoningProvider: z.string(),
  reasoningModel: z.string(),
  fastProvider: z.string(),
  fastModel: z.string(),
  accurateProvider: z.string(),
  accurateModel: z.string(),
});

export default function AISettings() {
  const [selectedProviders, setSelectedProviders] = useState<
    Record<UseCases, Providers>
  >({
    chat: Providers.OpenAI,
    reasoning: Providers.OpenAI,
    fast: Providers.OpenAI,
    accurate: Providers.OpenAI,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      chatProvider: "OpenAI",
      chatModel: "GPT-3.5",
      reasoningProvider: "OpenAI",
      reasoningModel: "GPT-3.5",
      fastProvider: "OpenAI",
      fastModel: "GPT-3.5",
      accurateProvider: "OpenAI",
      accurateModel: "GPT-3.5",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    toast.success("Settings saved successfully!");
  }

  const updateModels = (useCase: UseCases, provider: Providers) => {
    setSelectedProviders((prev) => ({ ...prev, [useCase]: provider }));
    form.setValue(`${useCase}Model`, models[provider][0]);
  };

  const renderUseCase = (useCase: UseCases, label: string) => (
    <div key={useCase} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">
          {useCaseDescriptions[useCase]}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${useCase}Provider`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  updateModels(useCase, value as Providers);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Providers).map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${useCase}Model`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models[selectedProviders[useCase]].map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Model Settings</CardTitle>
            <CardDescription>
              Configure AI providers and models for different use cases.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderUseCase(UseCases.Chat, "Chat")}
            {renderUseCase(UseCases.Reasoning, "Reasoning")}
            {renderUseCase(UseCases.Fast, "Fast")}
            {renderUseCase(UseCases.Accurate, "Accurate")}
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Settings</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
