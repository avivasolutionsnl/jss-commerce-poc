using Microsoft.AspNetCore.Http;
using Poortwachter.Model;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;

namespace Poortwachter.Builder
{
    public class OptionalBuilder
    {
        private readonly ReRouteConfiguration route;

        public OptionalBuilder(ReRouteConfiguration route)
        {
            this.route = route;
        }

        public OptionalBuilder AuthenticateWith(string scheme)
        {
            route.AuthenticationScheme = scheme;

            return this;
        }

        public OptionalBuilder ModifyRequestHeaders(Action<Context, RequestHeaderBuilder> config)
        {
            route.RequestHeaderModificationsFactory = context => {
                var modification = new List<Action<HttpHeaders>>();
                config(context, new RequestHeaderBuilder(modification));
                return modification;
            };

            return this;
        }

        public OptionalBuilder ModifyResponseHeaders(Action<Context, ResponseHeaderBuilder> config)
        {
            route.ResponseHeaderModificationsFactory = context => {
                var modification = new List<Action<IHeaderDictionary>>();
                config(context, new ResponseHeaderBuilder(modification));
                return modification;
            };

            return this;
        }
    }
}
