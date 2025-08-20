import { Loader2 } from "lucide-react";

type Props = {
  className?: string;
};

export default function Loading({ className }: Props) {
  return <Loader2 className={`${className} animate-spin`} />;
}
