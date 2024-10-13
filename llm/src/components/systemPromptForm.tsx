"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";

const formSchema = z.object({
	prompt: z.string().min(1, "system prompt is required"),
});

export const SystemPromptForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const { toast } = useToast();

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const response = await fetch("/api/prompt/system", {
			method: "POST",
			body: JSON.stringify({ prompt: data.prompt }),
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
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="prompt"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea placeholder="System Prompt" {...field} />
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
