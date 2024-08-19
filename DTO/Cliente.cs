namespace DTO
{
    public class Cliente : BaseUserClass
    {
        //Ponemos nullable los atributos que no corresponden a este tipo de usuario
        public string FotoIdCliente { get; set; }
        public string FotoPerfilCliente { get; set; }
        public string GeneroCliente { get; set; }
        public int idMembresia { get; set; }
        public bool Estado { get; set; }
    }
}
