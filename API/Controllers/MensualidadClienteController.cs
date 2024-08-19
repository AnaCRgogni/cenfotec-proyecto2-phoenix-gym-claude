using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using DataAccess.Crud;
using AppLogic;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MensualidadClienteController : ControllerBase
    {
        [HttpGet]
        public List<MensualidadCliente> GetMensualidadCliente()
        {
            MensualidadClienteManager am = new MensualidadClienteManager();

            return am.GetAllMensualidadCliente();
        }
    }
}
