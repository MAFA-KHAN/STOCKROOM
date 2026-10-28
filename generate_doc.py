import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_submission_document():
    doc = docx.Document()

    # Set page margins (0.75 in)
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    def set_cell_background(cell, hex_color):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    # Color tokens
    COLOR_PRIMARY = RGBColor(23, 42, 39)    # Forest Charcoal #172A27
    COLOR_ACCENT = RGBColor(40, 125, 98)   # Emerald #287D62
    COLOR_MUTED = RGBColor(86, 100, 97)    # Slate #566461
    COLOR_TEXT = RGBColor(40, 40, 40)

    # ==========================================
    # 1. HEADER / COVER SECTION
    # ==========================================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_super = title_p.add_run("COURSE: WEB ENGINEERING / FRONTEND DEVELOPMENT (CLO1 & CLO2)\n")
    run_super.font.name = "Arial"
    run_super.font.size = Pt(9.5)
    run_super.font.bold = True
    run_super.font.color.rgb = COLOR_ACCENT

    run_title = title_p.add_run("Advanced React Component Architecture & State Management\n")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY

    run_sub = title_p.add_run("Assignment 01 Submission Report — E-Commerce Inventory & Stock Management Dashboard (STOCKROOM)")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = COLOR_MUTED

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Submission Meta Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    meta_data = [
        ("Student Name:", "Mafa"),
        ("Registration / Roll Number:", "[Insert Your Registration ID Here, e.g. 2022-CS-XXX]"),
        ("Semester & Section:", "BS Computer Science / AI — 5th Semester (Section A)"),
        ("Live Deployment URL:", "https://stockroom-inventory-dashboard.netlify.app/  (Replace with your real URL)"),
        ("GitHub Repository URL:", "https://github.com/MAFA-KHAN/STOCKROOM.git"),
    ]

    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        
        c0 = row.cells[0]
        c0.width = Inches(2.2)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r0 = p0.add_run(label)
        r0.font.name = "Arial"
        r0.font.size = Pt(10)
        r0.font.bold = True
        r0.font.color.rgb = COLOR_PRIMARY
        set_cell_background(c0, "F4F6F3")
        set_cell_margins(c0, 80, 80, 120, 120)

        c1 = row.cells[1]
        c1.width = Inches(4.8)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        r1 = p1.add_run(val)
        r1.font.name = "Arial"
        r1.font.size = Pt(10)
        if "http" in val:
            r1.font.color.rgb = COLOR_ACCENT
            r1.font.underline = True
        else:
            r1.font.color.rgb = COLOR_TEXT
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c1, 80, 80, 120, 120)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ==========================================
    # 2. EXECUTIVE SUMMARY (5th Semester Tone)
    # ==========================================
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)
    r_h1 = h1.add_run("1. Project Overview & Architecture Summary")
    r_h1.font.name = "Arial"
    r_h1.font.size = Pt(12.5)
    r_h1.font.bold = True
    r_h1.font.color.rgb = COLOR_PRIMARY

    p_summary = doc.add_paragraph()
    p_summary.paragraph_format.space_before = Pt(2)
    p_summary.paragraph_format.space_after = Pt(6)
    p_summary.paragraph_format.line_spacing = 1.15
    r_sum1 = p_summary.add_run(
        "For this assignment, I designed and developed STOCKROOM, an E-Commerce Inventory and Stock Management Dashboard. "
        "The primary goal of this project was to implement a clean single-page application (SPA) using React.js that bridges both modern "
        "functional patterns with React Hooks and traditional class component lifecycles, as required in the course outline. "
        "Rather than building a basic exercise, I structured the interface to look like a realistic retail dashboard where a store manager "
        "can monitor product volumes, track low-stock items, adjust quantities, add new inventory, and examine an audit log of past operations."
    )
    r_sum1.font.name = "Arial"
    r_sum1.font.size = Pt(10)
    r_sum1.font.color.rgb = COLOR_TEXT

    p_summary2 = doc.add_paragraph()
    p_summary2.paragraph_format.space_before = Pt(2)
    p_summary2.paragraph_format.space_after = Pt(10)
    p_summary2.paragraph_format.line_spacing = 1.15
    r_sum2 = p_summary2.add_run(
        "The project follows the exact folder structure specified by the instructor, separating functional components, the class-based "
        "AuditLogger, custom hooks, and global context. To ensure reliable performance without a separate backend database, I implemented "
        "browser localStorage synchronization, dynamic document title updates, and memoized metrics for fast search and filtering."
    )
    r_sum2.font.name = "Arial"
    r_sum2.font.size = Pt(10)
    r_sum2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # 3. COMPONENT & HOOKS MAPPING TABLE
    # ==========================================
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(4)
    r_h2 = h2.add_run("2. Core Concepts Implementation & File Mapping")
    r_h2.font.name = "Arial"
    r_h2.font.size = Pt(12.5)
    r_h2.font.bold = True
    r_h2.font.color.rgb = COLOR_PRIMARY

    mapping_table = doc.add_table(rows=7, cols=3)
    mapping_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    mapping_table.autofit = False

    headers = ["Assignment Requirement", "Implemented File", "Technical Details & Role"]
    col_widths = [Inches(1.8), Inches(1.8), Inches(3.4)]

    hdr_row = mapping_table.rows[0]
    for j, heading in enumerate(headers):
        c = hdr_row.cells[j]
        c.width = col_widths[j]
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(heading)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, "172A27")
        set_cell_margins(c, 80, 80, 100, 100)

    table_records = [
        ("Component Structure & props.children", "src/components/functional/CardWrapper.jsx", "Acts as a reusable card container taking props.children to wrap metric summaries, product cards, and status panels with consistent border styling."),
        ("Functional Components & Controlled Inputs", "src/components/functional/ProductForm.jsx, ProductList.jsx, ProductCard.jsx", "Built with functional syntax, controlled inputs, synthetic event handlers (onSubmit, onClick), and callback props for communicating with parent state."),
        ("Class Component & Lifecycle Methods", "src/components/class/AuditLogger.jsx", "Extends React.Component. Uses this.state and this.setState. componentDidMount loads saved logs; componentDidUpdate detects new logs, saves to localStorage, and triggers toasts; componentWillUnmount clears intervals."),
        ("State & Storage Hooks (useState, useEffect)", "src/hooks/useInventory.js, src/App.jsx", "useState tracks products, filters, search query, and modal views. useEffect persists data to localStorage and dynamically updates the browser tab title based on product counts."),
        ("Theme Management (useContext)", "src/context/ThemeContext.jsx", "Provides global light and dark theme context without prop drilling. Components toggle between themes and save user choice in localStorage."),
        ("Performance Optimization (useRef, useMemo, useCallback)", "src/components/functional/ProductForm.jsx, ProductList.jsx, src/App.jsx", "useRef shifts cursor focus to the product title input on mount and after submit. useMemo optimizes multi-parameter searching and metric math. useCallback stabilizes event handlers passed to children."),
    ]

    for i, row_data in enumerate(table_records, start=1):
        row = mapping_table.rows[i]
        bg_color = "F9FAF8" if i % 2 == 1 else "FFFFFF"
        for j, text in enumerate(row_data):
            c = row.cells[j]
            c.width = col_widths[j]
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            r = p.add_run(text)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)
            r.font.color.rgb = COLOR_TEXT
            if j == 0:
                r.font.bold = True
            elif j == 1:
                r.font.name = "Courier New"
                r.font.size = Pt(8)
                r.font.color.rgb = COLOR_ACCENT
            set_cell_background(c, bg_color)
            set_cell_margins(c, 70, 70, 90, 90)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ==========================================
    # 4. THEORETICAL ANALYSIS (CSR VS SSR) - 289 words
    # ==========================================
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(12)
    h3.paragraph_format.space_after = Pt(4)
    r_h3 = h3.add_run("3. Theoretical Analysis: Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR)")
    r_h3.font.name = "Arial"
    r_h3.font.size = Pt(12.5)
    r_h3.font.bold = True
    r_h3.font.color.rgb = COLOR_PRIMARY

    csr_paragraphs = [
        "Client-Side Rendering (CSR) and Server-Side Rendering (SSR) represent two distinct rendering strategies for modern web applications. In a CSR architecture—such as this Vite + React SPA—the web server delivers a minimal HTML shell along with packaged JavaScript bundles. The browser executes this JavaScript, mounts the React component tree, and dynamically manipulates the DOM. Server-side computation is minimal, shifting execution to the client device.",
        
        "Conversely, Server-Side Rendering (SSR)—implemented by frameworks like Next.js—executes React components on the server for each request. The server fetches required data, renders the component hierarchy into a complete HTML document, and streams it to the browser. The user sees meaningful content immediately, followed by a hydration step where client JavaScript binds event listeners to the pre-rendered markup.",
        
        "When evaluating performance, SEO, and hosting for an enterprise application, trade-offs emerge:\n"
        "1. Performance & Interactivity: CSR exhibits a slower First Contentful Paint (FCP) because clients must download and execute large JavaScript bundles before displaying UI. However, once loaded, subsequent interactions—such as searching inventory, toggling stock, and filtering categories—execute instantly in memory without round-trips. SSR improves initial load and Time to First Byte (TTFB), though Time to Interactive (TTI) remains tied to hydration.\n"
        "2. SEO & Indexability: SSR delivers fully rendered HTML directly to search crawlers, ensuring indexability for public product pages. CSR relies on crawlers executing dynamic JavaScript, which can delay indexing.\n"
        "3. Hosting Costs & Complexity: CSR compiles to static HTML, CSS, and JS, allowing free, globally distributed deployment on static CDNs like Netlify or Vercel. SSR requires active Node.js runtimes or serverless containers, increasing infrastructure overhead.",
        
        "For this internal STOCKROOM Inventory Dashboard, CSR is the superior choice because administrative tools operate behind authentication where SEO is unnecessary, while client-side speed and zero-maintenance static hosting maximize efficiency."
    ]

    for p_text in csr_paragraphs:
        p_csr = doc.add_paragraph()
        p_csr.paragraph_format.space_before = Pt(2)
        p_csr.paragraph_format.space_after = Pt(5)
        p_csr.paragraph_format.line_spacing = 1.15
        r_p = p_csr.add_run(p_text)
        r_p.font.name = "Arial"
        r_p.font.size = Pt(9.5)
        r_p.font.color.rgb = COLOR_TEXT

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ==========================================
    # 5. APPLICATION PREVIEWS & SCREENSHOT PLACEHOLDER
    # ==========================================
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(12)
    h4.paragraph_format.space_after = Pt(4)
    r_h4 = h4.add_run("4. Deployed Application Verification & Live Screenshot")
    r_h4.font.name = "Arial"
    r_h4.font.size = Pt(12.5)
    r_h4.font.bold = True
    r_h4.font.color.rgb = COLOR_PRIMARY

    p_sc_guide = doc.add_paragraph()
    p_sc_guide.paragraph_format.space_before = Pt(2)
    p_sc_guide.paragraph_format.space_after = Pt(8)
    r_scg = p_sc_guide.add_run(
        "Below is the designated section for the live application screenshot as required for GCR submission. "
        "The screenshot demonstrates the complete dashboard layout: top navigation, real-time KPI metric cards, "
        "search and category filtering, responsive product cards with color-coded stock badges, and the 'Powered by Mafa' footer."
    )
    r_scg.font.name = "Arial"
    r_scg.font.size = Pt(9.5)
    r_scg.font.color.rgb = COLOR_TEXT

    # Screenshot Frame / Box
    box_table = doc.add_table(rows=1, cols=1)
    box_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    box_cell = box_table.rows[0].cells[0]
    box_cell.width = Inches(7.0)
    set_cell_background(box_cell, "F5F7F5")
    set_cell_margins(box_cell, 400, 400, 200, 200)

    p_box = box_cell.paragraphs[0]
    p_box.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_box.paragraph_format.space_before = Pt(20)
    p_box.paragraph_format.space_after = Pt(20)

    r_box_title = p_box.add_run("[ INSERT YOUR APPLICATION SCREENSHOT HERE ]\n\n")
    r_box_title.font.name = "Arial"
    r_box_title.font.size = Pt(12)
    r_box_title.font.bold = True
    r_box_title.font.color.rgb = COLOR_PRIMARY

    r_box_desc = p_box.add_run(
        "Quick Steps to insert your real screenshot:\n"
        "1. Open your live deployed site on Netlify or http://localhost:5173/\n"
        "2. Press 'Win + Shift + S' on Windows and capture the full dashboard.\n"
        "3. Click inside this box in Microsoft Word and press 'Ctrl + V' to paste.\n"
        "4. Fill in your Registration Number and URLs on Page 1, then save and submit to Google Classroom."
    )
    r_box_desc.font.name = "Arial"
    r_box_desc.font.size = Pt(9.5)
    r_box_desc.font.color.rgb = COLOR_MUTED

    # Caption
    p_caption = doc.add_paragraph()
    p_caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_caption.paragraph_format.space_before = Pt(6)
    p_caption.paragraph_format.space_after = Pt(14)
    r_cap = p_caption.add_run("Figure 1.1: Live deployed view of STOCKROOM Inventory Dashboard showing active metrics, filters, and stock catalog.")
    r_cap.font.name = "Arial"
    r_cap.font.size = Pt(8.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = COLOR_MUTED

    # ==========================================
    # 6. CONCLUSION & VERIFICATION CHECKLIST
    # ==========================================
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(12)
    h5.paragraph_format.space_after = Pt(4)
    r_h5 = h5.add_run("5. Pre-Submission Self-Evaluation Checklist")
    r_h5.font.name = "Arial"
    r_h5.font.size = Pt(12.5)
    r_h5.font.bold = True
    r_h5.font.color.rgb = COLOR_PRIMARY

    checklist_items = [
        ("Component Structure Adherence", "Follows exact src/components/class and functional directory layout."),
        ("Legacy Class Component (AuditLogger)", "componentDidMount, componentDidUpdate, and componentWillUnmount all implemented."),
        ("Required React Hooks", "useState, useEffect, useContext, useRef, useMemo, and useCallback are fully integrated."),
        ("Data Persistence", "Inventory and audit trail reliably persist across browser reloads using localStorage."),
        ("Theoretical Analysis", "CSR vs. SSR comparison included with 289 words addressing rendering, SEO, and hosting."),
        ("Product Interface Standards", "Footer clearly shows 'Powered by Mafa' with clean SaaS aesthetic and zero course clutter."),
    ]

    for item, desc in checklist_items:
        p_chk = doc.add_paragraph()
        p_chk.paragraph_format.space_before = Pt(1)
        p_chk.paragraph_format.space_after = Pt(3)
        r_box = p_chk.add_run("  [ OK ]  ")
        r_box.font.name = "Arial"
        r_box.font.size = Pt(9)
        r_box.font.bold = True
        r_box.font.color.rgb = COLOR_ACCENT

        r_item = p_chk.add_run(f"{item}: ")
        r_item.font.name = "Arial"
        r_item.font.size = Pt(9.5)
        r_item.font.bold = True
        r_item.font.color.rgb = COLOR_PRIMARY

        r_desc = p_chk.add_run(desc)
        r_desc.font.name = "Arial"
        r_desc.font.size = Pt(9)
        r_desc.font.color.rgb = COLOR_TEXT

    output_filename = "Stockroom_Project_Submission.docx"
    doc.save(output_filename)
    print(f"Document successfully created: {output_filename}")

if __name__ == "__main__":
    create_submission_document()
