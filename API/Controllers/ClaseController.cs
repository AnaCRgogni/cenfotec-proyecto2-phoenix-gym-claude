using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ClaseController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateClase(Clase clase)
        {
            ClaseManager manager = new ClaseManager();
            manager.CreateClase(clase);
            return Ok();
        }

        [HttpGet]
        public List<Clase> GetAllClases()
        {
            ClaseManager manager = new ClaseManager();
            return manager.GetAllClases();
        }

        [HttpGet]
        public List<ClasesXCliente> GetClasesXCliente(string cedula)
        {
            ClaseManager manager = new ClaseManager();
            return manager.GetClasesXCliente(cedula);
        }

        [HttpPost]
        public IActionResult ReservarClase(string cedula, DateTime fechaClase, int idClase, string email)
        {
            ClaseManager manager = new ClaseManager();
            int membresia = manager.validacionXMembresia(email);

            if (membresia == 0)
            {
                return Ok(new { success = false, message = "Usuario inactivo." });
            }
            if (membresia == 1)
            {
                return Ok(new { success = false, message = "Esta membresía no permite reservar clases grupales." });
            }
            if (manager.validarFechaHora(cedula, fechaClase))
            {
                return Ok(new { success = false, message = "Ya se encuentra inscrito en una clase a la misma hora." });
            }

            var inscripcion = new Inscripcion
            {
                IdCliente = cedula,
                IdClase = idClase
            };

            if (membresia == 2)
            {
                bool validacionXSemana = manager.validacionXSemana(cedula, fechaClase);
                if (!validacionXSemana)
                {
                    return Ok(new { success = false, message = "No se permite reservar más de 2 clases por semana para su tipo de membresía." });
                }
            }

            manager.CreateInscripcion(inscripcion);
            manager.UpdateCupo(idClase);

            return Ok(new { success = true, message = "Clase reservada exitosamente." });
        }


    }
}