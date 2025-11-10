#!/usr/bin/env python3
"""
docx_text_only_to_json.py  (Python 3.9 compatible)

Recursively convert .docx files (and '._docx' weird names) to .json files that contain
ONLY the document text (no metadata, no paragraph/table wrappers).

By default:
  - Extract paragraphs -> join with "\n"
  - Write EXACTLY that text into the .json file

Options:
  --normalize-quotes  : Replace smart quotes (“ ” ‘ ’) with straight quotes
  --parse-json        : Try json.loads on the extracted text; if valid, output canonical JSON
                        (pretty-printed). If not valid JSON, write raw text as-is.
  -o OUTPUT_DIR       : Mirror tree under a clean output folder
  --jobs N            : Parallel workers (processes)
  --replace           : Delete original .docx after successful conversion

Examples:
  python docx_text_only_to_json.py "/path/one" --normalize-quotes
  python docx_text_only_to_json.py "/path/one" -o "/path/out" --parse-json --jobs 8
"""

import argparse
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Tuple, Optional
import sys
from concurrent.futures import ProcessPoolExecutor, as_completed

# --------- helpers for WordprocessingML ---------

def n(tag: str) -> str:
    return "{*}" + tag

def text_in_element(elem) -> str:
    """Extract text from w:r/w:t, handling tabs and line breaks."""
    parts: List[str] = []
    for r in elem.findall(n('r')):
        tabs = r.findall(n('tab'))
        brs = r.findall(n('br'))
        if tabs:
            parts.append("\t" * len(tabs))
        if brs:
            parts.append("\n" * len(brs))
        t = r.find(n('t'))
        if t is not None and t.text:
            parts.append(t.text)
    return "".join(parts)

def extract_paragraphs(body) -> List[str]:
    out: List[str] = []
    for p in body.findall(n('p')):
        txt = text_in_element(p)
        # keep empty paragraphs as blank lines to preserve structure
        out.append(txt or "")
    return out

def parse_docx_to_text(docx_path: Path) -> str:
    """Return full text as paragraphs joined by newlines. On parse issue, return empty string."""
    try:
        with zipfile.ZipFile(docx_path, 'r') as zf:
            try:
                xml_bytes = zf.read('word/document.xml')
            except KeyError:
                return ""
    except zipfile.BadZipFile:
        return ""
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return ""
    body = root.find(n('body'))
    if body is None:
        return ""
    paras = extract_paragraphs(body)
    return "\n".join(paras)

# --------- filename & discovery ---------

def looks_like_doc_or_docx(p: Path) -> bool:
    lower = p.name.lower()
    return lower.endswith(".docx") or lower.endswith("._docx") or (lower.endswith(".doc") and not lower.endswith(".docx"))

def is_old_doc(p: Path) -> bool:
    return p.name.lower().endswith(".doc") and not p.name.lower().endswith(".docx")

def normalize_docx_name(p: Path) -> Path:
    """Rename 'name._docx' -> 'name.docx' if present."""
    name = p.name
    lower = name.lower()
    if lower.endswith("._docx"):
        new_name = name[:-6] + ".docx"
        new_path = p.with_name(new_name)
        counter = 1
        while new_path.exists():
            new_path = p.with_name(f"{p.stem}_{counter}.docx")
            counter += 1
        try:
            p.rename(new_path)
            return new_path
        except OSError:
            return p
    return p

def discover_files(root: Path) -> List[Path]:
    return [p for p in root.rglob("*") if p.is_file() and looks_like_doc_or_docx(p)]

# --------- text normalization ---------

