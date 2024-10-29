// import { useState } from "react";
// import UserDocumentsFetcher, { RoomDocument } from "./UserDocumentsFetcher";
// import NewDocumentButton from "./NewDocumentButton";
// import SidebarOption from "./SidebarOption";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { MenuIcon } from "lucide-react";

// const Sidebar: React.FC = () => {
//   const [groupedData, setGroupedData] = useState<{
//     owner: RoomDocument[];
//     editor: RoomDocument[];
//   }>({
//     owner: [],
//     editor: [],
//   });

//   const menuOption = (
//     <>
//       <NewDocumentButton />

//       <div className="flex py-4 flex-col space-y-4 md:max-w-36">
//         {/* My Documents */}
//         {groupedData.owner.length === 0 ? (
//           <h2 className="text-gray-500 font-semibold text-sm">
//             No documents found
//           </h2>
//         ) : (
//           <>
//             <h2 className="text-gray-500 font-semibold text-sm">
//               My Documents
//             </h2>
//             {groupedData.owner.map((doc) => (
//               <SidebarOption
//                 key={doc.roomId}
//                 id={doc.roomId}
//                 href={`/doc/${doc.roomId}`}
//               />
//             ))}
//           </>
//         )}

//         {/* Shared with me */}
//         <h2 className="text-gray-500 font-semibold text-sm">Shared with me</h2>
//         {groupedData.editor.length > 0 ? (
//           groupedData.editor.map((doc) => (
//             <SidebarOption
//               key={doc.roomId}
//               id={doc.roomId}
//               href={`/doc/${doc.roomId}`}
//             />
//           ))
//         ) : (
//           <p className="text-gray-400 text-sm">No shared documents found</p>
//         )}
//       </div>
//     </>
//   );

//   return (
//     <div className="p-2 md:p-5 bg-gray-200 relative border border-gray-300 rounded-lg shadow-md">
//       <UserDocumentsFetcher onDocumentsFetched={setGroupedData} />

//       <div className="md:hidden">
//         <Sheet>
//           <SheetTrigger>
//             <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
//           </SheetTrigger>
//           <SheetContent side="left">
//             <SheetHeader>
//               <SheetTitle>Menu</SheetTitle>
//               <div>{menuOption}</div>
//             </SheetHeader>
//           </SheetContent>
//         </Sheet>
//       </div>
//       <div className="hidden md:inline">{menuOption}</div>
//     </div>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import UserDocumentsFetcher, { RoomDocument } from "./UserDocumentsFetcher";
import NewDocumentButton from "./NewDocumentButton";
import SidebarOption from "./SidebarOption";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import RecycleBin from "./RecycleBin";

const Sidebar: React.FC = () => {
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
    recycleBin: RoomDocument[]; // Ensure recycleBin is initialized here
  }>({
    owner: [],
    editor: [],
    recycleBin: [], // Initialize recycleBin as an empty array
  });

  const menuOption = (
    <>
      <NewDocumentButton />

      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {/* My Documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOption
                key={doc.roomId}
                id={doc.roomId}
                href={`/doc/${doc.roomId}`}
              />
            ))}
          </>
        )}

        {/* Shared with me */}
        <h2 className="text-gray-500 font-semibold text-sm">Shared with me</h2>
        {groupedData.editor.length > 0 ? (
          groupedData.editor.map((doc) => (
            <SidebarOption
              key={doc.roomId}
              id={doc.roomId}
              href={`/doc/${doc.roomId}`}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No shared documents found</p>
        )}

        {/* Recycle Bin */}
        <RecycleBin />
      </div>
    </>
  );

  return (
    <div className="p-2 md:p-5 bg-gray-200 relative border border-gray-300 rounded-lg shadow-md">
      <UserDocumentsFetcher onDocumentsFetched={setGroupedData} />

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOption}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:inline">{menuOption}</div>
    </div>
  );
};

export default Sidebar;
