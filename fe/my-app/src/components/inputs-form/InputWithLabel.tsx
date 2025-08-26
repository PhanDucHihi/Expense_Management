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
  typeValue?: string;
  className?: string;
};

export default function InputWithLabel<S>({
  nameInSchema,
  fieldTitle,
  type,
  typeValue,
  className,
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
                className={className}
                type={type}
                placeholder={`Enter ${fieldTitle}`}
                {...field}
                onChange={(e) => {
                  const val = e.target.value;
                  // Chỉ cho phép nhập số
                  if (typeValue === "number") {
                    if (/^\d*$/.test(val)) {
                      field.onChange(val === "" ? 0 : Number(val));
                    }
                  } else {
                    field.onChange(val);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
