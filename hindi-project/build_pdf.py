# -*- coding: utf-8 -*-
"""'कफ़न' परियोजना — PDF बनाने की स्क्रिप्ट।

चलाने से पहले:
    pip install fpdf2 uharfbuzz fonttools
    python3 build_pdf.py

फ़ॉन्ट (Noto Serif Devanagari) पहली बार चलाने पर स्वचालित रूप से
`.fonts/` फ़ोल्डर में डाउनलोड हो जाते हैं।
"""

from __future__ import annotations

import base64
import json
import re
import os
import sys
import urllib.parse
import urllib.request

from fpdf import FPDF

from content import ACKNOWLEDGEMENT, BLOCKS, META, SIGN

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, ".fonts")
OUT_PDF = os.path.join(HERE, "kafan-project.pdf")
OUT_MD = os.path.join(HERE, "kafan-project.md")

# ---------------------------------------------------------------- रंग और माप
NAVY = (22, 42, 82)
NAVY_SOFT = (232, 236, 246)
GREY = (110, 110, 115)
LIGHT_RULE = (208, 212, 222)
MAROON = (128, 30, 44)

PAGE_W, PAGE_H = 210.0, 297.0
MARGIN_L, MARGIN_R, MARGIN_T, MARGIN_B = 21.0, 21.0, 20.0, 20.0

BODY_SIZE = 11.4
BODY_LH = 6.35

FAMILIES = {
    "SansDeva": "ofl/notosansdevanagari/NotoSansDevanagari[wdth,wght].ttf",
    "SerifDeva": "ofl/notoserifdevanagari/NotoSerifDevanagari[wdth,wght].ttf",
}
WEIGHTS = {"Regular": 400, "SemiBold": 600, "Bold": 700}


def ensure_fonts() -> None:
    """Noto Serif/Sans Devanagari के स्थिर (static) TTF फ़ॉन्ट तैयार करें।"""
    os.makedirs(FONT_DIR, exist_ok=True)
    missing = [
        (fam, w)
        for fam in FAMILIES
        for w in WEIGHTS
        if not os.path.exists(os.path.join(FONT_DIR, f"{fam}-{w}.ttf"))
    ]
    if not missing:
        return

    try:
        from fontTools.ttLib import TTFont
        from fontTools.varLib.instancer import instantiateVariableFont
    except ImportError:  # pragma: no cover
        sys.exit("fonttools नहीं मिला — कृपया `pip install fonttools` चलाएँ।")

    for fam in FAMILIES:
        if not any(m[0] == fam for m in missing):
            continue
        url = "https://api.github.com/repos/google/fonts/contents/" + urllib.parse.quote(
            FAMILIES[fam]
        )
        req = urllib.request.Request(url, headers={"User-Agent": "kafan-project"})
        print(f"↓ डाउनलोड: {fam} …")
        data = json.load(urllib.request.urlopen(req, timeout=120))
        raw = os.path.join(FONT_DIR, f"{fam}-variable.ttf")
        with open(raw, "wb") as fh:
            fh.write(base64.b64decode(data["content"]))
        for weight, value in WEIGHTS.items():
            font = TTFont(raw)
            inst = instantiateVariableFont(font, {"wght": value, "wdth": 100})
            inst.save(os.path.join(FONT_DIR, f"{fam}-{weight}.ttf"))
        os.remove(raw)


def T(text: str) -> str:
    """सीधे अकेले उद्धरण चिह्नों को टाइपोग्राफ़िक ‘…’ में बदलें।"""
    out, opened = [], False
    for ch in text:
        if ch == "'":
            out.append("\u2018" if not opened else "\u2019")
            opened = not opened
        else:
            out.append(ch)
    return "".join(out)


