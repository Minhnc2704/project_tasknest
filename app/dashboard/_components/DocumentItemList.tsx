"use client";

import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore"; // Đảm bảo rằng bạn đã nhập đúng
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RoomDocument {
  roomId: string;
}

interface DocumentItemListProps {
  documents: RoomDocument[];
  title: string;
}

const DocumentItemList: React.FC<DocumentItemListProps> = ({
  documents,
  title,
}) => {
  const router = useRouter();

  const handleDocumentClick = (id: string) => {
    router.push(`/doc/${id}`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {documents.length > 0 ? (
          documents.map((docData) => {
            // Sử dụng useDocumentData để lấy dữ liệu tài liệu
            const [data, loading, error] = useDocumentData(
              doc(db, "documents", docData.roomId)
            ); // Đảm bảo gọi đúng hàm doc

            // Hiển thị loading khi đang tải dữ liệu
            if (loading)
              return (
                <div key={docData.roomId}>
                  <LoadingSpinner />
                </div>
              );
            if (error)
              return (
                <div key={docData.roomId}>
                  Error loading document: {error.message}
                </div>
              );

            return (
              <div
                key={docData.roomId}
                className="border shadow-xl rounded-xl p-4 cursor-pointer hover:scale-105 transition-all"
                onClick={() => handleDocumentClick(docData.roomId)}
              >
                <div className="p-4 rounded-b-lg">
                  {/* Hiển thị tiêu đề của tài liệu từ data */}
                  <h3 className="flex gap-2 justify-center font-semibold">
                    {data?.title || "Untitled Document"}{" "}
                    {/* Hiển thị title nếu có */}
                  </h3>
                </div>
              </div>
            );
          })
        ) : (
          <p>No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentItemList;
