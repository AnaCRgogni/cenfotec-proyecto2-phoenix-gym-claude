using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class Set : BaseClass
    {
        public int RutinaID { get; set; }
        public int NumSets { get; set; }
        public float Peso { get; set; }
        public float Tiempo { get; set; }
        public required Ejercicio ejercicio { get; set; }


    }

}
