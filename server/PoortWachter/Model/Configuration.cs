using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;

namespace Poortwachter.Model
{
    public  class Configuration
    {
        public List<ReRouteConfiguration> Routes { get; set; }

        public Func<Context, List<Action<IHeaderDictionary>>> ResponseHeaderModificationsFactory { get; internal set; }

        public Func<Context, List<Action<HttpHeaders>>> RequestHeaderModificationsFactory { get; internal set; }
        public string AuthenticationScheme { get; internal set; }

        public Configuration()
        {
            Routes = new List<ReRouteConfiguration>();
        }

        public void AddRoute(ReRouteConfiguration route)
        {
            Routes.Add(route);
        }
    }
}
