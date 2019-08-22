using Sitecore.Diagnostics;
using Sitecore.LayoutService.Serialization;
using Sitecore.LayoutService.Serialization.Pipelines.GetFieldSerializer;

namespace Jss.Commerce.Pipelines.GetFieldSerializer
{
    public class GetProductExcludingMultilistFieldSerializer : BaseGetFieldSerializer
    {
        public GetProductExcludingMultilistFieldSerializer(IFieldRenderer fieldRenderer)
          : base(fieldRenderer)
        {
        }

        protected override void SetResult(GetFieldSerializerPipelineArgs args)
        {
            Assert.ArgumentNotNull(args, nameof(args));
            Assert.IsNotNull(args.Field, "args.Field is null");
            Assert.IsNotNull(args.ItemSerializer, "args.ItemSerializer is null");
            args.Result = new ProductExcludingMultilistFieldSerializer(args.ItemSerializer, FieldRenderer);
        }
    }
}