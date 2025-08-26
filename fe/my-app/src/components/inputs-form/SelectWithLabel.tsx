"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type DataObj = {
  id: string;
  description: string;
  icon?: string;
};

type Props<S> = {
  nameInSchema: keyof S & string;
  data: DataObj[];
  fieldTitle: string;
  className?: string;
};

export function SelectWithLabel<S>({
  nameInSchema,
  data,
  fieldTitle,
  className,
}: Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldTitle}</FormLabel>
          <Select
            {...field}
            onValueChange={(val) => field.onChange(Number(val))} // string -> number
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger className={`w-full max-w-xs ${className}`}>
                <SelectValue placeholder={`Select ${fieldTitle}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={`${nameInSchema}_${item.id}`} value={item.id}>
                  {item.icon} {item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
