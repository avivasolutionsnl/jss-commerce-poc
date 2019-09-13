using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Jss.Commerce.Pipelines.Tracker
{
    /// <summary>
    /// Commerce tracking event instance. Named accordingly to JSS naming (e.g. EventInstance, GoalInstance).
    /// Currently this supports a subset of fields that are required for cart line added/removed tracking.
    /// </summary>
    public class CommerceEventInstance
    {
        /// <summary>
        /// Minimum set of cart line fields that is required for tracking.
        /// Currently only used as JSON parser definition, and only inside a CommerceEventInstance 
        /// and therefore modelled as inner class.
        /// </summary>
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