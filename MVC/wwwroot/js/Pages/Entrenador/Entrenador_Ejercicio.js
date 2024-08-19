var isValid = true;

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
        Swal.fire({
            title: 'Error',
            text: 'No se pudo subir la imagen.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' 
        });
    }

    return imageUrl;
}

$(document).ready(function () {

    populateSelectList(); // AQUI popula la lista de maquinas para seleccionar una

    GetCards();

    const forms = $('.needs-validation'); // Llamo a todo lo que tenga la clase needs-validation

    const form = document.getElementById('exerciseForm');

    $('#exerciseForm').submit(async function (event) {
        event.preventDefault(); // Prevent the default form submission

        $(".form-control").removeClass("is-invalid");

        // Gather form data
        var name = $("#exercise-name").val().trim();
        var description = $("#exercise-description").val().trim();
        var MaquinaID = $("#machine-name").val().trim();
        var picture = $("#exercise-image")[0];

        if (validateText(name, '#exercise-name')) {
            isValid = true;
        } else {
            isValid = false;
        }

        if (validateText(description, '#exercise-description')) {
            isValid = true;
        } else {
            isValid = false;
        }

        if (picture.files.length === 0) {
            $('#exercise-image').addClass('is-invalid');
            isValid = false;
        } else {
            $('#exercise-image').addClass('is-valid');
        }



        var filePic = picture.files[0];
        var formDataProfile = new FormData();
        formDataProfile.append('file', filePic);
        var fileImageUrl = await uploadToCloudinary(formDataProfile);

        // Create the data object
        const data = {
            Id: 0,
            Name: name,
            Description: description,
            Picturelink: fileImageUrl,
            Maquina: {
                id: MaquinaID,
                name: "n/a",
                description: "n/a",
                picturelink: "n/a"
            }
        };

        // Send the data to the API
        if (isValid) {
            createEjercicio(data);
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

async function createEjercicio(data) {
    try {
        const response = await fetch(`${API_URL_BASE}/Ejercicio/CreateEjercicio`, {
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
                    text: 'Un ejercicio con este número ya existe.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
            } else if (response.status === 500) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response; //.json();
            console.log('Success:', result);

            Swal.fire({
                title: 'Ejercicio creado con éxito.',
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
            text: 'Ocurrió un error al crear el ejercicio.',
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
                console.log("Error 404 no se encontraron maquinas");
                Swal.fire({
                    title: 'Error',
                    text: 'No se encontraró ningún equipo.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
            } else if (response.status === 500) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response.json();
            console.log('Success:', result);
            return result; // Return the fetched maquinas
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener el equipo.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' 
        });
    }
}

function validateText(text, elementSelector) { // Se llama así: validateElement(machineName, '#machineName');
    const element = $(elementSelector);

    if (text === '') {
        element.removeClass('is-valid').addClass('is-invalid');
        return false;
    } else {
        element.removeClass('is-invalid').addClass('is-valid');
        return true;
    }
}

async function populateSelectList() {
    const maquinas = await fetchMaquinas();
    if (Array.isArray(maquinas)) {
        const selectList = $('#machine-name');

        maquinas.forEach(maquina => {
            const option = $('<option></option>').val(maquina.id).text(maquina.name);
            selectList.append(option);
        });
    } else {
        console.error('maquinas is not an array:', maquinas);
    }
}

async function populateSelectListSwal() {
    const maquinas = await fetchMaquinas(); // This function should return a list of machines from your API or data source
    if (Array.isArray(maquinas)) {
        const selectList = $('#machine-nameS');

        maquinas.forEach(maquina => {
            const option = $('<option></option>').val(maquina.id).text(maquina.name);
            selectList.append(option);
        });
    } else {
        console.error('maquinas is not an array:', maquinas);
    }
}

async function fetchEjercicios() {
    try {
        const response = await fetch(`${API_URL_BASE}/Ejercicio/GetAllEjercicios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log("Error 404, no se encontraron ejercicios");
                Swal.fire({
                    title: 'Error',
                    text: 'No se encontraron ejercicios.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
            } else if (response.status === 500) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response.json();
            console.log('Success:', result);
            return result; // Return the fetched ejercicios
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los ejercicios.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' 
        });
    }
}

async function GetCards() {
    const ejercicios = await fetchEjercicios();
    if (Array.isArray(ejercicios)) {
        populateCards(ejercicios);
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron obtener las tarjetas.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' 
        });
    }
}

function populateCards(ejercicios) {
    const container = $('#cards-container');
    container.empty(); // Clear existing content

    ejercicios.forEach(ejercicio => {
        const cardHTML = `
            <div class="col">
                <div class="card h-100" onclick='CardUpdateEjercicio(${JSON.stringify(ejercicio)})'>
                <div class="card-img-container">
                    <img src="${ejercicio.picturelink}" class="card-img-top" alt="${ejercicio.name}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${ejercicio.name}</h5>
                        <p class="card-text">${ejercicio.description}</p>
                    </div>
                </div>
            </div>
        `;
        container.append(cardHTML);
    });
}

function CardUpdateEjercicio(ejercicio) {
    Swal.fire({
        title: 'Editar información de ejercicio',
        html: `
            <form id="edit-exercise-form">
                <div class="form-group">
                    <label for="exercise-name">Nombre</label>
                    <input type="text" id="exercise-nameS" class="form-control" value="${ejercicio.name}">
                </div>
                <div class="form-group">
                    <label for="exercise-description">Descripción</label>
                    <textarea id="exercise-descriptionS" class="form-control">${ejercicio.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="machine-name">Maquina</label>
                    <select class="form-control" id="machine-nameS">
                        <!-- Options will be populated here -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="exercise-picturelink">Nuevo archivo de imagen</label>
                    <input type="file" id="exercise-picturelinkS" class="form-control" accept=".png, .jpeg, .jpg"> 
                </div>
                <div class="form-group">
                    <label>Imagen actual</label>
                    <div class="card-img-container">
                        <img src="${ejercicio.picturelink}" class="card-img-top" alt="${ejercicio.name}">
                    </div>
                </div>
            </form>
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#ff8000',
        denyButtonText: 'Eliminar',
        showDenyButton: true,
        preConfirm: async () => {
            const id = document.getElementById('exercise-idS').value;
            const name = document.getElementById('exercise-nameS').value;
            const description = document.getElementById('exercise-descriptionS').value;
            const machineId = $("#machine-nameS").val().trim();
            const pictureInput = document.getElementById('exercise-picturelinkS');
            let picturelink = ejercicio.picturelink;

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

            // Return the updated exercise object
            return {
                Id: id,
                Name: name,
                Description: description,
                Picturelink: picturelink,
                Maquina: {
                    id: machineId,
                    name: "n/a",
                    description: "n/a",
                    picturelink: "n/a"
                }
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updatedEjercicio = result.value;
            // Handle the updated exercise information here, e.g., send it to the server or update the UI
            UpdateEjercicio(updatedEjercicio);            
        } else if (result.isDenied) {
            // Handle the deletion of the exercise
            Swal.fire({
                title: '¿Estás seguro de que quieres eliminar este ejercicio?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ff8000' 
            }).then((result) => {
                if (result.isConfirmed) {
                    DeleteEjercicio(ejercicio.id);                    
                }
            });
        }
    });

    // Populate the machine select list after the Swal modal is shown
    populateSelectListSwal();
}

async function UpdateEjercicio(data) {
    console.log('Ejercicio actualizado:', data);
    try {
        const response = await fetch(`${API_URL_BASE}/Ejercicio/UpdateEjercicio`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 409) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Un ejercicio con este número pertenece a una o varias rutinas.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else if (response.status === 500) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response; //.json();
            console.log('Success:', result);

            Swal.fire({
                title: 'Ejercicio actualizado con éxito.',
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
            text: 'Ocurrió un error al actualizar el ejercicio.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
}

async function DeleteEjercicio(ejercicioId) {
    console.log('Eliminando ejercicio con ID:', ejercicioId);
    
    try {
        const response = await fetch(`${API_URL_BASE}/Ejercicio/DeleteEjercicio/${ejercicioId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 409) {
                Swal.fire({
                    title: 'Error',
                    text: 'Este ejercicio no se puede eliminar por que existe en una o varias rutinas.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            Swal.fire({
                title: 'Ejercicio eliminado exitosamente.',
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
            text: 'Se produjo un error al eliminar el ejercicio.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }

}