using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Jss.Commerce.Pipelines.Tracker
{
    [Serializable]
    public class CommerceEventInstance
    {
        public class CartLine
        {
            public string Product { get; set; }
            public decimal Price { get; set; }
            public string ProductName { get; set; }
            public decimal Quantity { get; set; }
        }

        public string CommerceEventId { get; set; }

        public string ShopName { get; set; }

        public List<CartLine> CartLines { get; set; }

        [JsonExtensionData]
        public IDictionary<string, object> AdditionalData { get; set; }
    }
}