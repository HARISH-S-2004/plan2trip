import { db } from "./firebase";
import { supabase } from "./supabase";
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    writeBatch,
    getDocs,
    query,
    type Unsubscribe,
} from "firebase/firestore";

// ─── Collection Names ───────────────────────────────────────────────
export const COLLECTIONS = {
    packages: "packages",
    hotels: "hotels",
    villas: "villas",
    ads: "ads",
    bookings: "bookings",
    testimonials: "testimonials",
    users: "users",
    payments: "payments",
    categories: "categories",
    // Single-document collections
    footer: "config",       // doc id = "footer"
    settings: "config",     // doc id = "settings"
} as const;

// ─── Generic Firestore helpers ──────────────────────────────────────

/** Write / overwrite a document (merge-safe) */
export async function upsertDoc(collectionName: string, docId: string, data: any) {
    await setDoc(doc(db, collectionName, docId), data);
}

/** Delete a document */
export async function removeDoc(collectionName: string, docId: string) {
    await deleteDoc(doc(db, collectionName, docId));
}

/** Subscribe to a collection's real-time changes */
export function subscribeCollection<T>(
    collectionName: string,
    onChange: (items: T[]) => void,
): Unsubscribe {
    const q = query(collection(db, collectionName));
    return onSnapshot(q, (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((doc) => {
            items.push({ ...doc.data(), id: doc.id } as T);
        });
        onChange(items);
    }, (error) => {
        console.error(`Firestore subscription error for ${collectionName}:`, error);
    });
}

/** Subscribe to a single document */
export function subscribeDoc<T>(
    collectionName: string,
    docId: string,
    onChange: (data: T | null) => void,
): Unsubscribe {
    return onSnapshot(doc(db, collectionName, docId), (snapshot) => {
        if (snapshot.exists()) {
            onChange(snapshot.data() as T);
        } else {
            onChange(null);
        }
    }, (error) => {
        console.error(`Firestore doc subscription error for ${collectionName}/${docId}:`, error);
    });
}

// ─── Batch seed helper ──────────────────────────────────────────────

/** Seed a collection ONLY if it's empty (first-time setup) */
export async function seedCollectionIfEmpty(collectionName: string, items: any[]) {
    const snap = await getDocs(collection(db, collectionName));
    if (snap.empty) {
        const batch = writeBatch(db);
        for (const item of items) {
            const docRef = doc(db, collectionName, item.id);
            batch.set(docRef, item);
        }
        await batch.commit();
        console.log(`Seeded ${collectionName} with ${items.length} documents`);
    }
}

/** Seed a single config document if it doesn't exist */
export async function seedDocIfEmpty(collectionName: string, docId: string, data: any) {
    const snap = await getDocs(collection(db, collectionName));
    const exists = snap.docs.some((d) => d.id === docId);
    if (!exists) {
        await setDoc(doc(db, collectionName, docId), data);
        console.log(`Seeded ${collectionName}/${docId}`);
    }
}

// ─── Supabase Storage helpers (Replacing Firebase Storage) ──────────

/**
 * Upload a file to Supabase Storage.
 * Returns the public download URL.
 */
export async function uploadImage(
    file: File,
    folder: string,
): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

    return publicUrl;
}

/**
 * Delete an image from Storage.
 */
export async function deleteImage(imageUrl: string) {
    // Check if it's a Supabase URL
    if (!imageUrl || !imageUrl.includes("supabase.co")) return;

    try {
        // Extract the file path from the URL
        // Example: https://.../storage/v1/object/public/uploads/folder/filename.jpg
        const parts = imageUrl.split("/uploads/");
        if (parts.length < 2) return;
        const filePath = parts[1];

        const { error } = await supabase.storage
            .from("uploads")
            .remove([filePath]);

        if (error) throw error;
        console.log("Deleted old image from Supabase:", filePath);
    } catch (error: any) {
        console.warn("Could not delete image:", error.message);
    }
}

/**
 * Upload a new image and delete the old one (if it was in Firebase Storage).
 * Returns the new image URL.
 */
export async function replaceImage(
    file: File,
    folder: string,
    oldImageUrl?: string,
): Promise<string> {
    // Upload new image first
    const newUrl = await uploadImage(file, folder);
    // Then try to clean up old one
    if (oldImageUrl) {
        await deleteImage(oldImageUrl);
    }
    return newUrl;
}
