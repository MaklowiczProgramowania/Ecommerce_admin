"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1, "Store name is required"),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [ loading, setLoading ] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            setLoading(true);

            const response = await axios.post("/api/stores", values);

            window.location.assign(`/${response.data.id}`);
        } catch(error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <Modal
            title="Create a new store"
            description="Add a new store to your account."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}    
        >
            <div>
                <div className="space-y-4 py-4 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="E-commerce" {...field} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button disabled={loading} variant="secondary" onClick={storeModal.onClose}>Cancel</Button>
                                <Button disabled={loading} type="submit">Create</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}
