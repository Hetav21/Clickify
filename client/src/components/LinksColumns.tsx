import { linksDataType } from "@/common/types/ApiResponse";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { Minus } from "lucide-react";

const displayValue = (value: string | null | undefined) => {
  return value && value.trim() !== "" ? (
    value
  ) : (
    <div className="flex items-center">
      <Minus />
      N/A
      <Minus />
    </div>
  );
};

export const linksColumns: ColumnDef<linksDataType>[] = [
  {
    accessorKey: "os",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operating System" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{displayValue(row.original.os)}</div>;
    },
  },
  {
    accessorKey: "device",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{displayValue(row.original.device)}</div>
      );
    },
  },
  {
    accessorKey: "browser",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Browser" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{displayValue(row.original.browser)}</div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => {
      const rawDate = new Date(row.getValue("timestamp"));
      const day = rawDate.getDate();
      const month = rawDate.toLocaleString("en-US", { month: "short" });
      const year = rawDate.getFullYear();

      // Get hours and minutes
      const hours = rawDate.getHours();
      const minutes = rawDate.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

      const getOrdinal = (n: number) => {
        if (n > 3 && n < 21) return `${n}th`;
        switch (n % 10) {
          case 1:
            return `${n}st`;
          case 2:
            return `${n}nd`;
          case 3:
            return `${n}rd`;
          default:
            return `${n}th`;
        }
      };

      return (
        <div className="font-medium">
          {getOrdinal(day)} {month}, {year} at {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP Address" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{displayValue(row.original.ip)}</div>;
    },
  },
  {
    accessorKey: "locale",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Locale" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{displayValue(row.original.locale)}</div>
      );
    },
  },
  {
    accessorKey: "referrer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referrer" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{displayValue(row.original.referrer)}</div>
      );
    },
  },
];
