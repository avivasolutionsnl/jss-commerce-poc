using Poortwachter.Builder;


namespace Poortwachter.Formatter
{
    public static class DownstreamBuilderExtensions
    {
        public static DownstreamBuilder To(this UpstreamBuilder builder, string downstreamPath)
        {
            return builder.To(context =>
            {
                return new StringVariableReplacer().Format(downstreamPath, context.Variables);
            });
        }
    }
}
