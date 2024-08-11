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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Chat } from ".prisma/client";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  chatId: z.string(),
});

export const ChatTable = ({ chats }: { chats: Chat[] }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const listEndRef = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onsubmit)}
        className="flex flex-col gap-6 items-center"
      >
        <div className="self-start mx-0 w-full">
          <FormField
            control={form.control}
            name="chatId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <ScrollArea className="h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">選択</TableHead>
                            <TableHead className="w-16">id</TableHead>
                            <TableHead className="w-16">who</TableHead>
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
                          <TableRow ref={listEndRef} />
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-fit">
          送信
        </Button>
      </form>
    </Form>
  );
};