class ProjectPDF(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_margins(MARGIN_L, MARGIN_T, MARGIN_R)
        self.set_auto_page_break(True, MARGIN_B - 2)
        self.set_title(META["title"])
        self.set_author("विद्यार्थी — हिन्दी परियोजना")
        self.set_subject(META["subject"])
        self.set_creator("hindi-project/build_pdf.py")

        self.add_font("Serif", "", os.path.join(FONT_DIR, "SerifDeva-Regular.ttf"))
        self.add_font("Serif", "B", os.path.join(FONT_DIR, "SerifDeva-Bold.ttf"))
        self.add_font("Sans", "", os.path.join(FONT_DIR, "SansDeva-Regular.ttf"))
        self.add_font("Sans", "B", os.path.join(FONT_DIR, "SansDeva-SemiBold.ttf"))
        self.set_text_shaping(True)

        self.section_pages: dict[str, int] = {}

    # ------------------------------------------------------------ छापने के नियम
    @property
    def usable(self) -> float:
        return PAGE_W - MARGIN_L - MARGIN_R

    def footer(self) -> None:
        if self.page_no() == 1:
            return
        self.set_y(-14)
        self.set_font("Serif", "", 9)
        self.set_text_color(*GREY)
        self.cell(0, 5, f"— {self.page_no()} —", align="C")
        self.set_text_color(0, 0, 0)

    def hrule(self, color=LIGHT_RULE, width=0.25) -> None:
        self.set_draw_color(*color)
        self.set_line_width(width)
        y = self.get_y()
        self.line(MARGIN_L, y, PAGE_W - MARGIN_R, y)

    def need_space(self, mm: float) -> None:
        if self.get_y() + mm > PAGE_H - MARGIN_B:
            self.add_page()

    # ------------------------------------------------------------ अलग-अलग ब्लॉक
    def heading1(self, text: str) -> None:
        if self.page_no() > 1 and self.get_y() > MARGIN_T + 2:
            self.ln(4.0)
        self.need_space(26)
        self.set_font("Serif", "B", 14.6)
        self.set_text_color(*NAVY)
        self.multi_cell(self.usable, 8.2, T(text), align="L")
        self.set_text_color(0, 0, 0)
        self.ln(1.2)
        self.hrule(NAVY, 0.35)
        self.ln(3.4)

    def heading2(self, text: str) -> None:
        self.need_space(24)
        self.ln(1.4)
        self.set_font("Serif", "B", 12.1)
        self.set_text_color(*MAROON)
        self.multi_cell(self.usable, 6.8, T(text), align="L")
        self.set_text_color(0, 0, 0)
        self.ln(2.2)

    def para(self, text: str) -> None:
        self.set_font("Serif", "", BODY_SIZE)
        self.multi_cell(self.usable, BODY_LH, T(text), align="J")
        self.ln(3.3)

    def bullets(self, items: list[str]) -> None:
        self.set_font("Serif", "", BODY_SIZE - 0.2)
        for item in items:
            self.need_space(14)
            x0 = self.get_x()
            self.cell(5.0, BODY_LH, "•")
            self.set_x(x0 + 5.0)
            self.multi_cell(self.usable - 5.0, BODY_LH, T(item), align="J")
            self.ln(1.6)
        self.ln(1.2)

    def quote(self, text: str) -> None:
        self.need_space(34)
        self.ln(1.4)
        x0 = self.get_x()
        y0 = self.get_y()
        self.set_font("Serif", "B", 10.8)
        self.set_text_color(*NAVY)
        self.set_x(x0 + 7)
        self.multi_cell(self.usable - 12, 6.2, T(text), align="J")
        y1 = self.get_y()
        self.set_draw_color(*NAVY)
        self.set_line_width(0.8)
        self.line(x0 + 2.2, y0 + 0.6, x0 + 2.2, y1 - 0.4)
        self.set_text_color(0, 0, 0)
        self.set_y(y1 + 3.0)

    def note(self, text: str) -> None:
        self.need_space(30)
        self.ln(1.0)
        x0, y0 = self.get_x(), self.get_y()
        self.set_fill_color(*NAVY_SOFT)
        self.set_font("Serif", "", 10.6)
        self.set_x(x0 + 5)
        self.multi_cell(self.usable - 10, 6.0, T(text), align="J", fill=True)
        self.set_y(self.get_y() + 3.0)


# ------------------------------------------------------------------ आवरण पृष्ठ
def cover(pdf: ProjectPDF) -> None:
    pdf.add_page()

    # दोहरा किनारा
    pdf.set_draw_color(*NAVY)
    pdf.set_line_width(0.7)
    pdf.rect(11, 11, PAGE_W - 22, PAGE_H - 22)
    pdf.set_line_width(0.25)
    pdf.rect(13.4, 13.4, PAGE_W - 26.8, PAGE_H - 26.8)

    pdf.set_y(30)
    pdf.set_font("Sans", "B", 11.5)
    pdf.set_text_color(*MAROON)
    pdf.cell(0, 6, "हिन्दी परियोजना कार्य", align="C")
    pdf.ln(6)
    pdf.set_font("Sans", "", 9.6)
    pdf.set_text_color(*GREY)
    pdf.cell(0, 5, T(META["course"]) + " — सत्र 2025–26", align="C")

    pdf.set_text_color(0, 0, 0)

    # संस्था
    pdf.set_y(52)
    pdf.set_font("Serif", "", 12)
    pdf.cell(0, 7, "...............................................", align="C")
    pdf.ln(5.5)
    pdf.set_font("Serif", "", 8.8)
    pdf.set_text_color(*GREY)
    pdf.cell(0, 5, "(विद्यालय / महाविद्यालय का नाम)", align="C")
    pdf.set_text_color(0, 0, 0)

    # शीर्षक
    pdf.set_y(80)
    pdf.set_font("Serif", "B", 25)
    pdf.set_text_color(*NAVY)
    pdf.multi_cell(0, 12.5, T(META["title"]), align="C")
    pdf.ln(3)

    y = pdf.get_y()
    pdf.set_draw_color(*MAROON)
    pdf.set_line_width(0.4)
    pdf.line(74, y, PAGE_W - 74, y)
    pdf.ln(7)

    pdf.set_font("Serif", "", 11.6)
    pdf.set_text_color(60, 60, 65)
    pdf.multi_cell(0, 6.4, T(META["subtitle"]), align="C")
    pdf.ln(4)
    pdf.set_font("Serif", "", 10.8)
    pdf.cell(0, 6, f"विषय : {META['subject']}", align="C")
    pdf.set_text_color(0, 0, 0)

    # दो स्तंभ — प्रस्तुतकर्ता / मार्गदर्शक
    left_x, right_x = 26.0, 118.0
    col_w = 66.0
    top_y = 172.0

    for x, title in ((left_x, "प्रस्तुतकर्ता"), (right_x, "मार्गदर्शक")):
        pdf.set_xy(x, top_y)
        pdf.set_font("Sans", "B", 10.6)
        pdf.set_text_color(*NAVY)
        pdf.cell(col_w, 6, title, align="L")
        pdf.set_draw_color(*NAVY)
        pdf.set_line_width(0.3)
        pdf.line(x, top_y + 7.4, x + col_w - 6, top_y + 7.4)
        pdf.set_text_color(0, 0, 0)

    left_rows = [
        "नाम : ........................................",
        "कोर्स : B.Sc. (प्रथम वर्ष)",
        "अनुक्रमांक : ............................",
        "विषय : हिन्दी (गद्य साहित्य)",
    ]
    right_rows = [
        "नाम : ........................................",
        "पदनाम : ....................................",
        "विभाग : हिन्दी विभाग",
        "महाविद्यालय : ..........................",
    ]

    for x, rows in ((left_x, left_rows), (right_x, right_rows)):
        yy = top_y + 14
        pdf.set_font("Serif", "", 9.8)
        for row in rows:
            pdf.set_xy(x, yy)
            pdf.cell(col_w - 4, 6.2, row)
            yy += 8.2

    # तल
    pdf.set_y(246)
    pdf.set_draw_color(*LIGHT_RULE)
    pdf.set_line_width(0.3)
    pdf.line(46, 244, PAGE_W - 46, 244)
    pdf.set_font("Serif", "", 10.6)
    pdf.set_text_color(*GREY)
    pdf.cell(0, 6, "यह परियोजना 'कफ़न' कहानी के सूक्ष्म पाठ पर आधारित है", align="C")
    pdf.ln(9)
    pdf.set_font("Sans", "B", 11.4)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 6, META["session"], align="C")
    pdf.set_text_color(0, 0, 0)


