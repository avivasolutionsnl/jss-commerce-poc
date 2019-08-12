using Microsoft.AspNetCore.Http;
using Poortwachter.Model;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Poortwachter
{
    internal class RequestMapper
    {
        public async Task<HttpRequestMessage> Map(HttpContext context, ReRoute route)
        {
            var downstreamUri = route.GetDownstreamUri(context);

            var requestMessage = new HttpRequestMessage(route.DownstreamMethod, downstreamUri);

            requestMessage.Content = MapContent(context, route);

            foreach (var header in context.Request.Headers.Where(x => !x.Key.StartsWith("Content-")))
            {
                requestMessage.Headers.Add(header.Key, header.Value.ToArray());
            }

            var headerModifications = route.GetRequestHeaderModifications();

            foreach (var headerAction in headerModifications)
            {
                headerAction(requestMessage.Headers);
            }

            return requestMessage;
        }

        private HttpContent MapContent(HttpContext context, ReRoute route)
        {
            Byte[] from = GetRequestBody(context.Request);

            Byte[] copy = route.TransformRequestBody(context, from);

            if(copy == null)
            {
                return null;
            }

            var content = new ByteArrayContent(copy);

            foreach (var header in context.Request.Headers.Where(x => x.Key.StartsWith("Content-")))
            {
                content.Headers.Add(header.Key, header.Value.ToArray());
            }

            content.Headers.Remove("Content-Length");
            content.Headers.TryAddWithoutValidation("Content-Length", copy.Length.ToString());

            return content;
        }

        private Byte[] GetRequestBody(HttpRequest request)
        {
            if (!request.Body.CanSeek || request.Body.Length == 0)
            {
                return null;
            }

            using (var ms = new MemoryStream())
            {
                request.Body.CopyTo(ms);

                return ms.ToArray();
            }
        }
    }
}
