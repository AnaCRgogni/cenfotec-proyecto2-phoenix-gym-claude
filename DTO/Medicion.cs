using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class Medicion:BaseClass
    {
        public DateTime Fecha { get; set; }
        public float Peso { get; set; }
        public float Altura { get; set; }
        public int Imc { get; set; }
        public int Igc { get; set; }
        public string IdUsuario { get; set; }
        public string IdCliente { get; set; }

    }
}
