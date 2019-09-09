using Sitecore.Data;

namespace Jss.Commerce
{
    public struct Templates
    {
        public struct CategoryNavigation
        {
            public static readonly ID StartingPoint = new ID("{090E6B82-1C24-57AB-9BF2-A7A4505315DE}");
        }

        public struct Product
        {
            public static readonly ID ID = new ID("{225F8638-2611-4841-9B89-19A5440A1DA1}");
        }
        
        public struct Category
        {
            public static readonly ID ID = new ID("{4C4FD207-A9F7-443D-B32A-50AA33523661}");
        }

        public struct Products
        {
            public static readonly ID Heading = new ID("{60CAA2BF-F086-4AB2-9DDD-7416EC9AC4BF}");
            public static readonly ID Selection = new ID("{C42B5CBE-AB27-477A-8D09-1CD67A91A470}");
        }
    }
}