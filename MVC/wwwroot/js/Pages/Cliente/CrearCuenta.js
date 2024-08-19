function getFormattedDateForSQL() {
    // Fecha de hoy
    let today = new Date();

    //Cambio a formato para sql
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    let day = String(today.getDate()).padStart(2, '0');

    // Crea la cadena con el formato "YYYY-MM-DD"
    let formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

async function getConversionRate() {
    try {
        const response = await $.ajax({
            url: `https://v6.exchangerate-api.com/v6/${apiKeyConversion}/pair/CRC/USD`,
            method: "GET",  // Aquí está el problema
        });
        return response.conversion_rate;
    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error);
        return null; // O maneja el error como prefieras
    }
}


$(document).ready(async function () {

    let descuento = 0;
    let compraTotal = 0;

    $("#verifyDiscountBtn").click(function () {
        var codigo = $("#codigo").val().trim();
        if (codigo == "") {
            $("#discountFeedback").text("Porfavor digitar un código de descuento").show();
            $("#codigo").addClass('is-invalid');
        } else {
            $.ajax({
                url: `${API_URL_BASE}/Descuento/VerifyDescuento?codigo=${codigo}`,
                type: 'GET',
                success: function (idDescuento) {
                    if (idDescuento === -1) {
                        // Mostrar mensaje de error en invalid-feedback
                        $("#discountFeedback").text("Código de descuento inexistente").show();
                        $("#codigo").addClass('is-invalid');
                        $("#discountFeedbackValid").hide();
                    } else if (idDescuento === -2) {
                        $("#discountFeedback").text("Código de descuento inactivo").show();
                        $("#codigo").addClass('is-invalid');
                        $("#discountFeedbackValid").hide();
                    } else {
                        $("#codigo").removeClass('is-invalid');
                        $("#discountFeedbackValid").text("Código válido").show();
                        $("#codigo").addClass('is-valid');
                        $("#discountFeedback").hide();

                        $.ajax({
                            url: `${API_URL_BASE}/Descuento/GetDescuentoByid?id=${idDescuento}`, // Corregido
                            method: 'GET',
                            success: function (objDescuento) {
                                descuento = objDescuento.porcentaje / 100;
                                console.log("Descuento" + JSON.stringify(descuento));
                            },
                            error: function (error) {
                                console.log("error" + error);
                            }

                        });
                    }
                },
                error: function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error verificando descuento.',
                        confirmButtonColor: '#ff8000'
                    });
                    console.error('Error cargando usuario.', error);
                }
            });

        }

    });

    var rate = await getConversionRate();

        // Ensure only one accordion section is open at a time
        $('#paymentAccordion').on('show.bs.collapse', function (e) {
            $('#paymentAccordion .accordion-collapse.show').not(e.target).collapse('hide');
        });

        // Check if all sections are closed and open the first one by default
        $('#paymentAccordion').on('hidden.bs.collapse', function (e) {
            var allPanelsClosed = true;

            $('.accordion-collapse').each(function () {
                if ($(this).hasClass('show')) {
                    allPanelsClosed = false;
                }
            });

            if (allPanelsClosed) {
                $('#collapseOne').collapse('show');
            }
        });

    $('#showPassword').on('change', function () {
        var passwordInput = $('#contrasena');
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            passwordInput.attr('type', 'text');
        } else {
            passwordInput.attr('type', 'password');
        }
    });

    const forms = $('.needs-validation'); // Llamo a todo lo que tenga la clase needs-validation
    //hago unos radios para seleccionar las membresias que esten en la base de datos
    try {
        const radioresponse = await $.ajax({
            url: `${API_URL_BASE}/Mensualidad/GetAllMembresias`,
            method: 'GET',
            dataType: 'json'
        });//get de todas las membresias

        const divMembresias = $('#membresiaOptions');

        radioresponse.forEach(membresia => {
            const radioLabel = `${membresia.tipo} - Mensualidad: ${membresia.mensualidad}, Matrícula: ${membresia.matricula}`;
            const radioInput = `<div class="form-check">
                                    <input class="form-check-input" type="radio" name="membresiaRadio" id="membresia${membresia.id}" value="${membresia.id}" data-mensualidad="${membresia.mensualidad}" data-matricula="${membresia.matricula}">
                                    <label class="form-check-label" for="membresia${membresia.id}">
                                        ${radioLabel}
                                    </label>
                                </div>`;
            divMembresias.append(radioInput);
        }); //por cada objeto dentro de la respues que obtengo estoy mappeando un radiolabel y radio input y despues usando append lo estoy metiendo dentro del div vacio
    }catch (error) {
        console.error('Error al obtener datos de membresías:', error);
    }



    // Recorro cada uno de los forms
    $('#formCliente').submit(async function (event) {

        event.preventDefault(); // Evitar el envío automático del formulario
        let orderId;
        let metodoPago;
        let comprobante;
        var isValid = true;
        // Declaro que la validación empieza en true
        // Limpio errores
        $(".form-control").removeClass("is-invalid");

        var nombre = $("#nombre").val().trim();
        var apellido1 = $("#apellido1").val().trim();
        var apellido2 = $("#apellido2").val().trim();
        var telefono = $("#telefono").val().trim();
        var email = $("#email").val().trim();
        var fechaNacimiento = $("#fechaNacimiento").val().trim();
        var contrasena = $("#contrasena").val().trim();
        var fotoIdCliente = $("#fotoIdCliente")[0];
        var fotoPerfilCliente = $("#fotoPerfilCliente")[0];
        var generoCliente = $("#generoCliente").val();
        var cedula = $("#cedula").val().trim();
        var membresia = $("input[name='membresiaRadio']:checked").val();

        // Validación de campos obligatorios
        if (nombre === '') {
            $('#nombre').addClass('is-invalid');
            isValid = false;
        } else {
            $('#nombre').addClass('is-valid');
        }

        if (apellido1 === '') {
            $('#apellido1').addClass('is-invalid');
            isValid = false;
        } else {
            $('#apellido1').addClass('is-valid');
        }

        if (apellido2 === '') {
            $('#apellido2').addClass('is-invalid');
            isValid = false;
        } else {
            $('#apellido2').addClass('is-valid');
        }

        if (telefono === '') {
            $('#telefono').addClass('is-invalid');
            isValid = false;
        } else {
            $('#telefono').addClass('is-valid');
        }

        // Validación de formato de correo electrónico
        if (email === '') {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                $('#email').addClass('is-invalid');
                isValid = false;
            } else {
                $('#email').addClass('is-valid');
            }
        }

        // Validación de fecha de nacimiento
        if (fechaNacimiento === '') {
            $('#fechaNacimiento').addClass('is-invalid');
            isValid = false;
        } else {
            $('#fechaNacimiento').addClass('is-valid');
        }

        // Validación de formato de contraseña
        if (contrasena === '') {
            $('#contrasena').addClass('is-invalid');
            isValid = false;
        } else {
            var passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿]{8,}$/;
;
            if (!passwordPattern.test(contrasena)) {
                $('#contrasena').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contrasena').addClass('is-valid');
            }
        }

        if (fotoIdCliente.files.length === 0) {
            $('#fotoIdCliente').addClass('is-invalid');
            isValid = false;
        } else {
            $('#fotoIdCliente').addClass('is-valid');
        }

        if (fotoPerfilCliente.files.length === 0) {
            $('#fotoPerfilCliente').addClass('is-invalid');
            isValid = false;
        } else {
            $('#fotoPerfilCliente').addClass('is-valid');
        }

        if (generoCliente === null) {
            $('#generoCliente').addClass('is-invalid');
            isValid = false;
        } else {
            $('#generoCliente').addClass('is-valid');
        }

        if (cedula === '') {
            $('#cedula').addClass('is-invalid');
            isValid = false;
        } else {
            $('#cedula').addClass('is-valid');
        }

        if ($('input[name="membresiaRadio"]:checked').length === 0) {
            $("input[name='membresiaRadio']").addClass('is-invalid');
            isValid = false;
        } else {
            $("input[name='membresiaRadio']").addClass('is-valid');
        }

        async function procesarCrearCliente(orderId) {

            Swal.fire({
                title: 'Enviando contraseña OTP a su correo electrónico.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading(); // Muestra el spinner
                }
            });

            var fileId = fotoIdCliente.files[0];
            fileIdImageUrl = await uploadToCloudinary(fileId);
