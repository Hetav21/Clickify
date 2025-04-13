import { tableDataType } from "@/common/types/ApiResponse";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Infinity as Inf, LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { HandleTableActions } from "./HandleTableActions";

function onActionClick(link: tableDataType) {
  navigator.clipboard.writeText(
    `${window.location.protocol}//${window.location.host}/${link.shortUrl}`,
  );
  toast.success("URL copied to clipboard");
}

export const mainColumns: ColumnDef<tableDataType>[] = [
  {
    accessorKey: "shortUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short Url" />
    ),
    cell: ({ row }) => {
      return (
        <div
          onClick={() => onActionClick(row.original)}
          className="font-medium"
        >
          {row.original.shortUrl}
        </div>
      );
    },
  },
  {
    accessorKey: "longUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Redirect Url" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("longUrl") as string;

      // Remove protocol during display
      const displayUrl = url.replace(/^https?:\/\//, "");

      return (
        <div className="font-medium">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {displayUrl}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "totalClicks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Clicks" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.totalClicks}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Creation" />
    ),
    cell: ({ row }) => {
      const rawDate = new Date(row.getValue("createdAt"));

      const day = rawDate.getDate();
      const month = rawDate.toLocaleString("en-US", { month: "short" });
      const year = rawDate.getFullYear();

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
          {getOrdinal(day)} {month}, {year}
        </div>
      );
    },
  },
  {
    accessorKey: "isExpired",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiration Status" />
    ),
    cell: ({ row }) => (
      <div className="flex font-medium ml-auto">
        <Badge variant="outline" className="font-medium">
          {!row.original.isExpired ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon />
          )}
          <div className="text-sm">
            {row.original.isExpired === false ? "Active" : "Expired"}
          </div>
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Expiration" />
    ),
    cell: ({ row }) => {
      if (!row.getValue("expiresAt"))
        return (
          <div className="font-medium">
            <Inf />
          </div>
        );

      const rawDate = new Date(row.getValue("expiresAt"));

      const day = rawDate.getDate();
      const month = rawDate.toLocaleString("en-US", { month: "short" });
      const year = rawDate.getFullYear();

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
          {getOrdinal(day)} {month}, {year}
        </div>
      );
    },
    sortingFn: (a, b, columnId) => {
      const dateA = a.getValue(columnId) as string | null;
      const dateB = b.getValue(columnId) as string | null;

      // Treat nulls as infinitely far future (or past, depending on desired behavior)
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // put nulls at the bottom when sorting ascending
      if (!dateB) return -1;

      return new Date(dateA).getTime() - new Date(dateB).getTime();
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <HandleTableActions row={row}></HandleTableActions>;
    },
  },
];
