"""Utility script for normalizing LLM output files across all models."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable, List

from llms_evaluate.schemas import EventRecord

CANONICAL_EVENT_KEYS: Dict[str, str] = {
    "crisis_type": "crisis_type",
    "crisis type": "crisis_type",
    "location": "location",
    "date": "date",
    "affect_civilian": "affected_civilian",
    "affected_civilian": "affected_civilian",
    "affect_women": "affected_women",
    "affected_women": "affected_women",
    "affect_children": "affected_children",
    "affected_children": "affected_children",
    "civilian_properties_damage": "civilian_properties_damage",
    "civilian properties damage": "civilian_properties_damage",
    "civilian_forced_displacement": "civilian_forced_displacement",
    "civilian forced displacement": "civilian_forced_displacement",
    "civilian_fatalities": "civilian_fatalities",
    "civililan_fatalities": "civilian_fatalities",
    "armed_personnel_fatalities": "armed_personnel_fatalities",
    "armed personnel fatalities": "armed_personnel_fatalities",
    "number_of_people_displaced": "number_of_people_displaced",
    "number of people displaced": "number_of_people_displaced",
    "involved_parties": "involved_parties",
    "involved parties": "involved_parties",
    "event_id": "event_id",
}

NUMERIC_FIELDS = {
    "civilian_fatalities",
    "armed_personnel_fatalities",
    "number_of_people_displaced",
}


def normalize_key(raw_key: str) -> str:
    """Return a canonical lookup key by lowering and replacing whitespace."""
    return " ".join(raw_key.strip().lower().replace("-", " ").split())


def normalize_scalar(value: Any) -> Any:
    """Coerce None/blank/null-like values to the string 'NA'."""
    if value is None:
        return "NA"
    if isinstance(value, list):
        flattened: List[str] = []
        for item in value:
            if item is None:
                continue
            if isinstance(item, str):
                stripped = item.strip()
                if stripped and stripped.upper() != "NA":
                    flattened.append(stripped)
            else:
                flattened.append(str(item))
        if not flattened:
            return "NA"
        return ", ".join(flattened)
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return "NA"
        if stripped.upper() in {"NA", "NULL", "NONE"}:
            return "NA"
        return value
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        integer = int(value)
        if float(integer) == float(value):
            return str(integer)
        return str(value)
    if isinstance(value, dict):
        try:
            return json.dumps(value, ensure_ascii=False)
        except Exception:
            return str(value)
    return str(value)


def normalize_numeric(value: Any) -> int:
    """Convert numeric-coded fields into integers, treating NA-like values as 0."""
    if value is None:
        return 0
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped or stripped.upper() in {"NA", "NONE", "NULL"}:
            return 0
        try:
            return int(float(stripped))
        except ValueError:
            return 0
    return 0


def normalize_involved_parties(value: Any) -> List[str]:
    """Ensure involved_parties renders as a list of non-empty strings.""" 
    if value is None:
        return []
    if isinstance(value, list):
        parties: List[str] = []
        for item in value:
            if isinstance(item, str):
                stripped = item.strip()
                if stripped and stripped.upper() != "NA":
                    parties.append(stripped)
            elif item is not None:
                parties.append(str(item))
        return parties
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped or stripped.upper() == "NA":
            return []
        return [stripped]
    return [str(value)]


def ensure_list(maybe_events: Any) -> List[Dict[str, Any]]:
    """Wrap events into a list if they are provided as a single dict."""
    if isinstance(maybe_events, list):
        return [item for item in maybe_events if isinstance(item, dict)]
    if isinstance(maybe_events, dict):
        return [maybe_events]
    return []


def transform_event(event: Dict[str, Any]) -> Dict[str, Any]:
    """Rename event keys to the canonical schema."""
    transformed: Dict[str, Any] = {}
    for raw_key, value in event.items():
        canonical_lookup = normalize_key(raw_key)
        target_key = CANONICAL_EVENT_KEYS.get(canonical_lookup)
        if not target_key:
            target_key = canonical_lookup.replace(" ", "_")
        if target_key == "involved_parties":
            transformed[target_key] = normalize_involved_parties(value)
        elif target_key in NUMERIC_FIELDS:
            transformed[target_key] = normalize_numeric(value)
        else:
            transformed[target_key] = normalize_scalar(value)
    return transformed


def transform_events(events: Iterable[Dict[str, Any]], *, context: str = "") -> List[Dict[str, Any]]:
    """Apply key normalization to every event in a collection."""
    normalized = [transform_event(event) for event in events]
    validated: List[Dict[str, Any]] = []
    for idx, event in enumerate(normalized):
        try:
            validated.append(EventRecord(**event).model_dump(by_alias=False))
        except Exception as exc:  # pragma: no cover - utility logging
            if context:
                print(f"    Corrected malformed event in {context} (index {idx}): {exc}")
            else:
                print(f"    Corrected malformed event at index {idx}: {exc}")
            validated.append(event)
    return validated


def normalize_model_output_payload(payload: Any, *, context: str) -> List[Dict[str, Any]]:
    """Normalize an arbitrary model output payload to a list of events."""
    if isinstance(payload, list):
        return transform_events(payload, context=context)

    if isinstance(payload, dict):
        candidate = payload.get("events") or payload.get("Events")
        if candidate is None:
            candidate = payload
        events = ensure_list(candidate)
        normalized_events = transform_events(events, context=context)
        return normalized_events

    raise ValueError("Unsupported model output format")


def normalize_model_output_file(json_path: Path) -> None:
    """Normalize a single model output JSON file in-place."""
    with open(json_path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)

    normalized_events = normalize_model_output_payload(payload, context=json_path.name)

    with open(json_path, "w", encoding="utf-8") as handle:
        json.dump(normalized_events, handle, indent=2, ensure_ascii=False)


def normalize_llm_results(root_path: Path) -> None:
    """Normalize every JSON file for every model within llm_results."""
    if not root_path.exists():
        print(f"Folder {root_path} does not exist")
        return

    failures: List[tuple[str, str, str]] = []

    for model_dir in sorted(root_path.iterdir()):
        if not model_dir.is_dir():
            continue
        for json_file in sorted(model_dir.glob("*.json")):
            try:
                normalize_model_output_file(json_file)
            except Exception as exc:  # pragma: no cover - utility script logging
                failures.append((model_dir.name, json_file.name, str(exc)))

    if failures:
        print("Files requiring attention:")
        for model_name, filename, message in failures:
            print(f"  [{model_name}] {filename}: {message}")


if __name__ == "__main__":
    default_root = Path(__file__).resolve().parent.parent / "llm_results"
    normalize_llm_results(default_root)
