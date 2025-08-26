"use client";

type Props = {
  slug: string;
};

export default function TransactionDetail({ slug }: Props) {
  return <div> My Transaction:{slug}</div>;
}
