"use client";
import { apiPrivate } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatVNDCompact } from "@/utils/format";

export default function MonthReport() {
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["monthlyReport"],
    queryFn: async () => {
      const res = await apiPrivate.get("transaction/reportMonth");
      console.log(res);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  if (isError || !report)
    return (
      <div className="text-center py-10 text-red-500">Error loading report</div>
    );

  const data = [
    { month: "Last Month", spent: report.spentLastMonth },
    { month: "This Month", spent: report.spentThisMonth },
  ];

  const chartConfig = {
    spent: {
      label: "Spent",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Comparison: This Month vs Last Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} margin={{ top: 30 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => formatVNDCompact(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by{" "}
          {(report.spentThisMonth - report.spentLastMonth).toFixed(2)} this
          month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing spending for the last 2 months
        </div>
      </CardFooter>
    </Card>
  );
}
