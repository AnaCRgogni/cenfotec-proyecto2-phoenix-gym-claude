using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class Pago : BaseClass
    {
        public DateTime FechaPago { get; set; }
        public string MetodoPago { get; set; }
        public string Comprobante { get; set; }
        public bool Estado { get; set; }
        public string CedulaUsuario { get; set; }
        public float Total {get; set; }
        public int IdMembresia { get; set; }
    }
}
