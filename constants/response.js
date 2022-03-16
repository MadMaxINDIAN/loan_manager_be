exports.errors = {
    VALIDATION_ERROR: {
        status: 422,
        message: "Validation failed",
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: "Internal server error",
    },
    NOT_FOUND: {
        status: 404,
        message: "Not found",
    },
    ALREADY_EXISTS: {
        status: 409,
        message: "Already exists",
    },
    UNAUTHORIZED: {
        status: 401,
        message: "Unauthorized",
    },
    FORBIDDEN: {
        status: 403,
        message: "Forbidden",
    },
};