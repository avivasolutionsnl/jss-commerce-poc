using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Poortwachter.Model
{
    public class ReRouteConfiguration
    {
        public Func<Context, HttpRequest, bool> UpstreamMatcher { get; set; }

        public Func<Context, HttpContext, string> DownstreamFactory { get; internal set; }

        public string AuthenticationScheme { get; internal set; }

        public Func<Context, List<Action<HttpHeaders>>> RequestHeaderModificationsFactory { get; set; }

        public Func<Context, List<Action<IHeaderDictionary>>> ResponseHeaderModificationsFactory { get; set; }

        public HttpMethod UpstreamMethod { get; internal set; }

        public HttpMethod DownstreamMethod { get; internal set; }

        public Func<Context, HttpContext, Byte[], Byte[]> TansformRequestBody { get; internal set; }
    }
}
