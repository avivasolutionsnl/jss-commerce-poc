using Sitecore;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Data.Managers;
using Sitecore.Data.Templates;
using System.Linq;

namespace Jss.Commerce
{
    public static class ItemExtensions
    {
        public static bool IsDerived([NotNull] this Item item, [NotNull] ID templateId)
        {
            return TemplateManager.GetTemplate(item).IsDerived(templateId);
        }

        public static bool IsDerived([NotNull] this Template template, [NotNull] ID templateId)
        {
            return template.ID == templateId || template.GetBaseTemplates().Any(baseTemplate => IsDerived(baseTemplate, templateId));
        }
    }
}