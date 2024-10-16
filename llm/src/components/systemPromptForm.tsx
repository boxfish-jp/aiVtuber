"use client";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Toaster } from "./ui/toaster";

const fetchSystemPrompt = async (
	setFunction: (name: "system", data: string) => void,
) => {
	const response = await fetch("/api/prompt/system");
	console.log(response.body);
	const data = await response.text();
	console.log(data);
	setFunction("system", data);
};
const formSchema = z.object({
	system: z.string().min(1, "system prompt is required"),
});

export const SystemPromptForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const [loading, setloading] = useState(true);

	const { toast } = useToast();

	useEffect(() => {
		if (loading) {
			fetchSystemPrompt(form.setValue);
		}
		setloading(false);
	}, [loading, form]);

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const response = await fetch("/api/prompt/system", {
			method: "POST",
			body: JSON.stringify({ prompt: data.system }),
		});

		if (response.ok) {
			toast({
				title: "System Prompt Updated",
			});
		} else {
			toast({
				title: "Failed to update system prompt",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-2"
				>
					<FormField
						control={form.control}
						name="system"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										className="h-24 min-h-9 overflow-hidden"
										placeholder="System Prompt"
										onInput={(e) => {
											const target = e.target as HTMLTextAreaElement;
											target.style.height = "0px";
											target.style.height = `${target.scrollHeight}px`;
										}}
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<Toaster />
		</>
	);
};
