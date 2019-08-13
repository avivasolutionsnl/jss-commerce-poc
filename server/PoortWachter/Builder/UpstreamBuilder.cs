using Microsoft.AspNetCore.Http;
using Poortwachter.Model;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Poortwachter.Builder
{
    public class UpstreamBuilder
    {    
        private ReRouteConfiguration route;

        public UpstreamBuilder(ReRouteConfiguration route)
        {
            this.route = route;
        }

        public UpstreamBuilder Method(HttpMethod method)
        {
            route.UpstreamMethod = method;
            return this;
        }

        public DownstreamBuilder To(Func<Context, string> factory)
        {
            route.DownstreamFactory = (context, httpcontext) => factory(context);
            return new DownstreamBuilder(route);
        }

        public DownstreamBuilder To(Func<Context, HttpContext, string> factory)
        {
            route.DownstreamFactory = factory;
            return new DownstreamBuilder(route);
        }
    }
}
