using Poortwachter.Builder;

namespace Poortwachter.Formatter
{
    public static class GatewayBuilderExtensions
    {
        public static UpstreamBuilder ReRoute(this GatewayBuilder builder, string match)
        {
            return builder.ReRoute((context, request) =>
                {
                var result = new StringMatcher(match).Match(request.Path);

                foreach (var keyPair in result.Variables)
                {
                    context.Variables.Add(keyPair.Key, keyPair.Value);
                }

                return result.Success;
            });
        }
    }
}