def normalize_smart_quotes(s: str) -> str:
    # Replace common smart quotes/dashes with ASCII equivalents
    replacements = {
        "\u201c": '"',  # left double
        "\u201d": '"',  # right double
        "\u2018": "'",  # left single
        "\u2019": "'",  # right single
        "\u2013": "-",  # en dash
        "\u2014": "-",  # em dash
        "\u00A0": " ",  # non-breaking space
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s

# --------- worker ---------

def process_one(
    src: Path,
    input_dir: Path,
    out_base: Optional[Path],
    replace: bool,
    normalize_quotes: bool,
    parse_json: bool
) -> Tuple[str, Optional[str]]:
    """
    Returns (message, error). On success, message begins with 'WROTE'.
    """
    try:
        if is_old_doc(src):
            return ("SKIP (old .doc): {}".format(src), None)

        src = normalize_docx_name(src)

        # Build output path
        if out_base:
            try:
                rel = src.relative_to(input_dir).with_suffix(".json")
            except ValueError:
                rel = Path(src.name).with_suffix(".json")
            out_path = out_base / rel
            out_path.parent.mkdir(parents=True, exist_ok=True)
        else:
            out_path = src.with_suffix(".json")

        # Extract text
        text = parse_docx_to_text(src)

        if normalize_quotes:
            text = normalize_smart_quotes(text)

        # If requested, try to parse as JSON
        if parse_json:
            try:
                obj = json.loads(text)
                with out_path.open("w", encoding="utf-8") as f:
                    json.dump(obj, f, ensure_ascii=False, indent=2)
            except Exception:
                # Not valid JSON → write raw text exactly as-is
                with out_path.open("w", encoding="utf-8") as f:
                    f.write(text)
        else:
            # Always write raw text exactly as-is
            with out_path.open("w", encoding="utf-8") as f:
                f.write(text)

        if replace:
            try:
                src.unlink()
            except OSError as e:
                return ("WROTE {} | WARN: could not delete {}: {}".format(out_path, src, e), None)

        return ("WROTE {}".format(out_path), None)

    except Exception as e:
        return ("ERROR processing {}".format(src), str(e))

# --------- CLI ---------

def main():
    ap = argparse.ArgumentParser(description="Recursively convert .docx files to .json text-only outputs.")
    ap.add_argument("input_dir", type=Path, help="Top folder containing Word files")
    ap.add_argument("-o", "--output_dir", type=Path, default=None,
                    help="Root folder for outputs (mirrors subfolders). Default: next to originals.")
    ap.add_argument("--normalize-quotes", action="store_true",
                    help="Normalize smart quotes/dashes to plain ASCII")
    ap.add_argument("--parse-json", action="store_true",
                    help="Try to parse extracted text as JSON; if valid, write canonical JSON, else raw text")
    ap.add_argument("--jobs", type=int, default=1, help="Parallel workers (processes)")
    ap.add_argument("--replace", action="store_true", help="Delete original .docx after successful conversion")
    args = ap.parse_args()

    root = args.input_dir
    if not root.exists() or not root.is_dir():
        sys.exit("Input directory not found: {}".format(root))

    if args.output_dir:
        args.output_dir.mkdir(parents=True, exist_ok=True)

    candidates = discover_files(root)
    if not candidates:
        print("No .docx / ._docx / .doc files found.")
        return

    total = len(candidates)
    print("Found {} candidate file(s).".format(total))

    jobs = max(1, int(args.jobs))
    successes = 0
    skips_doc = 0
    errors = 0

    if jobs == 1:
        for i, src in enumerate(candidates, 1):
            msg, err = process_one(src, root, args.output_dir, args.replace, args.normalize_quotes, args.parse_json)
            if msg.startswith("SKIP (old .doc)"):
                skips_doc += 1
            elif msg.startswith("WROTE"):
                successes += 1
            else:
                errors += 1
            print("[{}/{}] {}".format(i, total, msg) + (" :: {}".format(err) if err else ""))
    else:
        with ProcessPoolExecutor(max_workers=jobs) as ex:
            futures = {
                ex.submit(process_one, src, root, args.output_dir, args.replace, args.normalize_quotes, args.parse_json): src
                for src in candidates
            }
            for i, fut in enumerate(as_completed(futures), 1):
                msg, err = fut.result()
                if msg.startswith("SKIP (old .doc)"):
                    skips_doc += 1
                elif msg.startswith("WROTE"):
                    successes += 1
                else:
                    errors += 1
                print("[{}/{}] {}".format(i, total, msg) + (" :: {}".format(err) if err else ""))

    print("\nDone. Success: {}, Skipped .doc: {}, Errors: {}.".format(successes, skips_doc, errors))

if __name__ == "__main__":
    main()