using Microsoft.AspNetCore.Http;
using Poortwachter.Model;
using System;
using System.IO;
using System.Net.Http;

namespace Poortwachter.Builder
{
    public class DownstreamBuilder
    {
        private ReRouteConfiguration route;

        public DownstreamBuilder(ReRouteConfiguration route)
        {
            this.route = route;
        }

        public DownstreamBuilder TransformBody(Func<Context, HttpContext, Byte[], Byte[]> transformBody)
        {
            route.TansformRequestBody = transformBody;
            return new DownstreamBuilder(route);
        }

        public OptionalBuilder Method(HttpMethod method)
        {
            route.DownstreamMethod = method;
            return new OptionalBuilder(route);
        }
    }
}
