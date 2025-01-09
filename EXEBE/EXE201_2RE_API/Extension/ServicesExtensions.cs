
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EXE201_2RE_API.Middlewares;
using AutoMapper;
using EXE201_2RE_API.Setting;
using EXE201_2RE_API.Mapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Service;
using static EXE201_2RE_API.Configuration.ConfigurationModel;

namespace EXE201_2RE.Extensions;

public static class ServicesExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ExceptionMiddleware>();
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        //Add Mapper
        var mapperConfig = new MapperConfiguration(mc =>
        {
            mc.AddProfile(new ApplicationMapper());
        });

        IMapper mapper = mapperConfig.CreateMapper();
        services.AddSingleton(mapper);

        var jwtSettings = configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>();
        services.Configure<JwtSettings>(val =>
        {
            val.Key = jwtSettings.Key;
        });

        services.AddAuthentication(options =>
        {
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true
                };
            });

        services.AddAuthorization();

        services.AddDbContext<EXE201Context>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("Host"));
        });

        var firebaseConfigSection = configuration.GetSection("Firebase");
        var firebaseConfig = firebaseConfigSection.Get<FirebaseConfiguration>();

        services.Configure<FirebaseConfiguration>(firebaseConfigSection);
        services.AddSingleton(firebaseConfig);

        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<UnitOfWork>();
        services.AddScoped<UserService>();
        services.AddScoped<IdentityService>();
        services.AddScoped<ProductService>();
        services.AddScoped<FavoriteService>();
        services.AddScoped<TransactionService>();
        services.AddScoped<CartService>();
        services.AddScoped<ReviewService>();
        services.AddScoped<IFirebaseService, FirebaseService>();

        return services;
    }
}