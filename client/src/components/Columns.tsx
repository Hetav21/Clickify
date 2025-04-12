import { tableDataType } from "@/common/types/ApiResponse";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, LoaderIcon, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

function onActionClick(link: tableDataType) {
  navigator.clipboard.writeText(
    `${window.location.protocol}//${window.location.host}/${link.shortUrl}`,
  );
  toast.success("URL copied to clipboard");
}

export const columns: ColumnDef<tableDataType>[] = [
  {
    accessorKey: "shortUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short Url" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.shortUrl}</div>;
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
      const month = rawDate.toLocaleString("en-US", { month: "short" }); // "Apr"
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const link = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onActionClick(link)}>
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Link</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Delete Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
