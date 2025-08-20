import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "page not found",
};

export default function NotFound() {
  return (
    <div className="px-2 flex flex-col items-center">
      <div className="mx-auto py-4 flex justify-center items-center gap-4 flex-col">
        <h2 className="text-2xl">Not Found</h2>
        <Image
          className="m-0 rounded-xl"
          src="/images/not-found.jpg"
          width={300}
          height={300}
          sizes="300px"
          alt="Page not found"
          priority={true}
          title="Page not found"
        />
      </div>
      <Button className="max-h-20" asChild>
        <Link href="/home" className="text-center hover:underline">
          <h3>Go Home</h3>
        </Link>
      </Button>
    </div>
  );
}
