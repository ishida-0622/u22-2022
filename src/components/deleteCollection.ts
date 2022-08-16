import {
    Firestore,
    collection,
    query,
    orderBy,
    limit,
    Query,
    getDocs,
    writeBatch,
} from "firebase/firestore";

const deleteCollection = async (
    db: Firestore,
    collectionPath: string,
    batchSize: number = 500
) => {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, orderBy("__name__"), limit(batchSize));

    return await deleteQueryBatch(db, q);
};

const deleteQueryBatch = async (db: Firestore, query: Query): Promise<void> => {
    const snapshot = await getDocs(query);

    if (snapshot.size === 0) {
        return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    deleteQueryBatch(db, query);
};

export default deleteCollection;
