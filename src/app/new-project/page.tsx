"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  funnelTitle: z.string().min(5, { message: "O título do projeto deve ter pelo menos 5 caracteres." }),
  lowTicket: z.object({
    name: z.string().min(3, { message: "O nome do produto é obrigatório." }),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Insira um preço válido (ex: 27.00)." }),
    type: z.string().min(3, { message: "O tipo do produto é obrigatório (ex: Ebook)." }),
  }),
  orderBumps: z.array(
    z.object({
      name: z.string().min(3, { message: "O nome do Order Bump é obrigatório." }),
      price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Insira um preço válido (ex: 17.90)." }),
      type: z.string().min(3, { message: "O tipo é obrigatório (ex: Checklist)." }),
    })
  ).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      funnelTitle: "",
      lowTicket: { name: "", price: "", type: "" },
      orderBumps: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderBumps",
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ProjectFormValues) {
    toast.info("Criando seu novo projeto...");
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o projeto.');
      }

      toast.success("Projeto criado com sucesso!");
      router.push('/projects');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cadastrar Novo Projeto</h1>
        <p className="text-gray-500">Preencha os detalhes do seu funil de produtos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Projeto</CardTitle>
          <CardDescription>Defina o produto principal e os order bumps.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="funnelTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Projeto/Funil</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Funil de Produtividade para Criadores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Produto Principal (Low Ticket)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="lowTicket.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Ebook 'Foco Total'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lowTicket.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input placeholder="27.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lowTicket.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ebook" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Order Bumps</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: "", price: "", type: "" })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Order Bump
                    </Button>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg flex items-start gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                       <FormField
                        control={form.control}
                        name={`orderBumps.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Checklist de Ação" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`orderBumps.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl>
                              <Input placeholder="17.90" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`orderBumps.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                              <Input placeholder="Checklist" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Projeto
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}