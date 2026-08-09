from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Flowable,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path(r"E:\MData\Kennis\personal\inbox\python-mini-challenge-pack.pdf")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#17212B")
GREEN = colors.HexColor("#2D8F6F")
MINT = colors.HexColor("#E7F4EE")
PALE = colors.HexColor("#F4F7F6")
INK = colors.HexColor("#26343D")
MUTED = colors.HexColor("#5C6B73")
LINE = colors.HexColor("#D9E2DE")
CODE_BG = colors.HexColor("#202B33")
CODE_FG = colors.HexColor("#E9F5EF")


class HorizontalRule(Flowable):
    def __init__(self, width=170 * mm, color=LINE):
        super().__init__()
        self.width = width
        self.height = 1
        self.color = color

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(0.7)
        self.canv.line(0, 0, self.width, 0)


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="PackTitle", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=28, leading=32, textColor=NAVY, alignment=TA_LEFT,
    spaceAfter=10,
))
styles.add(ParagraphStyle(
    name="PackSubtitle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=13, leading=19, textColor=MUTED, spaceAfter=16,
))
styles.add(ParagraphStyle(
    name="Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=8.5, leading=11, textColor=GREEN, uppercase=True, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Section", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=21, leading=25, textColor=NAVY, spaceBefore=4, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="Subsection", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=13, leading=17, textColor=NAVY, spaceBefore=9, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="BodyPack", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=10.2, leading=15, textColor=INK, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="SmallPack", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="CalloutPack", parent=styles["BodyText"], fontName="Helvetica-Bold",
    fontSize=10.2, leading=15, textColor=NAVY, spaceAfter=0,
))
styles.add(ParagraphStyle(
    name="CodePack", parent=styles["Code"], fontName="Courier",
    fontSize=8.5, leading=11.2, textColor=CODE_FG, leftIndent=0,
    rightIndent=0, spaceAfter=0,
))
styles.add(ParagraphStyle(
    name="CheckPack", parent=styles["Code"], fontName="Courier",
    fontSize=8.1, leading=10.5, textColor=CODE_FG, leftIndent=0,
    rightIndent=0, spaceAfter=0,
))


def p(text, style="BodyPack"):
    return Paragraph(escape(text), styles[style])


def rich(text, style="BodyPack"):
    return Paragraph(text, styles[style])


