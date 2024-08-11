import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Chat } from ".prisma/client";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  type: z.string(),
});

export const ChatTable = ({ chats }: { chats: Chat[] }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const listEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>選択</TableHead>
                        <TableHead>id</TableHead>
                        <TableHead>who</TableHead>
                        <TableHead>内容</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {chats.map((chat) => (
                        <TableRow key={chat.id.toString()}>
                          <TableCell>
                            <RadioGroupItem value={chat.id.toString()} />
                          </TableCell>
                          <TableCell>{chat.id}</TableCell>
                          <TableCell>{chat.who}</TableCell>
                          <TableCell>{chat.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
