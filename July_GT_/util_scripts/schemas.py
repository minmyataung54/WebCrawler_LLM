"""Pydantic models describing the evaluation schema."""
from __future__ import annotations

from typing import Any, List, Optional, Union

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EventRecord(BaseModel):
    """Ground-truth/LLM event structure expected by the evaluator."""

    event_id: str = "NA"
    crisis_type: str = "NA"
    location: str = "NA"
    date: str = "NA"
    affected_civilian: str = Field("NA", alias="affect_civilian")
    affected_women: str = Field("NA", alias="affect_women")
    affected_children: str = Field("NA", alias="affect_children")
    civilian_properties_damage: str = "NA"
    civilian_forced_displacement: str = "NA"
    civilian_fatalities: int = 0
    armed_personnel_fatalities: int = 0
    number_of_people_displaced: int = 0
    involved_parties: List[str] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    @field_validator(
        "civilian_fatalities",
        "armed_personnel_fatalities",
        "number_of_people_displaced",
        mode="before",
    )
    def convert_numeric_fields(cls, value: Any) -> int:  # type: ignore[override]
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
                pass
        return 0


class ArticleRecord(BaseModel):
    """Top-level article payload containing events."""

    article_id: str = "NA"
    published_date: str = Field("NA", alias="published_Date")
    events: List[EventRecord] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True, extra="ignore")


class ModelArticleRecord(BaseModel):
    """Model output layout: wraps events while tolerating alias usage."""

    article_id: str = "NA"
    events: List[EventRecord] = Field(default_factory=list)


class EvaluationDocument(BaseModel):
    """General document wrapper used for schema checks."""

    article_id: Optional[str] = None
    events: List[EventRecord] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True, extra="ignore")
