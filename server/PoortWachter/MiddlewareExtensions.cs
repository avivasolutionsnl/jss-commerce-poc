using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Poortwachter.Builder;
using Poortwachter.Model;
using System;
using System.Threading.Tasks;

namespace Poortwachter
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UsePoortwachter(this IApplicationBuilder builder, Action<GatewayBuilder> configure)
        {
            var configuration = new Configuration();

            configure(new GatewayBuilder(configuration));

            return builder.Use(async (context, next) =>
            {
                foreach (ReRouteConfiguration config in configuration.Routes)
                {
                    var route = new ReRoute(configuration, config);

                    if (route.IsMatch(context.Request))
                    {
                        await Forward(context, route);
                    }
                }
            });
        }

        private static async Task Forward(HttpContext context, ReRoute route)
        {
            if (!string.IsNullOrEmpty(route.AuthenticationScheme))
            {
                var result = await context.AuthenticateAsync("test");

                context.User = result.Principal;
            }

            await new Forwarder().Forward(context, route);
        }
    }
}
