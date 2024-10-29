"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function createNewDocument() {
  auth().protect();

  const { sessionClaims } = await auth();

  const doCollectionRef = adminDb.collection("documents");
  const docRef = await doCollectionRef.add({
    title: "New Doc",
    isDeleted: false,
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function createNewDocumentWithTitle(title: string) {
  auth().protect();

  const { sessionClaims } = await auth();

  const doCollectionRef = adminDb.collection("documents");
  const docRef = await doCollectionRef.add({
    title: title || "New Doc",
    isDeleted: false,
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  auth().protect();

  console.log("deleteDocument", roomId);

  try {
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUser(roomId: string, email: string) {
  auth().protect();

  console.log("inviteUser", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUser(roomId: string, email: string) {
  auth().protect();

  console.log("removeUser", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function leaveDocument(roomId: string, email: string) {
  auth().protect();

  console.log("leaveDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getDeletedDocuments() {
  auth().protect();

  try {
    const { sessionClaims } = await auth(); // Lấy thông tin người dùng

    // Truy vấn các tài liệu đã xóa
    const deletedDocsSnapshot = await adminDb
      .collection("documents")
      .where("isDeleted", "==", true) // Lấy các tài liệu đã xóa
      .get();

    // Lọc các tài liệu mà người dùng sở hữu
    const deletedDocuments = await Promise.all(
      deletedDocsSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Kiểm tra xem người dùng có phải là owner của tài liệu không
        const userRoomRef = await adminDb
          .collection("users")
          .doc(sessionClaims!.email)
          .collection("rooms")
          .doc(doc.id)
          .get();

        if (userRoomRef.exists && userRoomRef.data()?.role === "owner") {
          return {
            id: doc.id,
            title: data.title || "Untitled Document", // Đảm bảo tiêu đề tồn tại hoặc cung cấp giá trị mặc định
            ...data,
          };
        }
        return null; // Nếu không phải là owner thì trả về null
      })
    );

    // Lọc các tài liệu không phải là null
    return deletedDocuments.filter((doc) => doc !== null);
  } catch (error) {
    console.error("Error retrieving deleted documents:", error);
    return [];
  }
}

export async function deleteDocumentPermanently(documentId: string) {
  auth().protect();

  try {
    // Delete document from the main collection
    await adminDb.collection("documents").doc(documentId).delete();

    // Delete all references to the document from user collections
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", documentId)
      .get();

    const batch = adminDb.batch();
    query.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
    console.log("Document permanently deleted:", documentId);

    return { success: true };
  } catch (error) {
    console.error("Error permanently deleting document:", error);
    return { success: false };
  }
}

export async function restoreDocument(documentId: string) {
  auth().protect();

  try {
    // Update the document's isDeleted field to restore it
    await adminDb.collection("documents").doc(documentId).update({
      isDeleted: false,
      restoredAt: new Date(),
    });
    console.log("Document restored:", documentId);

    return { success: true };
  } catch (error) {
    console.error("Error restoring document:", error);
    return { success: false };
  }
}

export async function moveDocumentToRecycleBin(documentId: string) {
  try {
    // Lấy email của người dùng từ sessionClaims
    const { sessionClaims } = await auth();

    // Cập nhật trường isDeleted trong collection documents
    await adminDb.collection("documents").doc(documentId).update({
      isDeleted: true,
    });

    // Cập nhật trường isDeleted trong collection rooms
    await adminDb
      .collection("users")
      .doc(sessionClaims?.email!)
      .collection("rooms")
      .doc(documentId)
      .update({
        isDeleted: true,
      });

    return { success: true };
  } catch (error) {
    console.error("Error moving document to Recycle Bin:", error);
    return { success: false };
  }
}
