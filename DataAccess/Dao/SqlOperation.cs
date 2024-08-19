using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Dao
{
    public class SqlOperation
    {
        public string ProcedureName { get; set; }

        public List<SqlParameter> parameters;

        public SqlOperation()
        {
            parameters = new List<SqlParameter>();
        }

        public void AddVarcharParam(string parameterName, string paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue));
        }

        public void AddIntegerParam(string parameterName, int paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue));
        }

        public void AddDateTimeParam(string parameterName, DateTime paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue));
        }

        public void AddFloatParam(string parameterName, float paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue));
        }

        public void AddBoolParam(string parameterName, bool paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue));
        }
        public void AddNullableFloatParam(string parameterName, float? paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue.HasValue ? (object)paramValue.Value : DBNull.Value));
        }

        internal void AddNullableIntegerParam(string parameterName, int? paramValue)
        {
            parameters.Add(new SqlParameter("@" + parameterName, paramValue.HasValue ? (object)paramValue.Value : DBNull.Value));
        }
        public void AddOutputParam(string paramName)
        {
            parameters.Add(new SqlParameter(paramName, SqlDbType.Int) { Direction = ParameterDirection.Output });
        }
        public void AddNullableVarcharParam(string parameterName, float? paramValue)
        {
            if (paramValue.HasValue)
            {
                parameters.Add(new SqlParameter("@" + parameterName, paramValue.Value));
            }
            else
            {
                parameters.Add(new SqlParameter("@" + parameterName, DBNull.Value));
            }
        }

        public void AddBinaryParam(string paramName, byte[] paramValue)
        {
            SqlParameter param = new SqlParameter(paramName, SqlDbType.VarBinary)
            {
                Value = paramValue ?? (object)DBNull.Value
            };
            parameters.Add(param);
        }

    }
}

