using BusinessLayer;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CitasMedicionController : ControllerBase
    {

        [HttpPost]
        public IActionResult CreateCitasMedicion(CitasMedicion citasMedicion)
        {
            CitasMedicionManager manager = new CitasMedicionManager();
            manager.CreateCitasMedicion(citasMedicion);
            return Ok();
        }

        [HttpGet]
        public List<CitasMedicion> GetCitasMedicion(string cedula)
        {
            CitasMedicionManager manager = new CitasMedicionManager();
            return manager.GetAllCitasMedicionByCedula(cedula);
        }

        [HttpGet]
        public List<CitasMedicion> GetCitasMedicionForEntrenador(string description)
        {
            CitasMedicionManager manager = new CitasMedicionManager();
            return manager.GetAllCitasMedicionForEntrenador(description);
        }

        [HttpGet]
        public BaseClass GetCitasMedicionById(string idEvo)
        {
            CitasMedicionManager manager = new CitasMedicionManager();
            return manager.GetRetrieveByIdEvo(idEvo);
        }

        [HttpDelete]
        public IActionResult DeleteCitaMedicionxCliente(string idEvo)
        {
            try
            {
                CitasMedicionManager manager = new CitasMedicionManager();
                manager.DeleteCitaMedicionxCliente(idEvo);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
