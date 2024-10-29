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
    const deletedDocsSnapshot = await adminDb
      .collection("documents")
      .where("isDeleted", "==", true) // assuming a field "isDeleted" marks documents in Recycle Bin
      .get();

    const deletedDocuments = deletedDocsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Untitled Document", // Ensure title exists or provide a fallback
        ...data,
      };
    });

    return deletedDocuments;
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
    await adminDb.collection("documents").doc(documentId).update({
      isDeleted: true, // Mark the document as deleted
      // Add any other fields you need to manage access control
    });

    return { success: true };
  } catch (error) {
    console.error("Error moving document to Recycle Bin:", error);
    return { success: false };
  }
}
