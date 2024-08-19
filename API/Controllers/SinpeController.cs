using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SinpeController : ControllerBase
    {
        [HttpGet]
        public ActionResult<Sinpe> GetSinpeValue(string cedula)
        {
            SinpeManager manager = new SinpeManager();
            Sinpe sinpe = manager.GetSinpe(cedula);
            if (sinpe == null)
            {
                return NotFound();
            }
            return sinpe;
        }
        [HttpGet]
        public List<Sinpe> GetSinpes()
        {
            SinpeManager manager = new SinpeManager();
            return manager.GetAllSinpes();
        }

        [HttpGet]
        public List<Sinpe> GetHistorialDePagos(string cedula)
        {
            SinpeManager manager = new SinpeManager();
            return manager.GetAllPagos(cedula);
        }

    }
}