using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class EntrenamientoCompartido:BaseClass
    {
        public int IdEntrenamiento { get; set; }
        public string CedulaCliente { get; set; }
        public string CedulaUsuario { get; set; }

    }
}
