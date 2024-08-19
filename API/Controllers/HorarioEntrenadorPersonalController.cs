using BusinessLayer;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HorarioEntrenadorPersonalController : ControllerBase
    {

        [HttpPost]
        public IActionResult CreateHorarioEntrenadorPersonal(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            HorarioEntrenadorPersonalManager manager = new HorarioEntrenadorPersonalManager();
            manager.CreateHorarioEntrenadorPersonal(horarioEntrenadorPersonal);
            return Ok();
        }

        [HttpGet]
        public List<HorarioEntrenadorPersonal> GetHorarioEntrenadorPersonal(string cedula)
        {
            HorarioEntrenadorPersonalManager manager = new HorarioEntrenadorPersonalManager();
            return manager.GetAllHorarioEntrenadorPersonalByCedula(cedula);
        }

        [HttpGet]
        public BaseClass GetHorarioEntrenadorById(string idEvo)
        {
            HorarioEntrenadorPersonalManager manager = new HorarioEntrenadorPersonalManager();
            return manager.GetRetrieveByIdEvo(idEvo);
        }

        [HttpDelete]
        public IActionResult DeleteHorarioEntrenadorPersonal(string idEvo)
        {
            try
            {
                HorarioEntrenadorPersonalManager manager = new HorarioEntrenadorPersonalManager();
                manager.DeleteHorarioEntrenadorPersonal(idEvo);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error delete horario: {ex.Message}");
            }
        }

        [HttpPut("{idEvo}")]
        public IActionResult UpdateHorarioEntrenadorCliente(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            HorarioEntrenadorPersonalManager manager = new HorarioEntrenadorPersonalManager();
            manager.UpdateHorarioEntrenador(horarioEntrenadorPersonal);
            return Ok(horarioEntrenadorPersonal);
        }

        [HttpPut("{idEvo}")]
        public IActionResult UpdateCancelHorarioEntrenadorCliente(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            HorarioEntrenadorPersonalManager manager = new HorarioEntrenadorPersonalManager();
            manager.UpdateCancelHorarioEntrenador(horarioEntrenadorPersonal);
            return Ok(horarioEntrenadorPersonal);
        }
    }
}
