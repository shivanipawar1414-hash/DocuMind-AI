
import re
from difflib import SequenceMatcher


def extract_smart_fields(text):
    fields = {}

    salary = re.search(
        r'(?:₹|I)\s*(\d+(?:\.\d+)?)\s*LPA',
        text,
        re.IGNORECASE
    )

    joining_date = re.search(
        r'(?:date of joining will be|joining date:?)\s*(\d{1,2}\s+\w+\s+\d{4})',
        text,
        re.IGNORECASE
    )

    company = re.search(
        r'([A-Z][A-Z\s]+TECHNOLOGIES)',
        text
    )

    if salary:
        fields["salary"] = salary.group(1) + " LPA"

    if joining_date:
        fields["joining_date"] = joining_date.group(1)

    if company:
        fields["company"] = company.group(1).strip()

    return fields


def compare_texts(text_one, text_two):
    old_fields = extract_smart_fields(text_one)
    new_fields = extract_smart_fields(text_two)

    changes = []

    for field in old_fields:
        if field in new_fields:
            if old_fields[field] != new_fields[field]:
                changes.append({
                    "field": field,
                    "old_value": old_fields[field],
                    "new_value": new_fields[field]
                })

    return changes
