// "use client";

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useState, useTransition } from "react";
// import { Button } from "./ui/button";
// import { usePathname, useRouter } from "next/navigation";
// import { deleteDocument } from "@/actions/action";
// import { toast } from "sonner";

// function DeleteDocument() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleDelete = async () => {
//     const roomId = pathname.split("/").pop();

//     if (!roomId) return;

//     startTransition(async () => {
//       const { success } = await deleteDocument(roomId);

//       if (success) {
//         setIsOpen(false);
//         router.replace("/dashboard");
//         toast.success("Delete successfully.");
//       } else {
//         toast.error("Failed to delete.");
//       }
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <Button asChild variant="destructive">
//         <DialogTrigger>Delete</DialogTrigger>
//       </Button>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Do you really want to delete ?</DialogTitle>
//           <DialogDescription>
//             This action cannot be undone. This will permanently delete its
//             contents and remove all the users from the document.
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter className="sm: justify—end gap—2">
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={isPending}
//           >
//             {isPending ? "Deleting..." : "Delete"}
//           </Button>
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default DeleteDocument;

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
import { usePathname, useRouter } from "next/navigation";
import { moveDocumentToRecycleBin } from "@/actions/action"; // Ensure this function exists
import { toast } from "sonner";

// Define props type
interface DeleteDocumentProps {
  isOwner: boolean; // Explicitly define the type for isOwner
}

function DeleteDocument({ isOwner }: DeleteDocumentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    const documentId = pathname.split("/").pop();

    if (!documentId || !isOwner) return; // Ensure the user is the owner

    startTransition(async () => {
      const { success } = await moveDocumentToRecycleBin(documentId);

      if (success) {
        setIsOpen(false);
        router.replace("/dashboard");
        toast.success("Document moved to Recycle Bin successfully.");
      } else {
        toast.error("Failed to move document to Recycle Bin.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="destructive">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you really want to delete?</DialogTitle>
          <DialogDescription>
            This action will move the document to the Recycle Bin. Only you will
            have access to it until it is restored.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Moving..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDocument;
