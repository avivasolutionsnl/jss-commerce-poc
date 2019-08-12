using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Poortwachter.Builder
{
    public class ResponseHeaderBuilder
    {
        private List<Action<IHeaderDictionary>> actions;

        public ResponseHeaderBuilder(List<Action<IHeaderDictionary>> actions)
        {
            this.actions = actions;
        }

        public ResponseHeaderBuilder Clear()
        {
            actions.Add(headers => headers.Clear());
            return this;
        }

        public ResponseHeaderBuilder Remove(string key)
        {
            actions.Add(headers => headers.Remove(key));
            return this;
        }

        public ResponseHeaderBuilder AddHeader(string key, string value)
        {
            actions.Add(headers => headers.Add(key, value));
            return this;
        }
    }
}
