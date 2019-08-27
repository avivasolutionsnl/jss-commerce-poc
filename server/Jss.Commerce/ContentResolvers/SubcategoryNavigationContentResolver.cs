using Sitecore.Commerce.Engine.Connect;
using Sitecore.Commerce.Engine.Connect.Interfaces;
using Sitecore.Commerce.Engine.Connect.Search;
using Sitecore.Data;
using Sitecore.LayoutService.Configuration;
using Sitecore.LayoutService.ItemRendering.ContentsResolvers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Jss.Commerce.ContentResolvers
{
    public class SubcategoryNavigationContentResolver : RenderingContentsResolver
    {
        public override object ResolveContents(Sitecore.Mvc.Presentation.Rendering rendering, IRenderingConfiguration renderingConfig)
        {
            var childCategories = GetChildCategories(Sitecore.Context.Item);
            
            return new
            {
                Categories = childCategories.Select(x => new
                {
                    x.ID,
                    Path = x.Paths.FullPath,
                    x.DisplayName,
                    Active = Sitecore.Context.Item.ID == x.ID
                }).ToArray()
            };
        }

        private IEnumerable<Sitecore.Data.Items.Item> GetChildCategories(Sitecore.Data.Items.Item parentCategory)
        {
            if (!parentCategory.IsDerived(Templates.Category.ID))
            {
                return Enumerable.Empty<Sitecore.Data.Items.Item>();
            }

            var childCategories = GetChildCategoriesFromIndex(parentCategory.ID);

            if (!childCategories.Any())
            {
                return GetChildCategories(parentCategory.Parent);
            }

            return childCategories;
        }


        private IEnumerable<Sitecore.Data.Items.Item> GetChildCategoriesFromIndex(ID categorySitecoreId)
        {
            var searchManager = CommerceTypeLoader.CreateInstance<ICommerceSearchManager>();

            var searchIndex = searchManager.GetIndex();

            // TODO: I replicated this from the SXA storefront code.
            // Seems a strange way to get the child categories to me.
            // Why not use ParentCategoryList to query in the index, need to investigate.
            using (var context = searchIndex.CreateSearchContext())
            {
                var category = context.GetQueryable<CommerceCategorySearchResultItem>()
                    .Where(x => x.ItemId == categorySitecoreId)
                    .Where(x => x.Language == Sitecore.Context.Language.Name)
                    .ToList();

                if (category.Count() == 0)
                {
                    return null;
                }

                if (!category[0].Fields.ContainsKey("childrencategorylist"))
                {
                    return Enumerable.Empty< Sitecore.Data.Items.Item>();
                }

                var childrenCategories = category[0]["childrencategorylist"];

                if (string.IsNullOrEmpty(childrenCategories))
                {
                    return null;
                }

                var childrenCategoryIds = childrenCategories.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries);

                return childrenCategoryIds
                    .Select(x => Sitecore.Context.Database.GetItem(new ID(x)));
            }
        }
    }
}