﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EXE201_2RE_API.Models;

public partial class TblSize
{
    [Key]
    public Guid? sizeId { get; set; }

    public string? sizeName { get; set; }

    [JsonIgnore]
    public virtual ICollection<TblProduct>? tblProducts { get; set; } = new List<TblProduct>();
}