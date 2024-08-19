using DataAccess.Crud;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class PagoManager
    {
        public void CreatePago(Pago pago)
        {
            PagoCrudFactory pagoCrud = new PagoCrudFactory();
            pagoCrud.Create(pago);
        }
    }
}
