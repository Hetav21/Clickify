import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useChartContext } from "@/hooks/useChartContext";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardDescription, CardHeader } from "./ui/card";

export default function MobileAndDesktopPieChart({
  mode = "main",
}: {
  mode: "main" | "links";
}) {
  const { view, setView, pieData, chartConfig } = useChartContext(mode);

  return (
    <Card className="@container/card h-full">
      <CardHeader>
        <CardDescription>Select your preferred view</CardDescription>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={setView as (value: string) => void}
          variant="outline"
          className="w-full hidden *:data-[slot=toggle-group-item]:!px-4 @[400px]/card:flex"
        >
          <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
          <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
          <ToggleGroupItem value="visitors">Integrated</ToggleGroupItem>
        </ToggleGroup>

        <Select value={view} onValueChange={setView as (value: string) => void}>
          <SelectTrigger
            className="flex w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[400px]/card:hidden"
            size="sm"
            aria-label="Select a view"
          >
            <SelectValue placeholder="Integrated" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="mobile" className="rounded-lg">
              Mobile
            </SelectItem>
            <SelectItem value="desktop" className="rounded-lg">
              Desktop
            </SelectItem>
            <SelectItem value="visitors" className="rounded-lg">
              Integrated
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <div className="h-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              dataKey="value"
              fill="#8884d8"
            >
              {pieData.map((entry, index) => {
                const isSelected = view === "visitors" || view === entry.key;
                return (
                  <Cell
                    key={`cell-${index}`}
                    type="natural"
                    stroke="var(--color-desktop)"
                    fill={
                      chartConfig[entry.key as keyof typeof chartConfig].color
                    }
                    opacity={isSelected ? 1 : 0.4}
                  />
                );
              })}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
