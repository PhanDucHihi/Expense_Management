import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <div className="flex justify-between">
      <BackButton />
      <Button className="cursor-pointer" variant={"destructive"}>{title}</Button>
    </div>
  );
}
