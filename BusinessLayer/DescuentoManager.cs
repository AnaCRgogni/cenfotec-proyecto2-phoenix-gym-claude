using DataAccess.Crud;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class DescuentoManager
    {
        public int Create(Descuento descuento)
        {
            DescuentoCrudFactory descuentoCrud = new DescuentoCrudFactory();
            return descuentoCrud.Create(descuento);
        }

        public List<Descuento> GetAllDescuentos()
        {
            DescuentoCrudFactory descuentoCrud = new DescuentoCrudFactory();
            return descuentoCrud.RetrieveAll<Descuento>();
        }

        public Descuento getDescuentoById(int id)
        {
            DescuentoCrudFactory descuentoCrud = new DescuentoCrudFactory();
            Descuento descuento = (Descuento)descuentoCrud.RetrieveById(id);
            return descuento;
        }

        public int UpdateDescuento(Descuento descuento)
        {
            DescuentoCrudFactory descuentoCrud = new DescuentoCrudFactory();
            return descuentoCrud.Update(descuento);
        }

        public int VerifyDescuento(string codigo)
        {
            DescuentoCrudFactory descuentoCrud = new DescuentoCrudFactory();
            return descuentoCrud.VerifyDescuento(codigo);
        }

        public void Delete(int id)
        {
            DescuentoCrudFactory descuentoCrud = new DescuentoCrudFactory();
            descuentoCrud.Delete(id);
        }

    }
}
