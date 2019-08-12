using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Primitives;
using Poortwachter.Model;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Poortwachter
{
    internal class ResponseMapper
    {
        public async Task Map(HttpContext context, HttpResponseMessage response, ReRoute route)
        {
            foreach (var header in response.Headers)
            {
                context.Response.Headers.Add(header.Key, new StringValues(header.Value.ToArray()));
            }

            foreach (var header in response.Content.Headers)
            {
                context.Response.Headers.Add(header.Key, new StringValues(header.Value.ToArray()));
            }

            var headerModifications = route.GetResponseHeaderModifications();

            foreach (var headerAction in headerModifications)
            {
                headerAction(context.Response.Headers);
            }

            var content = await response.Content.ReadAsStreamAsync();
            context.Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = response.ReasonPhrase;
            context.Response.Headers.Add("Content-Length", new[] { response.Content.Headers.ContentLength.ToString() });
            context.Response.Headers.Remove("Transfer-Encoding");

            context.Response.StatusCode = (int)response.StatusCode;

            using (content)
            {
                if (response.StatusCode != HttpStatusCode.NotModified && context.Response.ContentLength != 0)
                {
                    await content.CopyToAsync(context.Response.Body);
                }
            }
        }
    }
}
