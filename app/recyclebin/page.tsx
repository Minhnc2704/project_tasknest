"use client";

import { useEffect, useState } from "react";
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

function RecycleBin() {
  const [deletedDocuments, setDeletedDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeletedDocuments = async () => {
      setIsLoading(true);
      const documents = await getDeletedDocuments();

      // Ensure each document has an id and a default title if missing
      const formattedDocuments: Document[] = documents.map((doc) => ({
        id: doc.id,
        title: doc.title || "Untitled Document", // Use default title if 'title' is missing
      }));

      setDeletedDocuments(formattedDocuments);
      setIsLoading(false);
    };

    fetchDeletedDocuments();
  }, []);

  const handlePermanentDelete = async (documentId: string) => {
    const { success } = await deleteDocumentPermanently(documentId);
    if (success) {
      setDeletedDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentId)
      );
      toast.success("Document permanently deleted.");
    } else {
      toast.error("Failed to delete document.");
    }
  };

  const handleRestore = async (documentId: string) => {
    const { success } = await restoreDocument(documentId);
    if (success) {
      setDeletedDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentId)
      );
      toast.success("Document restored.");
    } else {
      toast.error("Failed to restore document.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Recycle Bin</h2>
      {deletedDocuments.length === 0 ? (
        <p>No documents in the Recycle Bin.</p>
      ) : (
        <ul className="space-y-4">
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
                >
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handlePermanentDelete(doc.id)}
                >
                  Delete Permanently
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecycleBin;
