"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";
import { useState } from "react";

const formSchema = z.object({
	examples: z.array(
		z.object({
			input: z.string().min(1),
			output: z.string().min(1),
		}),
	),
});

export const ExamplePromptForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			examples: [{ input: "", output: "" }],
		},
	});
	const fieldArray = useFieldArray({
		control: form.control,
		name: "examples",
	});

	const { toast } = useToast();

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		console.log(data);
		const response = await fetch("/api/prompt/example", {
			method: "POST",
			body: JSON.stringify({ prompt: data.examples }),
		});

		if (response.ok) {
			toast({
				title: "example Prompt Updated",
			});
		} else {
			toast({
				title: "Failed to update example prompt",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{fieldArray.fields.map((item, index) => (
						<div key={item.id}>
							<FormField
								control={form.control}
								name={`examples.${index}.input`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea placeholder="Input Prompt" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`examples.${index}.output`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea placeholder="Output Prompt" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<Button type="button" onClick={() => fieldArray.remove(index)}>
								delete
							</Button>
						</div>
					))}
					<Button
						type="button"
						onClick={() => fieldArray.append({ input: "", output: "" })}
					>
						Add Example
					</Button>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<Toaster />
		</>
	);
};
