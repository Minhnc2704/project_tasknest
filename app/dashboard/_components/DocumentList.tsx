"use client";

import React, { useState } from "react";
import DocumentItemList from "./DocumentItemList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import UserDocumentsFetcher, {
  RoomDocument,
} from "@/components/UserDocumentsFetcher";

const DocumentList: React.FC = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  return (
    <div className="my-10 p-10 md:px-24 lg:px-36 xl:px-52">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Hello, {user?.fullName}</h2>
        <Link href={"/createdocument"}>
          <Button>+</Button>
        </Link>
      </div>

      {/* Fetch documents using UserDocumentsFetcher */}
      <UserDocumentsFetcher onDocumentsFetched={setGroupedData} />

      {groupedData.owner.length === 0 && groupedData.editor.length === 0 ? (
        <div className="flex flex-col justify-center items-center my-10">
          <Image
            src={"/workspace.png"}
            width={200}
            height={200}
            alt="workspace"
          />

          <h2>Create a new document</h2>

          <Link href={"/createdocument"}>
            <Button className="my-3">+ New Document</Button>
          </Link>
        </div>
      ) : (
        <div>
          {/* Hiển thị các tài liệu mà người dùng sở hữu */}
          <DocumentItemList
            documents={groupedData.owner}
            title="My Documents"
          />

          {/* Hiển thị các tài liệu được chia sẻ với người dùng */}
          <DocumentItemList
            documents={groupedData.editor}
            title="Shared with me"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentList;
