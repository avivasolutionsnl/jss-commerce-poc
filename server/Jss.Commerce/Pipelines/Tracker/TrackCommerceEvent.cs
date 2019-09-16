using Sitecore.Analytics.Tracking;
using Sitecore.Commerce.Entities.Prices;
using Sitecore.Commerce.Pipelines;
using Sitecore.Commerce.Pipelines.Carts.Common;
using Sitecore.Commerce.Services.Carts;
using Sitecore.JavaScriptServices.Tracker.Pipelines.TrackEvent;
using Sitecore.Marketing.Definitions.PageEvents;
using System;
using System.Linq;

namespace Jss.Commerce.Pipelines.Tracker
{
    /// <summary>
    /// Track commerce events using the Commerce Connect layer.
    /// Currently this only tracks cartline added and removed events.
    /// </summary>
    public class TrackCommerceEvent : MarketingDefinitionBasedEventProcessor<CommerceEventInstance, IPageEventDefinition>
    {
        private static readonly string LinesAddedEventId = "Lines Added To Cart";
        private static readonly string LinesRemovedEventId = "Lines Removed From Cart";

        protected override bool IsValidEvent(CommerceEventInstance eventInstance)
        {
            return !string.IsNullOrWhiteSpace(eventInstance.CommerceEventId);
        }

        protected override IPageEventDefinition ResolveDefinition(CommerceEventInstance eventInstance, TrackEventPipelineArgs args)
        {
            return this.GetDefinition(Sitecore.Analytics.Tracker.MarketingDefinitions.PageEvents, eventInstance.CommerceEventId);
        }

        protected override void DoTrack(IPageContext pageContext, IPageEventDefinition eventDefinition, CommerceEventInstance eventInstance)
        {
            var request = CreateCartLinesRequest(eventInstance);
            var result = new CartResult { Cart = request.Cart }; // Connect requires result cart to be filled.
            var args = new ServicePipelineArgs(request, result);

            // Trigger Commerce Connect Analytics processor
            var trigger = new TriggerCartLinesPageEvent()
            {
                Name = eventInstance.CommerceEventId,
                Text = eventInstance.CommerceEventId //Text equals id in practice, so for simplicity reuse it
            };
            trigger.Process(args);
        }

        protected CartLinesRequest CreateCartLinesRequest(CommerceEventInstance eventInstance)
        {
            var cart = MapEventToCartEntity(eventInstance);
            var lines = cart.Lines; // Only the modified lines are passed in the event, so modified equal total cart lines
            CartLinesRequest request;

            if (eventInstance.CommerceEventId == LinesAddedEventId) //TODO: When there will be more events implemented, create an enum thats more maintainable.
            {
                request = new AddCartLinesRequest(cart, lines);
            }
            else if (eventInstance.CommerceEventId == LinesRemovedEventId)
            {
                request = new RemoveCartLinesRequest(cart, lines);
            }
            else
            {
                throw new NotImplementedException($"Tracking for CommerceEvent with id {eventInstance.CommerceEventId} not implemented");
            }

            request.Shop = new Sitecore.Commerce.Entities.Shop { Name = eventInstance.ShopName };

            return request;
        }

        protected Sitecore.Commerce.Entities.Carts.Cart MapEventToCartEntity(CommerceEventInstance eventInstance)
        {
            var cartLines = eventInstance.CartLines.Select(line => new Sitecore.Commerce.Entities.Carts.CartLine
            {
                Product = new Sitecore.Commerce.Entities.Carts.CartProduct
                {
                    ProductId = line.Product,
                    Price = new Price { Amount = line.Price },
                    ProductName = line.ProductName
                },
                Quantity = line.Quantity
            }).ToList();

            return new Sitecore.Commerce.Entities.Carts.Cart { Lines = cartLines };
        }
    }
}