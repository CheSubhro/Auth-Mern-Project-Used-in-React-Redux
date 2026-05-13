
export const handleFetchSuccess = (status) => {

    if (status === 200) {
        return 'Request successful.';
    } else if (status === 201) {
        return 'Resource created successfully.';
    } else if (status === 204) {
        return 'Resource updated successfully.';
    }
    
};