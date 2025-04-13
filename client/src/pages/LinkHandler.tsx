import { createLinkSchema } from "@/common/schema/createLinkSchema";
import { ApiResponse, tableDataType } from "@/common/types/ApiResponse";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateContext } from "@/hooks/useUpdateContext";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCirclePlusFilled, IconCircleXFilled } from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { CalendarIcon, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

export function LinkEditorButton({
  mode = "create",
  link,
}: {
  mode?: "create" | "edit";
  link?: tableDataType;
}) {
  // alias state to store alias
  const [alias, setAlias] = useState("");

  // aliasMessage state to store the ApiResponse for the alias based on availability
  const [aliasMessage, setAliasMessage] = useState<ApiResponse>({
    success: false,
    message: "",
  });

  // States to block events from happening while checking alias and submitting form
  const [isCheckingAlias, setIsCheckingAlias] = useState(false);

  // To debounce the backend calls to check username availability
  const debounced = useDebounceCallback(setAlias, 500);

  const [openLinkEditor, setOpenLinkEditor] = useState<boolean>(false);
  const { shouldUpdate, setShouldUpdate } = useUpdateContext();
  const [url, setUrl] = useState<string>("");

  const qrRef = useRef<SVGSVGElement>(null);

  const form = useForm<z.infer<typeof createLinkSchema>>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      longUrl: mode === "edit" ? link?.longUrl : "",
      customAlias: mode === "edit" ? link?.shortUrl : undefined,
      expiresAt: mode === "edit" ? link?.expiresAt || undefined : undefined,
    },
  });

  useEffect(() => {
    form.reset();
  }, [openLinkEditor, form]);

  // Checking alias availability with debounced calls
  useEffect(() => {
    const checkUniqueAlias = async () => {
      if (alias) {
        setIsCheckingAlias(true);
        try {
          const res = await axios.post<ApiResponse>(
            `${import.meta.env.VITE_BACKEND_URL}/api/check-custom-alias`,
            {
              id: mode === "edit" ? link?.id : undefined,
              customAlias: alias,
            },
          );
          const data = res.data;

          setAliasMessage(data);
        } catch (err) {
          const axiosError = err as AxiosError<ApiResponse>;
          toast.warning(
            axiosError.response?.data?.message || "Error checking alias",
          );
          setAliasMessage(
            axiosError.response?.data || {
              success: false,
              message: "Error checking alias",
            },
          );
        } finally {
          setIsCheckingAlias(false);
        }
      }
    };
    checkUniqueAlias();
  }, [alias, mode, link?.id]);

  async function onSubmit(values: z.infer<typeof createLinkSchema>) {
    try {
      const res = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/url/${mode === "edit" ? "update" : "create"}`,
        {
          id: mode === "edit" ? link?.id : undefined,
          longUrl: values.longUrl,
          customAlias: values.customAlias,
          expiresAt: values.expiresAt,
        },
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        },
      );
      const data = res.data;
      if (data.success) {
        setUrl(
          `${window.location.protocol}//${window.location.host}/${data.info!.shortUrl!}`,
        );
        toast.success(
          `Link ${mode === "edit" ? "updated" : "created"} successfully`,
        );
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
  }

  const downloadQRCode = () => {
    const svg = qrRef.current;

    if (!svg) {
      toast.warning("QR code SVG element not found");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <AlertDialog onOpenChange={(open) => setOpenLinkEditor(open)}>
      <AlertDialogTrigger>
        {mode === "edit" ? (
          <div className="flex w-full">
            <Button className="w-[115%] font-normal justify-start gap-2 text-black bg-transparent hover:bg-gray-100 px-2 py-1 rounded-sm text-sm">
              Update Link
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              setOpenLinkEditor(!openLinkEditor);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            {!openLinkEditor ? (
              <>
                <IconCirclePlusFilled />
                <span>Quick Create</span>
              </>
            ) : (
              <>
                <IconCircleXFilled />
                <span>Close Editor</span>
              </>
            )}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {!shouldUpdate
              ? mode === "create"
                ? "Quickly create a short link!"
                : "Update the short link!"
              : "Share the link with others"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        {!shouldUpdate ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="longUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://qna.social" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the URL that will be redirected to when the short
                      link is accessed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customAlias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Alias</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="rick-roll"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Debouncing the alias updates
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingAlias ? (
                      <Loader2 className="animate-spin"></Loader2>
                    ) : (
                      <Label
                        className={`font-medium text-sm ${aliasMessage.success === true ? "text-green-600" : "text-red-600"}`}
                      >
                        {aliasMessage.message}
                      </Label>
                    )}
                    <FormDescription>
                      This is the custom alias that will be used for the short
                      link.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Link Expiry</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 top-0 z-50"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the expiry date of the link. It determines when
                      the link will expire and become inactive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <>
                  <Button type="submit">
                    {mode === "edit" ? "Update" : "Create"} Link
                  </Button>
                  <Button
                    type="reset"
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    Reset
                  </Button>
                </>
              </AlertDialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={url}
                  disabled
                  className="input input-bordered w-full bg-blue-100 p-2 rounded-lg rounded-r-none border-1 border-r-0"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                  }}
                  className="rounded-l-none p-5 border-1 border-l-0"
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <QRCodeSVG ref={qrRef} value={url} size={256} />
            </div>
            <div className="flex justify-between w-full">
              <Button onClick={downloadQRCode} variant="outline">
                Download QR Code
              </Button>

              <AlertDialogAction
                onClick={() => {
                  setShouldUpdate(false);
                }}
                className="w-fit justify-end"
              >
                Done
              </AlertDialogAction>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
