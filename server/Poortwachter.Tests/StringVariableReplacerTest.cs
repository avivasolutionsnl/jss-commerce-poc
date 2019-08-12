using Poortwachter.Formatter;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Xunit;

namespace Poortwachter.Tests
{
    public class StringVariableReplacerTest
    {
        [Fact]
        public void Should_replace_with_variable()
        {
            var formatter = new StringVariableReplacer();

            var result = formatter.Format("/cart/{cartId}", new Dictionary<string, string>
            {
                { "cartId", "me" }
            });
            
            Assert.Equal("/cart/me", result);
        }

        [Fact]
        public void Should_replace_with_multiple_variables()
        {
            var formatter = new StringVariableReplacer();

            var result = formatter.Format("/cart/{cartId}/{customerId}", new Dictionary<string, string>
            {
                { "cartId", "me" },
                { "customerId", "1234" }
            });

            Assert.Equal("/cart/me/1234", result);
        }
    }

}
