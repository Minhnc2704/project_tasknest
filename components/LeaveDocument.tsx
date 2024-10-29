"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { leaveDocument } from "@/actions/action";
import { useRoom } from "@liveblocks/react/suspense";
import { useRouter } from "next/navigation";

function LeaveDocument() {
  const { user } = useUser();
  const room = useRoom();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLeave = () => {
    startTransition(async () => {
      if (!user) return;

      const { success } = await leaveDocument(
        room.id,
        user.emailAddresses[0].toString()
      );

      if (success) {
        toast.success("You have left the document.");
        setIsOpen(false);
        router.replace("/dashboard");
      } else {
        toast.error("Failed to leave the document.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Leave</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Document</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this document?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLeave}
            disabled={isPending}
          >
            {isPending ? "Leaving..." : "Leave"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveDocument;
