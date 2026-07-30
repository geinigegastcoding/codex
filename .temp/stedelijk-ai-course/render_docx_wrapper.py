import runpy
import tempfile

tempfile.tempdir = r"E:\MData\.temp\stedelijk-ai-course\libreoffice-temp"
runpy.run_path(
    r"C:\Users\daniel\.codex\plugins\cache\openai-primary-runtime\documents\26.723.12215\skills\documents\render_docx.py",
    run_name="__main__",
)
