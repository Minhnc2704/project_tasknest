"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";
import LeaveDocument from "./LeaveDocument";

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-10">
        <div className="flex max—w—6xl mx—auto justify—between">
          <form
            className="flex flex-1 mx-auto space-x-2 py-2"
            onSubmit={updateTitle}
          >
            {/* Document Title Update */}
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <Button disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>

            {isOwner ? (
              <>
                <InviteUser />
                <DeleteDocument isOwner={isOwner} />
              </>
            ) : (
              <LeaveDocument />
            )}
          </form>
        </div>

        <div className="flex max-w-6xl mx-0 justify-between items-center mb-5">
          <ManageUsers />
          <Avatars />
        </div>

        <hr className="pb-5" />
        <Editor />
      </div>
    </div>
  );
}

export default Document;