/*            var formDataId = new FormData();
            formDataId.append('file', fileId);
            var fileIdImageUrl = await uploadToCloudinary(formDataId);*/
            var filePerfil = fotoPerfilCliente.files[0];
            var filePerfilImageUrl = await uploadToCloudinary(filePerfil);
/*            var formDataProfile = new FormData();
            formDataProfile.append('file', filePerfil);
            var filePerfilImageUrl = await uploadToCloudinary(formDataProfile);*/
            //post de axios de password
            const hasResult = await handlePassword(contrasena);
            salt = hasResult.salt;
            hashedContra = hasResult.hashedPassword;
            var otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(otp);
            const otpResult = await sendOtpEmail(email, otp);

            async function sendOtpEmail(email, otp) {
                try {
                    const response = await $.ajax({
                        url: `${API_URL_BASE}/Email/SendOtpEmail?email=${encodeURIComponent(email)}&otp=${otp}`,
                        method: 'POST'
                    });
                    return response;
                } catch (error) {
                    console.error("Error is", error);
                    return null;
                }
            }

            Swal.hideLoading();

            if (otpResult) {
                const { value: otpInput } = await Swal.fire({
                    title: "Contraseña OTP",
                    input: "number",
                    text: "Introduzca la contraseña OTP enviada a su correo.",
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000',
                    inputValidator: (value) => {
                        if (!value) {
                            return '¡Debes ingresar la contraseña OTP!';
                        }
                    },
                    allowOutsideClick: false,
                });
                if (otpInput) {
                    if (otpInput === otp) {

                        const cliente = {}
                        cliente.cedula = cedula;
                        cliente.nombre = nombre;
                        cliente.apellido1 = apellido1;
                        cliente.apellido2 = apellido2;
                        cliente.email = email;
                        cliente.contrasena = hashedContra;
                        cliente.telefono = telefono;
                        cliente.fechaNacimiento = fechaNacimiento;
                        cliente.fotoIdCliente = fileIdImageUrl;
                        cliente.fotoPerfilCliente = filePerfilImageUrl;
                        cliente.generoCliente = generoCliente;
                        cliente.idMembresia = membresia;
                        var selectedMembresia = $("input[name='membresiaRadio']:checked");
                        var mensualidad = selectedMembresia.data('mensualidad');
                        var matricula = selectedMembresia.data('matricula');


                        $.ajax({
                            url: `${API_URL_BASE}/Cliente/CreateCliente`,
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(cliente),
                            success: function (response, textStatus, xhr) {
                                if (xhr.responseJSON.statusCode === '401') {

                                    Swal.fire({
                                        title: 'Error!',
                                        text: 'El correo ya está en uso.',
                                        icon: 'error',
                                        confirmButtonText: 'Ok',
                                        confirmButtonColor: '#ff8000'
                                    });


                                } else if (xhr.responseJSON.statusCode === '402') {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: 'La cédula ya está en uso.',
                                        icon: 'error',
                                        confirmButtonText: 'Ok',
                                        confirmButtonColor: '#ff8000'
                                    });
                                } else {
                                    fecha = getFormattedDateForSQL();
                                    estado = false;

                                    //Aqui va logica add pago
                                    const pago = {}
                                    pago.fechaPago = fecha;
                                    pago.estado = false;
                                    pago.cedulaUsuario = cedula;
                                    pago.idMembresia = membresia;
                                    pago.comprobante = comprobante;
                                    pago.total = totalCompra;
                                    pago.metodoPago = metodoPago;

                                    console.log("PAGO: "+JSON.stringify(pago));

                                    $.ajax({
                                        url: `${API_URL_BASE}/Pago/CreatePago`,
                                        method: 'POST',
                                        contentType: 'application/json',
                                        data: JSON.stringify(pago),

                                    });
                                    

                                    try {
                                        const response = fetch(`${API_URL_BASE}/Paypal/CompletePayPalOrder?orderId=${orderId}`, {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'text/plain'
                                            },
                                        });

                                    } catch (error) {
                                        console.error('Error :', error);
                                    }

                                    $.ajax({
                                        url: `${API_URL_BASE}/Password/SaveSalt`,
                                        method: 'POST',
                                        data: JSON.stringify({
                                            saltValue: salt,
                                            Cedula: cedula,
                                        }),
                                        contentType: "application/json;charset=utf-8",
                                        success: function (response) {

                                        }
                                    });

                                    Swal.fire({
                                        title: "Cuenta Creada",
                                        text: "Una vez que el pago sea aprobado, podrá acceder a su cuenta",
                                        icon: "success",
                                        allowOutsideClick: false, // Evita cerrar haciendo clic fuera del SweetAlert
                                        showCancelButton: false, // Oculta el botón de cancelar (X)
                                        allowEscapeKey: false, // Evita cerrar presionando la tecla "Esc"
                                        showConfirmButton: true, // Muestra el botón de confirmar (OK)
                                        confirmButtonText: "OK",
                                        confirmButtonColor: '#ff8000'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            // Redirige a la página principal del sitio
                                            window.location.href = 'https://localhost:7021/LandingPage/LogIn';
                                        }
                                    });
                                }
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                console.error('Error:', textStatus, errorThrown);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error al crear cuenta.",
                            icon: "error",
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        })
                    }

                } else {
                    Swal.fire({
                        title: 'OTP incorrecto',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo enviar su correo OTP.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            }
        }


        if (isValid) {

            var selectedMembresia = $("input[name='membresiaRadio']:checked");
            var mensualidad = selectedMembresia.data('mensualidad')
            var matricula = selectedMembresia.data('matricula')
            var total = (matricula + mensualidad);
            var descontado = (total*descuento)
            var totalDescuento = descontado.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
            totalCompra = (total - descontado);
            var totalMuestra = totalCompra.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
            var mensualidadMuestra = mensualidad.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
            var matriculaMuestra = matricula.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });

            Swal.fire({
                title: 'Realizar Pago',
                icon: 'warning',
                confirmButtonColor: '#ff8000', // Cambia este color al que prefieras para el botón de confirmación
                confirmButtonText: 'Ok',
                html: `
<div class="row">
    <table class="table table-borderless">
        <tbody>
            <tr>
                <td><h4>Monto matrícula:</h4></td>
                <td><h4>${matriculaMuestra}</h4></td>
            </tr>
            <tr>
                <td><h4>Monto mensualidad:</h4></td>
                <td><h4>${mensualidadMuestra}</h4></td>
            </tr>
            <tr>
                <td><h4>Monto descuento:</h4></td>
                <td><h4>${totalDescuento}</h4></td>
            </tr>
            <!-- Divider row -->
            <tr>
                <td colspan="2"><hr></td>
            </tr>
            <tr>
                <td><h3>Total:</h3></td>
                <td><h3>${totalMuestra}</h3></td>
            </tr>
        </tbody>
    </table>
                
<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="accordion" id="paymentAccordion">
            <!-- Sección Sinpe Móvil -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" id="validSinpe">
                        Sinpe Móvil
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#paymentAccordion">
                    <div class="accordion-body">
                        <p class="titulo-cuenta">Numero: 72895538</p>
                        <p class="titulo-cuenta">Nombre: Phoenix Fitness</p>
                        <div class="row">
                            <div class="col-md-12 form-group">
                                <label for="comprobanteSinpe">Comprobante de Pago</label>
                                <input type="file" class="form-control" id="comprobanteSinpe" accept=".png, .jpeg, .jpg" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sección Transacción Bancaria -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Transacción Bancaria
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#paymentAccordion">
                    <div class="accordion-body">
                        <p class="titulo-cuenta">Número de cuenta BAC: 245166218</p>
                        <p class="titulo-cuenta">Número de cuenta IBAN: CR20030500009758682699</p>
                        <div class="row">
                            <div class="col-md-12 form-group">
                                <label for="comprobanteTransferencia">Comprobante de Pago</label>
                                <input type="file" class="form-control" id="comprobanteTransferencia" accept=".png, .jpeg, .jpg" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sección PayPal -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Paypal
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#paymentAccordion">
                    <div class="accordion-body" id="paypalAccordion">
                        <div class="col-md-12 form-group">
                            <div id="paypal-button-container"></div>
                            <input type="hidden" id="paypalCompleted">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
                preConfirm: async () => {
                    const comprobanteSinpe = document.getElementById('comprobanteSinpe');
                    const comprobanteTransferencia = document.getElementById('comprobanteTransferencia');
                    const paypalCompleted = document.getElementById('paypalCompleted').value === 'true';

                    let valid = true;

                    // Validación de comprobantes de pago
                    if (comprobanteSinpe.files.length === 0 && comprobanteTransferencia.files.length === 0 && !paypalCompleted) {
                        valid = false;
                        Swal.showValidationMessage('Por favor, complete al menos un método de pago.');
                    } else if (comprobanteSinpe.files.length > 0) {
                        metodoPago = "sinpe";
                        fileSinpe = comprobanteSinpe.files[0];
                        comprobante = await uploadToCloudinary(fileSinpe);
                        return comprobante;
                        return metodoPago;
                        return valid;

                    } else if (comprobanteTransferencia.files.length > 0) {
                        metodoPago = "transferencia";
                        fileTransac = comprobanteTransferencia.files[0];
                        comprobante = await uploadToCloudinary(fileTransac);
                        return comprobante;
                        return metodoPago;
                       
                        return valid;

                    } else if (paypalCompleted) {
                        metodoPago = "paypal";
                        comprobante = "http://res.cloudinary.com/dmyijnjqd/image/upload/v1722984534/ej4gym2dqhfhpf3x8nga.png";
                        return comprobante;
                        return metodoPago;
                        return valid;
                    }

                },
                didOpen: (async) => {
                    var totalPago = ((totalCompra) * rate).toFixed(2);

                    const paymentAmount = {
                        currency_code: "USD",
                        value: totalPago
                    };

                    const purchase_unit = {
                        amount: paymentAmount
                    };

                    const purchase_units = [purchase_unit];

                    const paypalJson = {
                        intent: "CAPTURE",
                        purchase_units: purchase_units
                    };

                    let approvePromise = new Promise((resolve, reject) => { 
                        paypal.Buttons({
                            createOrder: async () => {
                                try {
                                    const response = await fetch(`${API_URL_BASE}/Paypal/CreatePayPalOrder`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(paypalJson)
                                    });

                                    if (!response.ok) {
                                        throw new Error('Error al crear la orden.');
                                    }

                                    const orderId = await response.text();
                                    return orderId; // Devuelvo el orderId para que lo agarre el data
                                } catch (error) {
                                    console.error('Error en createOrder:', error);
                                    Swal.fire('Error', 'No se pudo crear la orden.', 'error');
                                    return ''; // Retorna un valor vacío si hay un error
                                }
                            },
                            onApprove: async (data, actions) => {
                                orderId = data.orderID

                                document.getElementById('paypalCompleted').value = 'true';
                                resolve(); // Resolver la promesa si la transacción es completada
                            }
                        }).render("#paypal-button-container");
                    });

                    // Esperar a que la promesa se resuelva antes de cerrar el SweetAlert
                    approvePromise.then(() => {
                        // La promesa se resolvió, el resultado de SweetAlert debe ser confirmado
                        Swal.getConfirmButton().click();
                    }).catch(() => {
                        // La promesa fue rechazada, no hacer nada especial si la transacción no fue completada
                    });
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('¡Pago confirmado!', '', 'success');
                    procesarCrearCliente(orderId);

                } else {
                    Swal.fire('¡Pago Rechazado!', '', 'error');
                }
            });
        } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Revise las casillas marcadas en rojo',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
        }
    });


}); 




