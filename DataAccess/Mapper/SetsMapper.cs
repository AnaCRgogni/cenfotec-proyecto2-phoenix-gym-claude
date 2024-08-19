using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;

namespace DataAccess.Mapper
{
    public class SetsMapper : IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new ResultadoSets()
            {
                Id = int.Parse(objectRow["IDRutina"].ToString()),
                Sets = float.Parse(objectRow["Sets"].ToString()),
                Peso = float.Parse(objectRow["Peso"].ToString()),
                Tiempo = float.Parse(objectRow["Tiempo"].ToString()),
                IdEjercicios = int.Parse(objectRow["IDEjercicios"].ToString()),
                Nombre = objectRow["Nombre"].ToString(),
                Descripcion = objectRow["Descripcion"].ToString(),
                Imagen = objectRow["Imagen"].ToString(),
                Equipo = objectRow["Equipo"].ToString()
            };
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var set = BuildObject(objRow);
                lstResult.Add(set);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addSet";

            Set set = (Set)entityDTO;

            operation.AddIntegerParam("IDRutina", set.RutinaID);
            operation.AddIntegerParam("IDEjercicios", set.ejercicio.Id);
            operation.AddIntegerParam("Sets", set.NumSets);
            operation.AddFloatParam("Peso", set.Peso);
            operation.AddFloatParam("Tiempo", set.Tiempo);
            //operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL en este caso el ID de rutina para crear los sets
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetRetrieveByIdStatement(int id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getSets"
            };

            operation.AddIntegerParam("IDRutina", id);
            return operation;
        }
    }
}

