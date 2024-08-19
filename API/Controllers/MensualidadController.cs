using BusinessLayer;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MensualidadController : Controller
    {
        [HttpPost]
        public IActionResult CreateMensualidad(Membresia mensualidad)
        {
            MembresiaManager manager = new MembresiaManager();
            manager.CreateMembresia(mensualidad);
            return Ok();
        }

        [HttpGet]
        public ActionResult<List<Membresia>> GetAllMembresias()
        {
            MembresiaManager manager = new MembresiaManager();
            List<Membresia> membresiaList = manager.GetAllMembresias();
            if (membresiaList == null)
            {
                return NotFound();
            }
            return membresiaList;
        }

        [HttpPost]
        public ApiResponse VerifyMensualidad(string cedula, string fecha)
        {
            MembresiaManager manager = new MembresiaManager();
            int result = manager.VerifyMembresia(cedula, fecha);
            ApiResponse response = new ApiResponse();
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Al Dia";
                response.Content = "";
            }
            else if (result == -1)
            {
                response.StatusCode = "401";
                response.Message = "Tarde";
                response.Content = "";
            }
            else
            {
                response.StatusCode = "500";
                response.Message = "Ni idea de que paso";
                response.Content = "";
            }
            return response;
        }

        [HttpGet]
        public Membresia GetMembresiaByid(int id)
        {
            MembresiaManager manager = new MembresiaManager();
            return manager.getMembresiaById(id);
        }

        [HttpPut]
        public ApiResponse UpdateMembresia(Membresia membresia) 
        {
            MembresiaManager manager = new MembresiaManager();
            int result = manager.UpdateMembresia(membresia);
            ApiResponse response = new ApiResponse();
            if (result == 0) 
            {
                response.StatusCode = "200";
                response.Message = "Membresia Actualizado";
                response.Content = membresia.Id.ToString();
            } 
            else if (result == -1) 
            {
                response.StatusCode = "400";
                response.Message = "Error al actualizar membresia";
                response.Content = "";
            }
            return response;
        }

        [HttpDelete]

        public IActionResult DeleteMembresia(int id)
        {
            try
            {
                MembresiaManager manager = new MembresiaManager();
                manager.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}

