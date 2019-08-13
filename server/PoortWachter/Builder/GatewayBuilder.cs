using Microsoft.AspNetCore.Http;
using Poortwachter.Model;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;

namespace Poortwachter.Builder
{
    public class GatewayBuilder
    {
        private readonly Configuration configuration;

        public GatewayBuilder(Configuration configuration)
        {
            this.configuration = configuration;
        }

        public GatewayBuilder ModifyGlobalRequestHeaders(Action<Context, RequestHeaderBuilder> config)
        {
            configuration.RequestHeaderModificationsFactory = context => {
                var modification = new List<Action<HttpHeaders>>();
                config(context, new RequestHeaderBuilder(modification));
                return modification;
            };

            return this;
        }

        public GatewayBuilder ModifyGlobalResponseHeaders(Action<Context, ResponseHeaderBuilder> config)
        {
            configuration.ResponseHeaderModificationsFactory = context => {
                var modification = new List<Action<IHeaderDictionary>>();
                config(context, new ResponseHeaderBuilder(modification));
                return modification;
            };

            return this;
        }

        public GatewayBuilder GlobalAuthenticateWith(string scheme)
        {
            configuration.AuthenticationScheme = scheme;
            return this;
        }

        public UpstreamBuilder ReRoute(Func<Context, HttpRequest, bool> match)
        {
            var route = new ReRouteConfiguration
            {
                UpstreamMatcher = match
            };

            configuration.AddRoute(route);

            return new UpstreamBuilder(route);
        }
    }
}
