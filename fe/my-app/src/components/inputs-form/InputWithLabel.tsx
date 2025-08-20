import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

type Props<S> = {
  nameInSchema: keyof S & string;
  fieldTitle: string;
  type?: string;
};

export default function InputWithLabel<S>({
  nameInSchema,
  fieldTitle,
  type,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        // console.log(field);
        // console.log("onChange function:", field.onChange.toString());
        return (
          <FormItem>
            <FormLabel>{fieldTitle}</FormLabel>
            <FormControl>
              <Input
                type={type}
                placeholder={`Enter ${fieldTitle}`}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
