"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idConverter =
    exports.classDataConverter =
    exports.testDataConverter =
    exports.parentDataConverter =
    exports.teacherClassDataConverter =
    exports.teacherDataConverter =
    exports.stuTestDataConverter =
    exports.stuClassDataConverter =
    exports.stuDataConverter =
    exports.userDataConverter =
        void 0;
exports.userDataConverter = {
    toFirestore(userData) {
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
    fromFirestore(snapshot, options) {
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
exports.stuDataConverter = {
    toFirestore(stuData) {
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
    fromFirestore(snapshot, options) {
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
exports.stuClassDataConverter = {
    toFirestore(stuClassData) {
        return {
            class_name: stuClassData.class_name,
            rate: stuClassData.rate,
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            class_name: data.class_name,
            rate: data.rate,
        };
    },
};
exports.stuTestDataConverter = {
    toFirestore(stuTestData) {
        return {
            test_name: stuTestData.test_name,
            score: stuTestData.score,
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            test_name: data.test_name,
            score: data.score,
        };
    },
};
exports.teacherDataConverter = {
    toFirestore(teacherData) {
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
    fromFirestore(snapshot, options) {
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
exports.teacherClassDataConverter = {
    toFirestore(teacherClassData) {
        return {
            class_name: teacherClassData.class_name,
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            class_name: data.class_name,
        };
    },
};
exports.parentDataConverter = {
    toFirestore(parentData) {
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
    fromFirestore(snapshot, options) {
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
exports.testDataConverter = {
    toFirestore(testData) {
        return {
            test_name: testData.test_name,
            class_name: testData.class_name,
            max_score: testData.max_score,
            min_score: testData.min_score,
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            test_name: data.test_name,
            class_name: data.class_name,
            max_score: data.max_score,
            min_score: data.min_score,
        };
    },
};
exports.classDataConverter = {
    toFirestore(classData) {
        return {
            class_name: classData.class_name,
            students: classData.students,
            teachers: classData.teachers,
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            class_name: data.class_name,
            students: data.students,
            teachers: data.teachers,
        };
    },
};
exports.idConverter = {
    toFirestore(id) {
        return {
            uid: id.uid,
            password: id.password,
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            uid: data.uid,
            password: data.password,
        };
    },
};
