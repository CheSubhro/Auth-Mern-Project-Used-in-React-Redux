
export const handleFetchError = (status) => {

    if (status === 401) {
        return 'Unauthorized access. Please log in again.';
    } else if (status === 404) {
        return 'Resource not found. Please try again later.';
    } else if (status === 500) {
        return 'Internal server error. Please try again later.';
    } else {
        return 'An error occurred. Please try again later.';
    }

};
  
  