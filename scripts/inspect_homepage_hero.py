from bs4 import BeautifulSoup

def inspect_home():
    with open("reference/pages/home.html", "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    main = soup.find("main")
    if not main:
        print("No main")
        return

    # Find the hero / top banner
    sections = main.find_all("section")
    print(f"Home has {len(sections)} sections")
    for i, s in enumerate(sections[:3]):
        print(f"Section {i}: class={s.get('class')}, id={s.get('id')}")

    # Search for "hm?" or puppy cards
    hero = sections[0] if sections else None
    if hero:
        with open("reference/home_hero_sample.html", "w", encoding="utf-8") as out:
            out.write(str(hero))
        print("Saved reference/home_hero_sample.html, len:", len(str(hero)))

if __name__ == "__main__":
    inspect_home()

