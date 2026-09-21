# Thessia U3 forge report — 2026-09-19

## Input

The local `thessia-scholar-v3` model received the U3 enrichment brief: six
main ideas, the official CONTENIDOS anchor, the Analysis → Lab → Workshop
spine, the critical circulation layer, and the new tribunal/readability rules.

## Raw response

The response was rejected. It returned invented frontmatter (`affiliation`, a
different degree, an invented date, DOI placeholder, and a model version),
terminal-control characters from the interactive Ollama stream, only 379 words,
and an incomplete structure. It also introduced unsupported “failing fast,”
user-testing, SWOT, and institutional claims. The output was retained as a
negative example in `/private/tmp/ct-u3-thessia-draft.md` during this run and
was not copied into student-facing files.

## Human evaluation

| Gate | Result | Action |
| --- | --- | --- |
| Student metadata firewall | Fail | Rebuilt frontmatter and removed invented affiliation/date/degree. |
| Grounding fidelity | Fail | Removed unsupported claims and kept candidate sources as pending. |
| Tribune readability | Partial | The raw draft had short fragments but no usable argument; rewritten as one claim, example, and question per idea. |
| Required lesson spine | Fail | Rebuilt Analysis, six Masterclass ideas, two Lab exercises, Workshop, Conclusion, References, and Editorial note. |
| Deck contract | Fail | Created a matching 13-slide U3 deck with exactly two Lab exercises. |

## Integrated result

The accepted U3 lesson and deck are deliberately conservative: they teach a
reversible prototype/checkpoint loop, identify circulation and labour/GenAI
authorship as critical context, and keep Kelley, Beghetto & Karwowski, Cross,
Buchanan, and Schön as honest pending references. The new harness rules now
require this chunked readability review and prohibit editor/workflow metadata
from student surfaces except the final Editorial note and demanded TTOD index.
