using Microsoft.AspNetCore.Http;
using Poortwachter.Model;
using System.Net.Http;
using System.Threading.Tasks;

namespace Poortwachter
{
    internal class Forwarder
    {
        public async Task Forward(HttpContext context, ReRoute route)
        {
            HttpClient client = new HttpClient();

            var requestMessage = await new RequestMapper().Map(context, route);

            var response = await client.SendAsync(requestMessage);

            await new ResponseMapper().Map(context, response, route);
        }
    }
}
