using Newtonsoft.Json;
using Sitecore.Commerce;
using Sitecore.Commerce.Products;
using Sitecore.Configuration;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Serialization;
using Sitecore.LayoutService.Serialization.FieldSerializers;
using Sitecore.LayoutService.Serialization.ItemSerializers;

namespace Jss.Commerce.Pipelines.GetFieldSerializer
{
    /// <summary>
    /// Custom version the MultilistFieldSerializer that prevents product relations from getting
    /// serialized. With the default MultilistFieldSerializer, the entire site will crash because it tries
    /// to serialize all recursive product relations.
    /// </summary>
    public class ProductExcludingMultilistFieldSerializer : BaseFieldSerializer
    {
        private readonly ID productTemplateId = new ID("{225F8638-2611-4841-9B89-19A5440A1DA1}");
        protected readonly IItemSerializer ItemSerializer;

        public ProductExcludingMultilistFieldSerializer(IItemSerializer itemSerializer, IFieldRenderer fieldRenderer)
          : base(fieldRenderer)
        {
            Assert.ArgumentNotNull(itemSerializer, nameof(itemSerializer));
            ItemSerializer = itemSerializer;
        }

        public override void Serialize(Field field, JsonTextWriter writer)
        {
            Assert.ArgumentNotNull(field, nameof(field));
            Assert.ArgumentNotNull(writer, nameof(writer));

            using (RecursionLimit recursionLimit = new RecursionLimit(string.Format("{0}|{1}|{2}", GetType().FullName, field.Item.ID, field.ID), 1))
            {
                if (recursionLimit.Exceeded)
                {
                    return;
                }

                Item[] items = ((MultilistField)field).GetItems();
                if (items == null || items.Length == 0)
                {
                    writer.WritePropertyName(field.Name);
                    writer.WriteStartArray();
                    writer.WriteEndArray();
                }
                else
                {
                    writer.WritePropertyName(field.Name);
                    writer.WriteStartArray();
                    foreach (Item obj in items)
                    {
                        if (obj.IsDerived(productTemplateId))
                        {
                            continue;
                        }

                        writer.WriteStartObject();
                        writer.WritePropertyName("id");
                        writer.WriteValue(obj.ID.Guid.ToString());
                        writer.WritePropertyName("fields");
                        writer.WriteRawValue(ItemSerializer.Serialize(obj));
                        writer.WriteEndObject();
                    }
                    writer.WriteEndArray();
                }
            }
        }
    }
}