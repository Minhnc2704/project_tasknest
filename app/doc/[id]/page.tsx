"use client";

import Document from "@/components/Document";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

function DocumentPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return (
    //   <div className="flex flex-col flex-1">
    //     <div className="max-h-screen">
    //       <Document id={id} />
    //     </div>
    //   </div>

    <div className="flex flex-col h-screen">
      <div className="w-full fixed top-0 left-0 right-2z-10 border border-gray-300 rounded-lg shadow-md">
        <Header />
      </div>

      <div className="flex flex-grow pt-16">
        <div className="w-auto fixed top-16 left-1 h-screen">
          <Sidebar />
        </div>

        <div className="flex-grow ml-48 overflow-y-auto h-[calc(100vh-4rem)]">
          <Document id={id} />
        </div>
      </div>
    </div>
  );
}

export default DocumentPage;
