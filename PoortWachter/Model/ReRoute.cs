using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;

namespace Poortwachter.Model
{
    public class ReRoute
    {
        private Context context = new Context();
        private readonly Configuration globalConfig;
        private ReRouteConfiguration config;

        public string AuthenticationScheme
        {
            get
            {
                return globalConfig.AuthenticationScheme ?? config.AuthenticationScheme;
            }
        }

        public HttpMethod UpstreamMethod
        {
            get
            {
                return config.UpstreamMethod;
            }
        }

        public HttpMethod DownstreamMethod
        {
            get
            {
                return config.DownstreamMethod;
            }
        }

        public Byte[] TransformRequestBody(HttpContext httpContext, Byte[] ms)
        {
            if(config.TansformRequestBody == null)
            {
                return ms;
            }

            return config.TansformRequestBody(context, httpContext, ms);
        }

        public ReRoute(Configuration globalConfig, ReRouteConfiguration config)
        {
            this.globalConfig = globalConfig;
            this.config = config;
        }
        
        public bool IsMatch(HttpRequest request)
        {
            return config.UpstreamMatcher(context, request) && request.Method == UpstreamMethod.ToString();
        }

        public string GetDownstreamUri(HttpContext httpContext)
        {
            return config.DownstreamFactory(context, httpContext);
        }

        public IEnumerable<Action<HttpHeaders>> GetRequestHeaderModifications()
        {
            var globalRequestHeaders = globalConfig.RequestHeaderModificationsFactory != null ?
                globalConfig.RequestHeaderModificationsFactory(context) :
                new List<Action<HttpHeaders>>();

            var requestHeaders = config.RequestHeaderModificationsFactory != null ? 
                config.RequestHeaderModificationsFactory(context) : 
                new List<Action<HttpHeaders>>();

            return globalRequestHeaders.Union(requestHeaders);
        }

        public IEnumerable<Action<IHeaderDictionary>> GetResponseHeaderModifications()
        {
            var globalResponseHeaders = globalConfig.ResponseHeaderModificationsFactory != null ?
                globalConfig.ResponseHeaderModificationsFactory(context) :
                new List<Action<IHeaderDictionary>>();

            var responseHeaders = config.ResponseHeaderModificationsFactory != null ? 
                config.ResponseHeaderModificationsFactory(context) : 
                new List<Action<IHeaderDictionary>>();

            return globalResponseHeaders.Union(responseHeaders);
        }
    }
}
