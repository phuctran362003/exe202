
using EXE201_2RE.Extensions;
using EXE201_2RE_API.Middlewares;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System;
using static EXE201_2RE_API.Settings.ConfigurationModel;

namespace EXE201_2RE_API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddInfrastructure(builder.Configuration);
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddMvc();
            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Mock API", Version = "v1" });
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });


            builder.Services.AddCors(option =>
                option.AddPolicy("CORS", builder =>
                    builder.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed((host) => true)));

            var app = builder.Build();

            // Hook into application lifetime events and trigger only application fully started 
            // Configure the HTTP request pipeline.


            ApplyMigration(app);
            app.UseSwagger(op => op.SerializeAsV2 = false);
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                options.RoutePrefix = string.Empty;
            });
            app.UseCors("CORS");

            app.UseHttpsRedirection();

            app.UseMiddleware<ExceptionMiddleware>();


            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
        private static void ApplyMigration(WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var _db = scope.ServiceProvider.GetRequiredService<EXE201Context>();
                if (_db.Database.GetPendingMigrations().Any())
                {
                    _db.Database.Migrate();
                }
            }
        }
        /*        private static void ApplyMigration(WebApplication app)
                {
                    using (var scope = app.Services.CreateScope())
                    {
                        var _db = scope.ServiceProvider.GetRequiredService<EXE201Context>();
                        if (_db.Database.GetPendingMigrations().Any())
                        {
                            _db.Database.Migrate();
                        }
                    }
                }*/
    }
}
