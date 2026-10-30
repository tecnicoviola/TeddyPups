import os
import re
from bs4 import BeautifulSoup
import json

def inspect_interactions():
    with open("reference/pages/puppies.html", "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Find forms, inputs, buttons, selects
    buttons = soup.find_all("button")
    inputs = soup.find_all("input")
    selects = soup.find_all("select")
    forms = soup.find_all("form")
    
    print(f"Buttons: {len(buttons)}, Inputs: {len(inputs)}, Selects: {len(selects)}, Forms: {len(forms)}")

    btn_details = []
    for b in buttons:
        btn_details.append({
            "text": b.get_text(strip=True),
            "type": b.get("type"),
            "class": b.get("class"),
            "aria": {k: v for k, v in b.attrs.items() if k.startswith("aria-")}
        })

    input_details = []
    for inp in inputs:
        input_details.append({
            "type": inp.get("type"),
            "name": inp.get("name"),
            "placeholder": inp.get("placeholder"),
            "value": inp.get("value"),
            "class": inp.get("class")
        })

    # Also check contact page and how-it-works page
    with open("reference/pages/contact.html", "r", encoding="utf-8") as f:
        c_soup = BeautifulSoup(f.read(), "html.parser")
    
    contact_forms = c_soup.find_all("form")
    contact_inputs = c_soup.find_all("input")
    contact_textareas = c_soup.find_all("textarea")
    print(f"Contact Page - Forms: {len(contact_forms)}, Inputs: {len(contact_inputs)}, Textareas: {len(contact_textareas)}")

    results = {
        "puppies_buttons": btn_details,
        "puppies_inputs": input_details,
        "contact_inputs": [
            {
                "type": i.get("type"),
                "name": i.get("name"),
                "placeholder": i.get("placeholder")
            } for i in contact_inputs
        ],
        "contact_textareas": [
            {
                "name": t.get("name"),
                "placeholder": t.get("placeholder")
            } for t in contact_textareas
        ]
    }

    with open("reference/data/interactions_summary.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("Interactions summary saved.")

if __name__ == "__main__":
    inspect_interactions()

