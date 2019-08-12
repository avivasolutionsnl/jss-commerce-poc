using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace Poortwachter.Model
{
    public class Context
    {
        public Dictionary<string, string> Variables { get; set; }

        public Context()
        {
            Variables = new Dictionary<string, string>();
        }

    }
}
