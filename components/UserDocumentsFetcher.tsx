// import { useCollection } from "react-firebase-hooks/firestore";
// import {
//   collectionGroup,
//   query,
//   where,
//   DocumentData,
// } from "firebase/firestore";
// import { useUser } from "@clerk/nextjs";
// import { db } from "@/firebase";
// import { useEffect } from "react";

// export interface RoomDocument extends DocumentData {
//   createdAt: string;
//   role: "owner" | "editor";
//   roomId: string;
//   userId: string;
// }

// interface UserDocumentsFetcherProps {
//   onDocumentsFetched: (groupedData: {
//     owner: RoomDocument[];
//     editor: RoomDocument[];
//   }) => void;
// }

// const UserDocumentsFetcher: React.FC<UserDocumentsFetcherProps> = ({
//   onDocumentsFetched,
// }) => {
//   const { user } = useUser();

//   const [data, loading, error] = useCollection(
//     user &&
//       query(
//         collectionGroup(db, "rooms"),
//         where("userId", "==", user.emailAddresses[0].toString())
//       )
//   );

//   useEffect(() => {
//     if (!data) return;

//     const grouped = data.docs.reduce<{
//       owner: RoomDocument[];
//       editor: RoomDocument[];
//     }>(
//       (acc, curr) => {
//         const roomData = curr.data() as RoomDocument;

//         if (roomData.role === "owner") {
//           acc.owner.push(roomData);
//         } else {
//           acc.editor.push(roomData);
//         }

//         return acc;
//       },
//       {
//         owner: [],
//         editor: [],
//       }
//     );

//     onDocumentsFetched(grouped);
//   }, [data, onDocumentsFetched]);

//   if (loading) return <p>Loading documents...</p>;
//   if (error) return <p>Error loading documents: {error.message}</p>;

//   return null; // Component không cần phải render nội dung, chỉ cần fetch dữ liệu
// };

// export default UserDocumentsFetcher;

import { useCollection } from "react-firebase-hooks/firestore";
import {
  collectionGroup,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { useEffect } from "react";

export interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
  isDeleted?: boolean; // Add a flag for deleted documents
}

interface UserDocumentsFetcherProps {
  onDocumentsFetched: (groupedData: {
    owner: RoomDocument[];
    editor: RoomDocument[];
    recycleBin: RoomDocument[];
  }) => void;
}

const UserDocumentsFetcher: React.FC<UserDocumentsFetcherProps> = ({
  onDocumentsFetched,
}) => {
  const { user } = useUser();

  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
      recycleBin: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;

        if (roomData.isDeleted) {
          // If the document is marked as deleted, add it to recycleBin
          acc.recycleBin.push(roomData);
        } else if (roomData.role === "owner") {
          acc.owner.push(roomData);
        } else {
          acc.editor.push(roomData);
        }

        return acc;
      },
      {
        owner: [],
        editor: [],
        recycleBin: [], // Initialize recycleBin
      }
    );

    onDocumentsFetched(grouped);
  }, [data, onDocumentsFetched]);

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>Error loading documents: {error.message}</p>;

  return null; // Component doesn't need to render content, only fetch data
};

export default UserDocumentsFetcher;
