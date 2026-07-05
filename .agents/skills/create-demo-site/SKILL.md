---
name: create-demo-site
description: Turns an example page (image or description) into a simple, responsive .html file demo site with placeholder data and images.
---

# create-demo-site Skill

This skill is activated when the user asks to turn a reference image, mock-up, or description into a simple `.html` demo site.

## Goal
Generate a high-quality, responsive single-file `.html` landing page or template that closely matches the provided reference. It must use placeholder data and images to serve as a demo template.

## Execution Workflow

1. **Analyze the Reference**:
   - If an image is provided, use `view_file` to inspect the layout, color scheme, and structural sections (e.g., Hero, Social Proof, Services, FAQ).
   - If a text description is provided, extract the required sections and styling cues.

2. **Technical Constraints & Stack**:
   - Use **Vanilla HTML** and inline/internal **Vanilla CSS** within a `<style>` block.
   - Do NOT use external CSS frameworks (like Tailwind or Bootstrap) unless explicitly requested.
   - Ensure the site is fully responsive (use Flexbox/Grid and `@media` queries).

3. **Content & Placeholders**:
   - **Images**: Do not use real images. Use clearly styled placeholder blocks (e.g., `[ Hero Image Placeholder - 16:9 ]`).
   - **Text**: Write realistic, SEO-optimized text for the requested industry/topic. Use placeholder variables like `{locatie}`, `{brandnaam}`, or `{dienst_type}` so the user can easily swap them later.
   - **Structure**: Include semantic HTML tags (`<header>`, `<section>`, `<footer>`, `<h1>`, `<h2>`).

4. **Design & Aesthetics**:
   - Prioritize a "WOW" factor. The design should look premium and modern.
   - Use clean typography. If a specific font is requested (e.g., Google Sans), provide web-safe fallbacks via Google Fonts (like `Inter` or `Outfit`).
   - Add micro-animations (e.g., hover effects on buttons and cards, smooth transitions).
   - Use harmonious color palettes extracted from the reference or suited to the industry.

5. **File Output**:
   - Save the final code as a single `.html` file.
   - By default, save it in the `templates/` folder within the workspace, unless the user specifies otherwise. (e.g., `templates/demo_name.html`).

6. **Completion**:
   - Briefly summarize what was created, mention the sections included, and provide a clickable link to the generated `.html` file so the user can preview it.
