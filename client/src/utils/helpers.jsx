
export const capitalizeString = (str) => {

    return str.charAt(0).toUpperCase() + str.slice(1);

};
  
export const truncateText = (text, maxLength) => {
    
    if (text.length > maxLength) {
      
        return text.substring(0, maxLength) + '...';
    }
    
    return text;
    
};