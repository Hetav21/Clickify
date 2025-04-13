import { ApiResponse, tableDataType } from "@/common/types/ApiResponse";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateContext } from "@/hooks/useUpdateContext";
import { LinkEditorButton } from "@/pages/LinkHandler";
import { CoreRow } from "@tanstack/react-table";
import axios from "axios";
import Cookies from "js-cookie";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

function onActionClick(link: tableDataType) {
  navigator.clipboard.writeText(
    `${window.location.protocol}//${window.location.host}/${link.shortUrl}`,
  );
  toast.success("URL copied to clipboard");
}

export function HandleTableActions({ row }: { row: CoreRow<tableDataType> }) {
  const link = row.original;

  const { setShouldUpdate } = useUpdateContext();

  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/url/delete`,
        {
          id: link?.id,
        },
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        },
      );
      const data = res.data;

      if (data.success) {
        toast.success(`Link deleted successfully`);
        setShouldUpdate(true);
      } else {
        toast.error("Link creation failed", {
          description: data.message,
        });
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.warning("An error occurred", {
          description: e.response?.data?.message || e.message,
        });
      } else if (e instanceof Error) {
        toast.warning("An error occurred", { description: e.message });
      } else {
        toast.warning("An unknown error occurred");
      }
    }
  };

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
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `${window.location.origin}/dashboard/${link.id}`,
              "_blank",
            )
          }
        >
          Detail View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex flex-col">
          <div className="flex w-full">
            <LinkEditorButton mode="edit" link={link} />
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="w-full font-normal justify-start gap-2 text-red-500 bg-transparent hover:bg-red-100 px-2 py-1 rounded-sm text-sm">
                Delete Link
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
