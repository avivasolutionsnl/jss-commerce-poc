using System.IO;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Poortwachter;
using Poortwachter.Formatter;

namespace Gateway
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddAuthentication()
                .AddJwtBearer("test", x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddCors(o => o.AddDefaultPolicy(builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseAuthentication();
            app.UseCors();

            app.Map("/api", config =>
            {
                // Liminal? https://en.wikipedia.org/wiki/Liminal
                config.UsePoortwachter(c =>
                {
                    c.ModifyGlobalRequestHeaders((context, headers) =>
                    {
                        headers.Clear();
                        headers.AddHeader("X-CommerceEngineCert", "MIIDVTCCAj2gAwIBAgIQWOvUQj+CJbxFGOz861oRQTANBgkqhkiG9w0BAQsFADAiMSAwHgYDVQQDDBdzaXRlY29yZS1kb2NrZXItZGV2b25seTAeFw0xOTA1MDIwOTAzNTJaFw0yMDA1MDIwOTIzNDlaMBoxGDAWBgNVBAMMD2NvbW1lcmNlLmNsaWVudDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKc1vSWE29/8hTTw7wrS0cm1ak9SZDWlP6d14SWkZlUoR9mwiTHhoF+DI2KVT3Dx9FzSDEfWqePaWc+ESJjmSjIFpynDkbjRC0yJZT1XfzGlC0mcMKXITr+2JQkUaCu0/jiyFF/R2pEWRo5k2Xa2/MO1ofHmGxaSSMPghwXHqeWg4z9W4MvqJPSXw6aPicO0gyJHyY+3SkAJCu1qVsAEd8Fu1bh/qxPSI2G6iOwZhdnRQynGnI7yyrXhWUI35BjeyvsuSnCUadKE+wzYSdSkcmJVZrrNhlTAgKOTT/KTm0Rfn1OtkzwfykJkCnEs9iXL/qrv3k5/YRs57wYZJMHPM30CAwEAAaOBjjCBizAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMBMBoGA1UdEQQTMBGCD2NvbW1lcmNlLmNsaWVudDAfBgNVHSMEGDAWgBT5WpDFI6EirnL+xmkUn6khRtc8jjAdBgNVHQ4EFgQU7crXh1BNsGln7beDLgXh6ZAoWWAwDQYJKoZIhvcNAQELBQADggEBABHoixOLWEzoQTBzV1I2bIym1v3DGkXht87fmyUOBN+ZjwiuS2sYteGBTsgGxDE8kNImCuN2akLzrNBul7O2qaF2DCdq7g7zrHHCHKeQV3i3jr8jgY3k6TKQjoLizgqjhTsnFaWIr3PljcG72wZyZyYD8BCU/jTllJfP/mCNWk4JIm2xB8kC/P1lRV+OHrh0KvR/McHp4ooQ4uyhPKkQnq6+VsYShIR7tZ8KN7/IYe0IOFd/v3zVJBklS22IzB2rH7mGUcoR2XAGgoo3emwUlT/0ONhePPhVWwU6vaFGBdOXozM3FRRVu+d+Th9bKGopVELaKp2ximBSWIlBGIGG7wQ=");
                        headers.AddHeader("Environment", "HabitatAuthoring");
                        headers.AddHeader("Language", "en-US");
                        headers.AddHeader("Currency", "USD");
                        headers.AddHeader("ShopName", "CommerceEngineDefaultStorefront");
                    });

                    c.ReRoute("/catalog/{catalogId}/sellableitems/{sellableitemId}")
                     .Method(HttpMethod.Get)
                     .To("https://commerce:5000/api/SellableItems('{catalogId},{sellableitemId},')?$expand=Components($expand=ChildComponents($expand=ChildComponents($expand=ChildComponents($expand=ChildComponents))))")
                     .Method(HttpMethod.Get);

                    c.ReRoute("/carts/me")
                     .Method(HttpMethod.Get)
                     .To((context, httpContext) =>
                     {
                        var token = httpContext.User.FindFirst("anonymous_user_id").Value;

                        return $"https://commerce:5000/api/Carts('{token}')?$expand=Lines($expand=CartLineComponents($expand=ChildComponents)),Components";
                     })
                     .Method(HttpMethod.Get)
                     .AuthenticateWith("test");

                    c.ReRoute("/carts/me/addline")
                     .Method(HttpMethod.Put)
                     .To("https://commerce:5000/api/AddCartLine()")
                     .TransformBody((_, httpContext, bytes) => SetCartIdInBody(httpContext, bytes))
                     .Method(HttpMethod.Put)
                     .AuthenticateWith("test");

                    c.ReRoute("/carts/me/addemail")
                     .Method(HttpMethod.Put)
                     .To("https://commerce:5000/api/AddEmailToCart()")
                     .TransformBody((_, httpContext, bytes) => SetCartIdInBody(httpContext, bytes))
                     .Method(HttpMethod.Put)
                     .AuthenticateWith("test");

                    c.ReRoute("/carts/me/setfulfillment")
                     .Method(HttpMethod.Put)
                     .To("https://commerce:5000/api/SetCartFulfillment()")
                     .TransformBody((_, httpContext, bytes) => SetCartIdInBody(httpContext, bytes))
                     .Method(HttpMethod.Put)
                     .AuthenticateWith("test");

                    c.ReRoute("/carts/me/addgiftcardpayment")
                     .Method(HttpMethod.Put)
                     .To("https://commerce:5000/api/AddGiftCardPayment()")
                     .TransformBody((_, httpContext, bytes) => SetCartIdInBody(httpContext, bytes))
                     .Method(HttpMethod.Put)
                     .AuthenticateWith("test");

                    c.ReRoute("/carts/me/createorder")
                     .Method(HttpMethod.Put)
                     .To("https://commerce:5000/api/CreateOrder()")
                     .TransformBody((_, httpContext, bytes) => SetCartIdInBody(httpContext, bytes, id:"id"))
                     .Method(HttpMethod.Put)
                     .AuthenticateWith("test");

                    c.ReRoute("/carts/me/lines/{cartLineId}")
                     .Method(HttpMethod.Delete)
                     .To("https://commerce:5000/api/RemoveCartLine()")
                     .TransformBody((context, httpContext, bytes) =>
                     {
                         var token = httpContext.User.FindFirst("anonymous_user_id").Value;

                         var o = JObject.FromObject(new {
                             cartId = token,
                             cartLineId = context.Variables["cartLineId"]
                         });

                         return Encoding.Default.GetBytes(o.ToString());
                     })
                     .Method(HttpMethod.Delete)
                     .AuthenticateWith("test");

                    c.ReRoute("/customers/{customerId}")
                     .Method(HttpMethod.Get)
                     .To("https://commerce:5000/api/Customers('{customerId}')?$expand=Components")
                     .Method(HttpMethod.Get)
                     .AuthenticateWith("test");
                });
            });

            app.Map("/identity", config =>
            {
                config.UseMvc();
            });
        }

        private byte[] SetCartIdInBody(HttpContext httpContext, byte[] body, string id = "cartId")
        {
            var token = httpContext.User.FindFirst("anonymous_user_id").Value;

            var json = Encoding.Default.GetString(body);
            var o = JObject.Parse(json);
            o[id] = token;

            return Encoding.Default.GetBytes(o.ToString());
        }
    }
}
