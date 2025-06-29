import mongoose from 'mongoose';

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateUsername = (username) => {
    // 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
};

export const validatePassword = (password) => {
    // At least 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};

export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
};

export const validateMongoId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const validateRole = (role) => {
    return ["farmer", "buyer"].includes(role);
};

export const validateCropsArray = (crops) => {
    if (!Array.isArray(crops)) {
        return false;
    }
    return crops.every(cropId => mongoose.Types.ObjectId.isValid(cropId));
};
