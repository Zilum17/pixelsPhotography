// src/utils/getImageUrl.js

const getImageUrl = (productId, imageIndex = 1) => {
    const devBaseUrl = "http://192.168.1.13:8080/pixelsPhoto/images/"; 
    // if (import.meta.env.DEV) {
        return `${devBaseUrl}${productId.toString()}_${imageIndex}.jpg`;
    // }
    // return `/images/${productId.toString()}_${imageIndex}.jpg`;
}

export default getImageUrl;