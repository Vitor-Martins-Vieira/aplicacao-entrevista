using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiario
    /// </summary>
    public class BeneficarioModel
    {
        /// <summary>
        /// ID
        /// </summary>
        [Required]
        public int Id { get; set; }
        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome{ get; set; }
        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        public string CPF { get; set; }
        /// <summary>
        /// IdCliente
        /// </summary>
        public string IdCliente { get; set; }



    }
}