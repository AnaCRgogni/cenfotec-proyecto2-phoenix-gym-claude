using DataAccess.Crud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;

namespace BusinessLayer
{
    public class EquipmentManager
    {
        public int CreateEquipment(Maquina maquina)
        {
            EquipmentCrudFactory equipmentCrud = new EquipmentCrudFactory();
            return equipmentCrud.Create(maquina);
        }

        public List<Maquina> GetAllMaquinas()
        {
            EquipmentCrudFactory equipmentCrud = new EquipmentCrudFactory();
            return equipmentCrud.RetrieveAll<Maquina>();

        }

        public int UpdateEquipment(Maquina maquina)
        {
            EquipmentCrudFactory equipmentCrud = new EquipmentCrudFactory();
            return equipmentCrud.Update(maquina);
        }

        public int DeleteEquipment(int Id)
        {
            EquipmentCrudFactory equipmentCrud = new EquipmentCrudFactory();
            return equipmentCrud.Delete(Id);
        }

    }
}
