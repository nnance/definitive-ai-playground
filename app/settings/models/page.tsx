"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useLocalStorage } from "@/hooks/use-localstorage";

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

export default function AISettings() {
  const [selectedProviders, setSelectedProviders] = useLocalStorage<
    Record<UseCases, [Providers, string]>
  >("useCaseProviders", {
    chat: [Providers.OpenAI, models.OpenAI[0]],
    reasoning: [Providers.OpenAI, models.OpenAI[0]],
    fast: [Providers.OpenAI, models.OpenAI[0]],
    accurate: [Providers.OpenAI, models.OpenAI[0]],
  });

  const { chat, reasoning, fast, accurate } = selectedProviders;
  const form = useForm({
    defaultValues: {
      chatProvider: chat[0],
      chatModel: chat[1],
      reasoningProvider: reasoning[0],
      reasoningModel: reasoning[1],
      fastProvider: fast[0],
      fastModel: fast[1],
      accurateProvider: accurate[0],
      accurateModel: accurate[1],
    },
  });

  const updateProvider = (useCase: UseCases, provider: Providers) => {
    const model = models[provider][0];
    setSelectedProviders((prev) => ({
      ...prev,
      [useCase]: [provider, model],
    }));
    // form.setValue(`${useCase}Model`, model);
  };

  const updateModel = (useCase: UseCases, model: string) => {
    setSelectedProviders((prev) => ({
      ...prev,
      [useCase]: [form.getValues(`${useCase}Provider`), model],
    }));
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
                  updateProvider(useCase, value as Providers);
                }}
                value={field.value}
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
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  updateModel(useCase, value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models[form.getValues(`${useCase}Provider`)].map((model) => (
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
      <form className="space-y-6">
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
        </Card>
      </form>
    </Form>
  );
}