# ------------------------------------------------------- आभार + विषय-सूची पृष्ठ
def index_page(pdf: ProjectPDF, pages: dict[str, int] | None) -> None:
    pdf.add_page()

    pdf.set_font("Serif", "B", 15)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 9, "आभार", align="C")
    pdf.set_text_color(0, 0, 0)
    pdf.ln(11)

    pdf.set_font("Serif", "", 11.0)
    pdf.multi_cell(pdf.usable, 6.3, T(ACKNOWLEDGEMENT), align="J")
    pdf.ln(3)
    pdf.set_font("Serif", "", 10.4)
    pdf.cell(0, 6.4, "स्थान : ..................................", align="R")
    pdf.ln(7.0)
    pdf.cell(0, 6.4, SIGN, align="R")
    pdf.ln(7.0)
    pdf.cell(0, 6.4, "दिनांक : ..................................", align="R")
    pdf.ln(4)

    pdf.ln(4)
    pdf.hrule(LIGHT_RULE)
    pdf.ln(7)

    pdf.set_font("Serif", "B", 14.2)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 9, "विषय-सूची", align="C")
    pdf.set_text_color(0, 0, 0)
    pdf.ln(12)

    heads = [b[1] for b in BLOCKS if b[0] == "h1"]

    col_no, col_pg = 15.0, 20.0
    col_title = pdf.usable - col_no - col_pg
    row_h = 7.7

    pdf.set_fill_color(*NAVY_SOFT)
    pdf.set_font("Sans", "B", 9.8)
    pdf.set_text_color(*NAVY)
    pdf.cell(col_no, 8, "क्र.", align="C", fill=True)
    pdf.cell(col_title, 8, "शीर्षक", fill=True)
    pdf.cell(col_pg, 8, "पृष्ठ", align="C", fill=True)
    pdf.ln(8)
    pdf.set_text_color(0, 0, 0)

    pdf.set_font("Serif", "", 10.4)
    for i, head in enumerate(heads, start=1):
        page = "—" if pages is None else str(pages.get(head, "—"))
        if pdf.get_y() + row_h > PAGE_H - MARGIN_B - 6:
            pdf.add_page()
            pdf.set_font("Serif", "", 10.4)
        pdf.cell(col_no, row_h, str(i), align="C")
        pdf.cell(col_title, row_h, T(re.sub(r"^\d+\.\s*", "", head)))
        pdf.cell(col_pg, row_h, page, align="C")
        pdf.ln(row_h)
        pdf.set_draw_color(*LIGHT_RULE)
        pdf.set_line_width(0.15)
        pdf.line(MARGIN_L, pdf.get_y(), PAGE_W - MARGIN_R, pdf.get_y())

    # परियोजना-विवरण तालिका (यदि स्थान बचा हो)
    if pdf.get_y() + 50 < PAGE_H - MARGIN_B:
        pdf.ln(5.5)
        pdf.set_font("Serif", "B", 10.4)
        pdf.set_text_color(*NAVY)
        pdf.cell(0, 6, "परियोजना-विवरण", align="L")
        pdf.set_text_color(0, 0, 0)
        pdf.ln(7)
        rows = [
            ("विषय", "हिन्दी — गद्य एवं कहानी साहित्य (B.Sc. प्रथम सेमेस्टर)"),
            ("परियोजना का शीर्षक", "कफ़न कहानी में चित्रित समस्याओं का विश्लेषण"),
            ("विद्यार्थी का नाम", "……………………………………………………"),
            ("कक्षा / कोर्स एवं अनुक्रमांक", "B.Sc. प्रथम वर्ष (प्रथम सेमेस्टर) · अनुक्रमांक : ………………"),
            ("मार्गदर्शक शिक्षक/शिक्षिका", "……………………………………………………"),
        ]
        label_w, value_w = 62.0, pdf.usable - 62.0
        pdf.set_font("Serif", "", 10.0)
        for label, value in rows:
            y = pdf.get_y()
            pdf.set_font("Serif", "B", 9.8)
            pdf.cell(label_w, 6.6, T(label))
            pdf.set_font("Serif", "", 9.8)
            pdf.cell(value_w, 6.6, T(value))
            pdf.ln(6.6)
            pdf.set_draw_color(*LIGHT_RULE)
            pdf.set_line_width(0.15)
            pdf.line(MARGIN_L, pdf.get_y(), PAGE_W - MARGIN_R, pdf.get_y())

    pdf.add_page()


