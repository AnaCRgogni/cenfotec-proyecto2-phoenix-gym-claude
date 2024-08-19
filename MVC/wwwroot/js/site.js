var API_URL_BASE = "https://localhost:7053/api";
var URL_BASE = "https://localhost:7021";
var apiKeyConversion = "8d7f4460d33c91313dcba3d6"

async function uploadToCloudinary(file) {
    var imageUrl = '';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await $.ajax({
            url: API_URL_BASE + "/CloudinaryUpload/UploadPhoto/upload",
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
        });
        imageUrl = response.url;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error subiendo la imagen.',
            confirmButtonColor: '#ff8000'
        });
        console.error('Error uploading image:', error);
    }

    return imageUrl;
}

async function handlePassword(password) {
    try {
        const response = await $.ajax({
            url: API_URL_BASE + "/Password/ProcessPassword",
            method: 'GET',
            data: { password: password },
        });
        const salt = response[0];
        const hashedPassword = response[1];
        return { salt, hashedPassword };
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error procesando la contraseña.',
            confirmButtonColor: '#ff8000'
        });
        console.error("Error:", error);
        return null;
    }
}