def code_box(text, check=False):
    block = Preformatted(text.strip("\n"), styles["CheckPack" if check else "CodePack"])
    table = Table([[block]], colWidths=[170 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#334650")),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return table


def callout(text):
    table = Table([[Paragraph(escape(text), styles["CalloutPack"])]], colWidths=[170 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MINT),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#B5DCC8")),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return table


def numbered(items):
    return [p(f"{index}. {item}") for index, item in enumerate(items, 1)]


def bullet_items(items):
    return [p(f"- {item}") for item in items]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(20 * mm, 16 * mm, 190 * mm, 16 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 10 * mm, "Python Mini Challenge Pack")
    canvas.drawRightString(190 * mm, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()


story = []

# Cover
story.extend([
    Spacer(1, 27 * mm),
    rich("PYTHON PRACTICE", "Eyebrow"),
    rich("Three small problems.\nOne stronger Python habit.", "PackTitle"),
    p("A focused challenge pack for beginners who want to practise problem-solving instead of only watching tutorials.", "PackSubtitle"),
    Spacer(1, 6 * mm),
    callout("Work independently, use the hints only when needed, then compare your approach with the answer key."),
    Spacer(1, 15 * mm),
    rich("INSIDE", "Eyebrow"),
    *bullet_items([
        "Three short exercises with clear acceptance checks.",
        "Three increasingly specific hints for each challenge.",
        "A complete answer key for self-review or tutoring.",
    ]),
    Spacer(1, 8 * mm),
    HorizontalRule(),
    Spacer(1, 5 * mm),
    p("Recommended starting knowledge: variables, lists, functions, and basic if statements.", "SmallPack"),
    p("Practice note: write your own solution. Do not submit the answer key as schoolwork.", "SmallPack"),
    PageBreak(),
])

# Challenge 1
story.extend([
    rich("CHALLENGE 01", "Eyebrow"),
    rich("Top words", "Section"),
    p("Write top_words(text, limit=3). Return (word, count) pairs sorted by count descending and then word alphabetically. Ignore punctuation, treat uppercase and lowercase as the same, and raise ValueError when limit is negative."),
    rich("Starter code", "Subsection"),
    code_box("""
def top_words(text, limit=3):
    pass
"""),
    rich("Check your work", "Subsection"),
    code_box("""
assert top_words('Cat dog cat bird dog cat', 2) == [('cat', 3), ('dog', 2)]
assert top_words('zebra ant zebra ant', 2) == [('ant', 2), ('zebra', 2)]
try:
    top_words('hello', -1)
except ValueError:
    pass
else:
    raise AssertionError('negative limit should fail')
""", check=True),
    rich("Hint ladder", "Subsection"),
    *numbered([
        "Normalize the text before counting.",
        "A dictionary can store each word's count.",
        "Sort with a key containing (-count, word).",
    ]),
    Spacer(1, 4 * mm),
    callout("Core idea: separate the problem into cleaning, counting, and ordering."),
    PageBreak(),
])

# Challenge 2
story.extend([
    rich("CHALLENGE 02", "Eyebrow"),
    rich("Average positive numbers", "Section"),
    p("Write average_positive(numbers). Return the average of values strictly greater than zero. Ignore zero and negative values. Raise ValueError when there are no positive values."),
    rich("Starter code", "Subsection"),
    code_box("""
def average_positive(numbers):
    pass
"""),
    rich("Check your work", "Subsection"),
    code_box("""
assert average_positive([2, 4, 6]) == 4
assert average_positive([-4, 0, 2, 4]) == 3
try:
    average_positive([-1, 0])
except ValueError:
    pass
else:
    raise AssertionError('no positive values should fail')
""", check=True),
    rich("Hint ladder", "Subsection"),
    *numbered([
        "The word strictly means value > 0.",
        "Collect the accepted values before dividing.",
        "Validate that the collection is not empty before calling sum and len.",
    ]),
    Spacer(1, 4 * mm),
    callout("Core idea: validate the edge case before doing the calculation."),
    PageBreak(),
])

# Challenge 3
story.extend([
    rich("CHALLENGE 03", "Eyebrow"),
    rich("Binary search", "Section"),
    p("Write binary_search(values, target). The input list is sorted. Return the index of target, or -1 when it is absent. Do not use list.index."),
    rich("Starter code", "Subsection"),
    code_box("""
def binary_search(values, target):
    pass
"""),
    rich("Check your work", "Subsection"),
    code_box("""
assert binary_search([1, 3, 5, 7, 9], 5) == 2
assert binary_search([1, 3, 5, 7, 9], 9) == 4
assert binary_search([1, 3, 5, 7, 9], 4) == -1
""", check=True),
    rich("Hint ladder", "Subsection"),
    *numbered([
        "Track the inclusive low and high boundaries.",
        "Compare the middle value and discard the half that cannot contain the target.",
        "Continue while low <= high; move a boundary past middle after each comparison.",
    ]),
    Spacer(1, 4 * mm),
    callout("Core idea: one comparison can remove half of the remaining search space."),
    PageBreak(),
])

# Answer key
story.extend([
    rich("ANSWER KEY", "Eyebrow"),
    rich("Compare, do not copy", "Section"),
    p("Use the reference solutions after you have made a serious attempt. Read the code line by line and explain why each edge case is handled."),
    rich("1. Top words", "Subsection"),
    code_box("""
def top_words(text, limit=3):
    if limit < 0:
        raise ValueError('limit cannot be negative')
    cleaned = ''.join(char for char in text.lower()
                      if char.isalnum() or char.isspace())
    counts = {}
    for word in cleaned.split():
        counts[word] = counts.get(word, 0) + 1
    return sorted(counts.items(),
                  key=lambda item: (-item[1], item[0]))[:limit]
"""),
    rich("2. Average positive numbers", "Subsection"),
    code_box("""
def average_positive(numbers):
    positives = [number for number in numbers if number > 0]
    if not positives:
        raise ValueError('no positive numbers')
    return sum(positives) / len(positives)
"""),
    rich("3. Binary search", "Subsection"),
    code_box("""
def binary_search(values, target):
    low, high = 0, len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1
"""),
    Spacer(1, 5 * mm),
    callout("Next step: change one requirement, add one test, and make the solution handle it honestly."),
])


doc = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4,
    leftMargin=20 * mm, rightMargin=20 * mm,
    topMargin=18 * mm, bottomMargin=22 * mm,
    title="Python Mini Challenge Pack",
    author="Python Practice",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
