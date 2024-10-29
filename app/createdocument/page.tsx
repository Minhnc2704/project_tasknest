"use client";

import { createNewDocumentWithTitle } from "@/actions/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function CreateDocument() {
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const onCreateDocument = async () => {
    setLoading(true);
    try {
      const { docId } = await createNewDocumentWithTitle(documentName);
      setLoading(false);
      router.replace("/doc/" + docId);
      console.log("Document created with ID:", docId);
    } catch (error) {
      console.error("Error creating document:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:px-36 lg:px-64 xl:px-96 py-28">
      <div className="shadow-2xl rounded-xl p-12">
        <h2 className="font-medium text-xl">Create a new document</h2>
        <h2 className="text-sm mt-2">
          This is where you can create and manage your documents.
        </h2>
        <div className="mt-8">
          <Input
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
        </div>
        <div className="mt-7 flex justify-end gap-6">
          <Button
            disabled={!documentName.length || loading}
            onClick={onCreateDocument}
          >
            Create {loading && <Loader2Icon className="animate-spin ml-2" />}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateDocument;
