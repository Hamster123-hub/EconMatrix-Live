
text = 'having handled ***1,002,232 ***twenty-foot equivalent units'
import re
regex = re.compile(r'(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*||\[.*?\]\(.*?\)|$math$.*?$math$|<b[^>]*>.*?</b>|<strong[^>]*>.*?</strong>|https?://[^\s<]+[^<.,:;"'\)\]\s])', re.IGNORECASE)
parts = regex.split(text)
print('Parts count:', len(parts))
print('Parts:', parts)
