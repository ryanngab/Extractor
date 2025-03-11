import { getBlogTocs } from "@/lib/markdown";
import TocObserver from "./toc-observer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Book } from "lucide-react";

export default async function Toc({ path }: { path: string }) {
  const tocs = await getBlogTocs(path);

  return (
    <>
      <div className="lg:flex hidden toc flex-[1.5] min-w-[238px] py-9 sticky top-16 h-[96.95vh]">
        <div className="flex flex-col gap-3 w-full pl-2">
          <h3 className="font-semibold text-sm">On this page</h3>
          <ScrollArea className="pb-2 pt-0.5 overflow-y-auto">
            <TocObserver data={tocs} />
          </ScrollArea>
        </div>
      </div>
      <div className="lg:hidden flex fixed top right-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon"><Book/></Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>On this page</SheetTitle>
            </SheetHeader>
            <SheetFooter className="mt-6">
              <ScrollArea className="pb-2 pt-0.5 overflow-y-auto">
                <TocObserver data={tocs} />
              </ScrollArea>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
