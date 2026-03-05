import { db, storage } from "./firebase";
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
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

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

// ─── Firebase Storage helpers (with old-image cleanup) ──────────────

/**
 * Upload a file to Firebase Storage.
 * Returns the public download URL.
 */
export async function uploadImage(
    file: File,
    folder: string,
): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = `${folder}/${fileName}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}

/**
 * Delete an image from Firebase Storage by its download URL.
 * Silently ignores errors (e.g., file already deleted, or it's a local /images/ path).
 */
export async function deleteImage(imageUrl: string) {
    // Only delete if it's a Firebase Storage URL
    if (!imageUrl || !imageUrl.includes("firebasestorage")) return;
    try {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
        console.log("Deleted old image:", imageUrl);
    } catch (error: any) {
        // Ignore "object-not-found" — it was already deleted
        if (error?.code !== "storage/object-not-found") {
            console.warn("Could not delete old image:", error.message);
        }
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
