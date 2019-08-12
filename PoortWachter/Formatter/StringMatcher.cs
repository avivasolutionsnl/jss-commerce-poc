using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Poortwachter.Formatter
{
    public class StringMatcher
    {
        private readonly string pattern;

        public StringMatcher(string pattern)
        {
            this.pattern = pattern;
        }

        public MatchResult Match(string path)
        {
            var pattern = Regex.Replace(this.pattern, "{(?<value>.*?)}", "(?<$1>.*)");
            var regex = new Regex(pattern, RegexOptions.Compiled);

            var m = regex.Match(path);

            if (!m.Success)
            {
                return new MatchResult { Success = false };
            }

            var result = new MatchResult { Success = true};

            foreach (string group in regex.GetGroupNames().Skip(1))
            {
                result.Variables.Add(group, m.Groups[group].Value);
            }

            return result;
        }

    }

    public class MatchResult
    {
        public bool Success { get; set; }

        public Dictionary<string, string> Variables { get; set; }

        public MatchResult()
        {
            Variables = new Dictionary<string, string>();
        }
    }
}
