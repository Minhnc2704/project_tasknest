"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  getDeletedDocuments,
  deleteDocumentPermanently,
  restoreDocument,
} from "@/actions/action";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
}

const RecycleBin = () => {
  const [deletedDocuments, setDeletedDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDeletedDocuments = async () => {
      setIsLoading(true);
      const documents = await getDeletedDocuments();

      const formattedDocuments: Document[] = documents.map((doc) => ({
        id: doc.id,
        title: doc.title || "Untitled Document",
      }));

      setDeletedDocuments(formattedDocuments);
      setIsLoading(false);
    };

    fetchDeletedDocuments();
  }, []);

  const handlePermanentDelete = (documentId: string) => {
    startTransition(async () => {
      const { success } = await deleteDocumentPermanently(documentId);
      if (success) {
        setDeletedDocuments((prev) =>
          prev.filter((doc) => doc.id !== documentId)
        );
        toast.success("Document permanently deleted.");
      } else {
        toast.error("Failed to delete document.");
      }
    });
  };

  const handleRestore = (documentId: string) => {
    startTransition(async () => {
      const { success } = await restoreDocument(documentId);
      if (success) {
        setDeletedDocuments((prev) =>
          prev.filter((doc) => doc.id !== documentId)
        );
        toast.success("Document restored.");
      } else {
        toast.error("Failed to restore document.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="destructive">
        <DialogTrigger>Recycle Bin</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recycle Bin</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Loading...</p>
        ) : deletedDocuments.length === 0 ? (
          <p>No documents in the Recycle Bin.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {deletedDocuments.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md"
              >
                <span>{doc.title}</span>
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleRestore(doc.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Restoring..." : "Restore"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handlePermanentDelete(doc.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete Permanently"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecycleBin;
