"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-localstorage";

const LOCAL_STORAGE_KEY = "useCaseModels";

const providers = ["OpenAI", "Anthropic", "Google", "Cohere"] as const;
type Provider = (typeof providers)[number];

const models: Record<Provider, readonly string[]> = {
  OpenAI: ["GPT-3.5", "GPT-4"],
  Anthropic: ["Claude", "Claude 2"],
  Google: ["PaLM", "Gemini"],
  Cohere: ["Command", "Command-Nightly"],
} as const;

const useCases = ["chat", "reasoning", "fast", "accurate"] as const;
type UseCase = (typeof useCases)[number];

const useCaseDescriptions: Record<UseCase, string> = {
  chat: "Optimized for conversational interactions and natural language processing.",
  reasoning:
    "Designed for complex problem-solving, analysis, and logical deductions.",
  fast: "Prioritizes quick response times, ideal for real-time applications.",
  accurate:
    "Focuses on high precision and reliability in outputs, suitable for critical tasks.",
};

const FormSchema = z.object({
  chatProvider: z.enum(providers),
  chatModel: z.string(),
  reasoningProvider: z.enum(providers),
  reasoningModel: z.string(),
  fastProvider: z.enum(providers),
  fastModel: z.string(),
  accurateProvider: z.enum(providers),
  accurateModel: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AISettings() {
  const { toast } = useToast();
  const [modelSettings, setModelSettings] = useLocalStorage<FormValues>(
    LOCAL_STORAGE_KEY,
    {
      chatProvider: "OpenAI",
      chatModel: "GPT-3.5",
      reasoningProvider: "OpenAI",
      reasoningModel: "GPT-3.5",
      fastProvider: "OpenAI",
      fastModel: "GPT-3.5",
      accurateProvider: "OpenAI",
      accurateModel: "GPT-3.5",
    }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: modelSettings,
  });

  const [selectedProviders, setSelectedProviders] = useState<
    Record<UseCase, Provider>
  >({
    chat: modelSettings.chatProvider,
    reasoning: modelSettings.reasoningProvider,
    fast: modelSettings.fastProvider,
    accurate: modelSettings.accurateProvider,
  });

  useEffect(() => {
    // Update models when providers change
    Object.entries(selectedProviders).forEach(([useCase, provider]) => {
      const availableModels = models[provider];
      const currentModel = form.getValues(
        `${useCase}Model` as keyof FormValues
      );
      if (!availableModels.includes(currentModel)) {
        form.setValue(
          `${useCase}Model` as keyof FormValues,
          availableModels[0]
        );
      }
    });
  }, [selectedProviders, form]);

  function onSubmit(data: FormValues) {
    setModelSettings(data);
    toast({
      title: "Settings saved",
      description: "Your Model Use Cases successfully updated and stored.",
      duration: 3000,
    });
  }

  const updateProvider = (useCase: UseCase, provider: Provider) => {
    setSelectedProviders((prev) => ({ ...prev, [useCase]: provider }));
    const availableModels = models[provider];
    form.setValue(`${useCase}Model` as keyof FormValues, availableModels[0]);
  };

  const renderUseCase = (useCase: UseCase, label: string) => (
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
          name={`${useCase}Provider` as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select
                onValueChange={(value: Provider) => {
                  field.onChange(value);
                  updateProvider(useCase, value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the AI provider for this use case.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${useCase}Model` as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
              <FormDescription>
                Select the AI model for this use case.
              </FormDescription>
              <FormMessage />
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
            {[...useCases].map((useCase) =>
              renderUseCase(
                useCase,
                useCase.charAt(0).toUpperCase() + useCase.slice(1)
              )
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
