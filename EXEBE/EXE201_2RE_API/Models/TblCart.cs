﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EXE201_2RE_API.Models;

public partial class TblCart
{
    [Key]
    public Guid? cartId { get; set; }

    public Guid? userId { get; set; }

    public decimal? totalPrice { get; set; }

    public DateTime? dateTime { get; set; }

    public string? address { get; set; }
    public string? fullName { get; set; }

    public string? phone { get; set; }
    public string? email { get; set; }
    public string? paymentMethod { get; set; }
    public string? code { get; set; }
    public string? status { get; set; }

    public virtual ICollection<TblCartDetail>? tblCartDetails { get; set; } = new List<TblCartDetail>();

    public virtual ICollection<TblOrderHistory>? tblOrderHistories { get; set; } = new List<TblOrderHistory>();

    public virtual TblUser? user { get; set; }
}