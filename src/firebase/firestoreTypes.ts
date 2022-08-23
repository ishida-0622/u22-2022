import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
} from "firebase/firestore";

export type userType = "student" | "teacher" | "parent";

export type userData = {
    id: string;
    type: userType;
    mail: string;
    tel: string;
    first_name: string;
    last_name: string;
    first_name_kana: string;
    last_name_kana: string;
    sex: "0" | "1" | "2" | "9";
    birth_date: string;
    children_id?: string[];
};

export const userDataConverter: FirestoreDataConverter<userData> = {
    toFirestore(userData: userData): DocumentData {
        return {
            id: userData.id,
            type: userData.type,
            mail: userData.mail,
            tel: userData.tel,
            first_name: userData.first_name,
            last_name: userData.last_name,
            first_name_kana: userData.first_name_kana,
            last_name_kana: userData.last_name_kana,
            sex: userData.sex,
            birth_date: userData.birth_date,
            children_id: userData.children_id,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): userData {
        const data = snapshot.data(options);
        return {
            id: data.id,
            type: data.type,
            mail: data.mail,
            tel: data.tel,
            first_name: data.first_name,
            last_name: data.last_name,
            first_name_kana: data.first_name_kana,
            last_name_kana: data.last_name_kana,
            sex: data.sex,
            birth_date: data.birth_date,
            children_id: data.children_id,
        };
    },
};

export type stuData = {
    id: string;
    type: userType;
    mail: string;
    tel: string;
    first_name: string;
    last_name: string;
    first_name_kana: string;
    last_name_kana: string;
    sex: "0" | "1" | "2" | "9";
    birth_date: string;
};

export const stuDataConverter: FirestoreDataConverter<stuData> = {
    toFirestore(stuData: stuData): DocumentData {
        return {
            id: stuData.id,
            type: stuData.type,
            mail: stuData.mail,
            tel: stuData.tel,
            first_name: stuData.first_name,
            last_name: stuData.last_name,
            first_name_kana: stuData.first_name_kana,
            last_name_kana: stuData.last_name_kana,
            sex: stuData.sex,
            birth_date: stuData.birth_date,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): stuData {
        const data = snapshot.data(options);
        return {
            id: data.id,
            type: data.type,
            mail: data.mail,
            tel: data.tel,
            first_name: data.first_name,
            last_name: data.last_name,
            first_name_kana: data.first_name_kana,
            last_name_kana: data.last_name_kana,
            sex: data.sex,
            birth_date: data.birth_date,
        };
    },
};

export type rateType = {
    date: string;
    score: number;
    test_name: string;
};

export type stuClassData = {
    class_name: string;
    rate: rateType[];
};

export const stuClassDataConverter: FirestoreDataConverter<stuClassData> = {
    toFirestore(stuClassData: stuClassData): DocumentData {
        return {
            class_name: stuClassData.class_name,
            rate: stuClassData.rate,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): stuClassData {
        const data = snapshot.data(options);
        return {
            class_name: data.class_name,
            rate: data.rate,
        };
    },
};

export type stuTestData = {
    test_name: string;
    score: number;
};

export const stuTestDataConverter: FirestoreDataConverter<stuTestData> = {
    toFirestore(stuTestData: stuTestData): DocumentData {
        return {
            test_name: stuTestData.test_name,
            score: stuTestData.score,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): stuTestData {
        const data = snapshot.data(options);
        return {
            test_name: data.test_name,
            score: data.score,
        };
    },
};

export type teacherData = {
    id: string;
    type: userType;
    mail: string;
    tel: string;
    first_name: string;
    last_name: string;
    first_name_kana: string;
    last_name_kana: string;
    sex: "0" | "1" | "2" | "9";
    birth_date: string;
};

export const teacherDataConverter: FirestoreDataConverter<teacherData> = {
    toFirestore(teacherData: teacherData): DocumentData {
        return {
            id: teacherData.id,
            type: teacherData.type,
            mail: teacherData.mail,
            tel: teacherData.tel,
            first_name: teacherData.first_name,
            last_name: teacherData.last_name,
            first_name_kana: teacherData.first_name_kana,
            last_name_kana: teacherData.last_name_kana,
            sex: teacherData.sex,
            birth_date: teacherData.birth_date,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): teacherData {
        const data = snapshot.data(options);
        return {
            id: data.id,
            type: data.type,
            mail: data.mail,
            tel: data.tel,
            first_name: data.first_name,
            last_name: data.last_name,
            first_name_kana: data.first_name_kana,
            last_name_kana: data.last_name_kana,
            sex: data.sex,
            birth_date: data.birth_date,
        };
    },
};

export type teacherClassData = {
    class_name: string;
};

export const teacherClassDataConverter: FirestoreDataConverter<teacherClassData> =
    {
        toFirestore(teacherClassData: teacherClassData): DocumentData {
            return {
                class_name: teacherClassData.class_name,
            };
        },

        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options: SnapshotOptions
        ): teacherClassData {
            const data = snapshot.data(options);
            return {
                class_name: data.class_name,
            };
        },
    };

export type parentData = {
    id: string;
    type: userType;
    mail: string;
    tel: string;
    first_name: string;
    last_name: string;
    first_name_kana: string;
    last_name_kana: string;
    sex: "0" | "1" | "2" | "9";
    birth_date: string;
    children_id: string[];
};

export const parentDataConverter: FirestoreDataConverter<parentData> = {
    toFirestore(parentData: parentData): DocumentData {
        return {
            id: parentData.id,
            type: parentData.type,
            mail: parentData.mail,
            tel: parentData.tel,
            first_name: parentData.first_name,
            last_name: parentData.last_name,
            first_name_kana: parentData.first_name_kana,
            last_name_kana: parentData.last_name_kana,
            sex: parentData.sex,
            birth_date: parentData.birth_date,
            children_id: parentData.children_id,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): parentData {
        const data = snapshot.data(options);
        return {
            id: data.id,
            type: data.type,
            mail: data.mail,
            tel: data.tel,
            first_name: data.first_name,
            last_name: data.last_name,
            first_name_kana: data.first_name_kana,
            last_name_kana: data.last_name_kana,
            sex: data.sex,
            birth_date: data.birth_date,
            children_id: data.children_id,
        };
    },
};

export type testData = {
    test_name: string;
    class_name: string;
    date: string;
    test_overview: string;
    max_score: number;
    min_score: number;
};

export const testDataConverter: FirestoreDataConverter<testData> = {
    toFirestore(testData: testData): DocumentData {
        return {
            test_name: testData.test_name,
            class_name: testData.class_name,
            date: testData.date,
            test_overview: testData.test_overview,
            max_score: testData.max_score,
            min_score: testData.min_score,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): testData {
        const data = snapshot.data(options);
        return {
            test_name: data.test_name,
            class_name: data.class_name,
            date: data.date,
            test_overview: data.test_overview,
            max_score: data.max_score,
            min_score: data.min_score,
        };
    },
};

export type classData = {
    class_name: string;
    students: string[];
    teachers: string[];
};

export const classDataConverter: FirestoreDataConverter<classData> = {
    toFirestore(classData: classData): DocumentData {
        return {
            class_name: classData.class_name,
            students: classData.students,
            teachers: classData.teachers,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): classData {
        const data = snapshot.data(options);
        return {
            class_name: data.class_name,
            students: data.students,
            teachers: data.teachers,
        };
    },
};

export type id = {
    uid: string;
};

export const idConverter: FirestoreDataConverter<id> = {
    toFirestore(id: id): DocumentData {
        return {
            uid: id.uid,
        };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): id {
        const data = snapshot.data(options);
        return {
            uid: data.uid,
        };
    },
};
