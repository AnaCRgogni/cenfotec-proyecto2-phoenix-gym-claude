async function uploadToCloudinary(fileFormData) {
    var imageUrl = '';

    try {
        const response = await $.ajax({
            url: API_URL_BASE + "/CloudinaryUpload/UploadPhoto/upload",
            type: 'POST',
            data: fileFormData,
            processData: false,
            contentType: false,
        });
        imageUrl = response.url;
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    return imageUrl;
}

$(document).ready(function () {
    GetCards();
    const forms = $('.needs-validation');
    $('#formEquipo').submit(async function (event) {
        event.preventDefault(); // Prevent the default form submission
        var isValid = true;
        $(".form-control").removeClass("is-invalid").removeClass("is-valid");

        // Gather form data
        var name = $("#machineName").val().trim();
        var number = parseInt($("#machineNumber").val().trim(), 10);
        var description = $("#description").val().trim();
        var picture = $("#piclink")[0];

        if (name === '') {
            $('#machineName').addClass('is-invalid');
            isValid = false;
        } else {
            $('#machineName').addClass('is-valid');
        }

        if (isNaN(number) || number === 0) {
            $('#machineNumber').addClass('is-invalid');
            isValid = false;
        } else {
            $('#machineNumber').addClass('is-valid');
        }

        if (description === '') {
            $('#description').addClass('is-invalid');
            isValid = false;
        } else {
            $('#description').addClass('is-valid');
        }

        if (picture.files.length === 0) {
            $('#piclink').addClass('is-invalid');
            isValid = false;
        } else {
            $('#piclink').addClass('is-valid');
        }

        if (isValid) {
            var filePic = picture.files[0];
            var formDataProfile = new FormData();
            formDataProfile.append('file', filePic);
            var fileImageUrl = await uploadToCloudinary(formDataProfile);

            // Create the data object
            const data = {
                Id: number,
                Name: name,
                Description: description,
                Picturelink: fileImageUrl
            };

            // Send the data to the API
            createMaquina(data);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Revise las casillas marcadas en rojo.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    });
});

async function GetCards() {
    const maquinas = await fetchMaquinas();
    if (Array.isArray(maquinas)) {
        populateCards(maquinas);
    }
}

async function createMaquina(data) {
    try {
        const response = await fetch(`${API_URL_BASE}/Equipment/CreateMaquina`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 409) {
                Swal.fire({
                    title: 'Error',
                    text: 'Un equipo con este número ya existe.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            Swal.fire({
                title: 'El equipo fue creado con éxito.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            }).then(() => {
                location.reload();
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al crear el equipo.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
}

async function fetchMaquinas() {
    try {
        const response = await fetch(`${API_URL_BASE}/Equipment/GetMaquinas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se encontraron equipos.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response.json();
            return result;
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al obtener los equipos.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
}

function populateCards(maquinas) {
    const container = $('#cards-container');
    container.empty();

    maquinas.forEach(maquina => {
        const cardHTML = `
            <div class="col">
                <div class="card h-100" onclick='CardUpdateMachine(${JSON.stringify(maquina)})'>
                            <div class="card-img-container">
                                <img src="${maquina.picturelink}" class="card-img-top" alt="${maquina.name}">
                            </div>
                    <div class="card-body">
                        <h5 class="card-title">${maquina.name}</h5>
                        <p class="card-text">${maquina.description}</p>
                    </div>
                </div>
            </div>
        `;
        container.append(cardHTML);
    });
}

function CardUpdateMachine(maquina) {
    Swal.fire({
        title: 'Editar información de máquina',
        html: `
            <form id="edit-machine-form">
                <div class="form-group">
                    <label for="machine-name">Nombre</label>
                    <input type="text" id="machine-name" class="form-control" value="${maquina.name}">
                </div>
                <div class="form-group">
                    <label for="machine-description">Descripción</label>
                    <textarea id="machine-description" class="form-control">${maquina.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="machine-picturelink">Nuevo archivo de imagen</label>
                    <input type="file" id="machine-picturelink" class="form-control" accept=".png, .jpeg, .jpg"> 
                </div>
                <div class="form-group">
                    <label>Imagen actual</label>
                    <div class="card-img-container">
                        <img src="${maquina.picturelink}" class="card-img-top" alt="${maquina.name}">
                    </div>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#ff8000',
        denyButtonText: 'Eliminar',
        showDenyButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
            const id = document.getElementById('machine-id').value;
            const name = document.getElementById('machine-name').value;
            const description = document.getElementById('machine-description').value;
            const pictureInput = document.getElementById('machine-picturelink');
            let picturelink = maquina.picturelink;

            if (pictureInput.files && pictureInput.files.length > 0) {
                const file = pictureInput.files[0];
                const fileFormData = new FormData();
                fileFormData.append('file', file);

                // Call the async function to upload the file and get the new picture link
                try {
                    picturelink = await uploadToCloudinary(fileFormData);
                } catch (error) {
                    Swal.showValidationMessage(`Error al subir la imagen`);
                    console.log('Error al subir la imagen:' + error.message);
                }
            }

            // Return the updated machine object
            return {
                Id: id,
                Name: name,
                Description: description,
                Picturelink: picturelink
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updatedMachine = result.value;
            // Handle the updated machine information here, e.g., send it to the server or update the UI
            UpdateMaquina(updatedMachine);
            console.log('Updated Machine:', updatedMachine);
        } else if (result.isDenied) {
            // Handle the deletion of the machine
            Swal.fire({
                title: '¿Estás seguro de que quieres eliminar esta máquina?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                confirmButtonColor: '#ff8000',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    DeleteMaquina(maquina.id);
                    console.log('Machine Deleted:', maquina.id);
                }
            });
        }
    });
}


async function DeleteMaquina(machineId) {
   
    console.log('Deleting machine with ID:', machineId);
    
    try {
        const response = await fetch(`${API_URL_BASE}/Equipment/DeleteMaquina/${machineId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }            
        });

        if (!response.ok) {
            if (response.status === 409) {
                Swal.fire({
                    title: 'Error',
                    text: 'Este equipo no se puede eliminar por que existe en uno o varios ejercicios.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            Swal.fire({
                title: 'Equipo eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            }).then(() => {
                location.reload();
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al eliminar el equipo.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
}

async function UpdateMaquina(data) {
    try {
        const response = await fetch(`${API_URL_BASE}/Equipment/UpdateMaquina`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 409) {
                Swal.fire({
                    title: 'Error',
                    text: 'Un equipo con este número no existe.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            Swal.fire({
                title: 'El equipo fue actualizado con éxito.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            }).then(() => {
                location.reload();
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al actualizar el equipo.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
}