# ------------------------------------------------------------------ मुख्य निर्माण
def build(pages: dict[str, int] | None = None) -> tuple[ProjectPDF, dict[str, int]]:
    pdf = ProjectPDF()
    cover(pdf)

    # विषय-सूची के लिए पहले पता कर लें कि कौन-सा शीर्षक किस पृष्ठ पर है —
    # इसीलिए दूसरी बार बनाते समय असली पृष्ठ-संख्या डाली जाती है।
    index_page(pdf, pages)

    found: dict[str, int] = {}
    for block in BLOCKS:
        kind = block[0]
        if kind == "h1":
            pdf.heading1(block[1])
            found[block[1]] = pdf.page_no()
        elif kind == "h2":
            pdf.heading2(block[1])
        elif kind == "p":
            pdf.para(block[1])
        elif kind == "ul":
            pdf.bullets(block[1])
        elif kind == "quote":
            pdf.quote(block[1])
        elif kind == "note":
            pdf.note(block[1])
        else:  # pragma: no cover
            raise ValueError(kind)

    return pdf, found


def write_markdown(pages: dict[str, int]) -> None:
    out = [f"# {META['title']}", "", f"*{META['subtitle']}*", "",
           f"**विषय:** {META['subject']}  ", f"**कोर्स:** {META['course']}  ",
           f"**{META['session']}**", "",
           "---", "", "## आभार", "", ACKNOWLEDGEMENT, "",
           f"{SIGN}", "", "---", "", "## विषय-सूची", "",
           "| क्र. | शीर्षक | पृष्ठ |", "| --- | --- | --- |"]
    for i, block in enumerate([b for b in BLOCKS if b[0] == "h1"], start=1):
        title = re.sub(r"^\d+\.\s*", "", block[1])
        out.append(f"| {i} | {title} | {pages.get(block[1], '—')} |")
    out += ["", "---", ""]

    for block in BLOCKS:
        kind = block[0]
        if kind == "h1":
            out += [f"## {block[1]}", ""]
        elif kind == "h2":
            out += [f"### {block[1]}", ""]
        elif kind == "p":
            out += [block[1], ""]
        elif kind == "ul":
            out += [f"- {item}" for item in block[1]] + [""]
        elif kind == "quote":
            out += [f"> {block[1]}", ""]
        elif kind == "note":
            out += [f"**टिप्पणी:** {block[1]}", ""]

    with open(OUT_MD, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out).rstrip() + "\n")


def main() -> None:
    ensure_fonts()

    _, first_pages = build(pages=None)
    pdf, real_pages = build(pages=first_pages)

    if first_pages != real_pages:
        print("⚠ पृष्ठ-संख्या बदल गई, दोबारा बना रहे हैं …")
        pdf, real_pages = build(pages=real_pages)

    pdf.output(OUT_PDF)
    write_markdown(real_pages)

    print(f"✓ PDF तैयार : {OUT_PDF}  (कुल पृष्ठ: {pdf.pages_count})")
    print(f"✓ Markdown  : {OUT_MD}")
    for head, page in real_pages.items():
        print(f"   p{page:>2}  {head}")


if __name__ == "__main__":
    main()
