using Poortwachter.Formatter;
using System;
using System.Collections.Generic;
using Xunit;

namespace Poortwachter.Tests
{
    public class StringMatcherTest
    {
        [Fact]
        public void Should_extract_variable()
        {
            var matcher = new StringMatcher("/cart/{cartId}");

            var result = matcher.Match("/cart/me");

            Assert.True(result.Success);

            Assert.Equal(new Dictionary<string, string>
            {
                { "cartId", "me" }
            }, result.Variables);
        }

        [Fact]
        public void Should_extract_multiple_variables()
        {
            var matcher = new StringMatcher("/cart/{cartId}/{customerId}");

            var result = matcher.Match("/cart/me/343434");

            Assert.True(result.Success);

            Assert.Equal(new Dictionary<string, string>
            {
                { "cartId", "me" },
                { "customerId", "343434" }
            }, result.Variables);
        }

        [Fact]
        public void Should_match_path_without_variables()
        {
            var matcher = new StringMatcher("/cart/me");

            var result = matcher.Match("/cart/me");

            Assert.True(result.Success);
        }
    }
}
