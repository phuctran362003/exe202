﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EXE201_2RE_API.Models;

public partial class TblRole
{
    [Key]
    public Guid? roleId { get; set; }

    public string? name { get; set; }

    public virtual ICollection<TblUser>? tblUsers { get; set; } = new List<TblUser>();
}