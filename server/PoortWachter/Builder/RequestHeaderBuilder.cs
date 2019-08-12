using System;
using System.Collections.Generic;
using System.Net.Http.Headers;

namespace Poortwachter.Builder
{
    public class RequestHeaderBuilder
    {
        private List<Action<HttpHeaders>> actions;

        public RequestHeaderBuilder(List<Action<HttpHeaders>> actions)
        {
            this.actions = actions;
        }

        public RequestHeaderBuilder Clear()
        {
            actions.Add(headers => headers.Clear());
            return this;
        }

        public RequestHeaderBuilder Remove(string key)
        {
            actions.Add(headers => headers.Remove(key));
            return this;
        }

        public RequestHeaderBuilder AddHeader(string key, string value)
        {
            actions.Add(headers => headers.Add(key, value));
            return this;
        }
    }
}
