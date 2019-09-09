using Sitecore.Commerce.Engine.Connect;
using Sitecore.Commerce.Engine.Connect.Interfaces;
using Sitecore.Commerce.Engine.Connect.Search;
using Sitecore.ContentSearch.Utilities;
using Sitecore.Data.Fields;
using Sitecore.LayoutService.Configuration;
using Sitecore.LayoutService.ItemRendering.ContentsResolvers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Jss.Commerce.ContentResolvers
{
    public class ProductsContentResolver : RenderingContentsResolver
    {
        public override object ResolveContents(Sitecore.Mvc.Presentation.Rendering rendering, IRenderingConfiguration renderingConfig)
        {
            var contextItem = GetContextItem(rendering, renderingConfig);
            if (contextItem == null)
            {
                return new { };
            }

            var selectionField = (DatasourceField)contextItem.Fields[Templates.Products.Selection];

            var query = selectionField.Value;
            if (String.IsNullOrEmpty(query))
            {
                return new { };
            }

            var searchItems = new List<CommerceSellableItemSearchResultItem>();
            var searchManager = CommerceTypeLoader.CreateInstance<ICommerceSearchManager>();
            using (var context = searchManager.GetIndex().CreateSearchContext())
            {
                var searchStringModels = SearchStringModel.ParseDatasourceString(query);

                searchItems = LinqHelper.CreateQuery<CommerceSellableItemSearchResultItem>(context, searchStringModels)
                    .Where(x => x.CommerceSearchItemType == CommerceSearchItemType.SellableItem)
                    .Where(x => x.Language == Sitecore.Context.Language.Name)
                    .ToList();
            }

            searchItems = searchItems
                .GroupBy(x => x.ProductId)
                .Select(x => x.First())
                .ToList();

            // Create products from search result
            var products = new List<object>();
            foreach (var searchItem in searchItems)
            {
                var sitecoreItem = searchItem.GetItem();
               
                // Add variants
                if (sitecoreItem.HasChildren)
                {
                    foreach (Sitecore.Data.Items.Item child in sitecoreItem.GetChildren())
                    {
                        products.Add(GetProduct(searchItem, sitecoreItem, child.Name));
                    }
                }
                // No variants add single product
                else
                {
                    products.Add(GetProduct(searchItem, sitecoreItem));
                }
            }

            return new
            {
                Heading = ((TextField)contextItem.Fields[Templates.Products.Heading]).Value,
                Products = products.ToArray()
            };
        }

        private object GetProduct(CommerceSellableItemSearchResultItem searchItem, Sitecore.Data.Items.Item sitecoreItem, string variantId = null)
        {
            MultilistField field = sitecoreItem.Fields["Images"];
            var imageId = field.Items?.First();

            return new
            {
                searchItem.Path,
                searchItem.ProductId,
                searchItem.DisplayName,
                Description = sitecoreItem["Description"],
                ImageId = imageId,
                VariantId = variantId
            };
        }
    }
}