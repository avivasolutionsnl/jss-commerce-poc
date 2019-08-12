using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Poortwachter.Formatter
{
    public class StringVariableReplacer
    {
        public string Format(string path, Dictionary<string, string> values)
        {
            string pattern = @"(?<start>\{)+(?<property>[\w\.\[\]\ ]+)(?<format>:[^}]+)?(?<end>\})+";

            return Regex.Replace(path, pattern, match =>
            {
                var propertyGroup = match.Groups["property"];

                return values[propertyGroup.Value];
            }, RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.IgnoreCase);
        }
    }
}
