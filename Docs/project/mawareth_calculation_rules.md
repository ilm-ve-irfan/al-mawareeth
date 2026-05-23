# Mawareth Calculation Rules (قواعد حساب المواريث)

> Source: scanned reference sheet (`فرائض.pdf`) provided by the project owner.
> Purpose: serve as the canonical specification for the inheritance‑calculation
> functions to be implemented in `backend/` and `mobile/`.

This document is the rule set the calculator must enforce. Arabic terms are kept
in parentheses where they are definitional in fiqh.

---

## 1. Definitions

- **Male descendant heir** (الفرع الوارث الذكر): the son (الابن) and the son's
  son no matter how far down (ابن الابن مهما نزل).
- **Female descendant heir** (الفرع الوارث الأنثى): the daughter (البنت) and
  the son's daughter no matter how far her father descends
  (بنت الابن مهما نزل أبوها).
- **ʿAṣaba** (عصبة): residuary heir — takes whatever remains after the
  fixed‑share holders, or the entire estate if alone.
- **Fixed share** (فرض): one of {1/2, 1/4, 1/8, 2/3, 1/3, 1/6}.
- **Muʿaṣṣib** (المعصِّب): a male heir who turns a female of the same class
  into a residuary alongside him (e.g. son → daughter, son's son → son's
  daughter, brother → sister).
- **Ḥajb** (الحجب): blocking — an heir is excluded from the estate by the
  presence of a closer heir.

---

## 2. Male Heirs (الوارثون من الرجال)

### 2.1 Son — الابن
- Always ʿaṣaba.
- Takes the entire estate if alone, and whatever the fixed shares leave
  otherwise.

### 2.2 Son's son — ابن الابن
- ʿaṣaba.
- **Blocked by:** the son.

### 2.3 Father — الأب
- **1/6** with a male descendant heir.
- **1/6 + ʿaṣaba** with a female descendant heir (no male descendant).
- **ʿaṣaba** when there is no descendant heir at all.

### 2.4 Paternal grandfather — الجد (أبو الأب)
- **1/6** with a male descendant heir.
- **1/6 + ʿaṣaba** with a female descendant heir.
- **ʿaṣaba** when there is no descendant heir.
- **Blocked by:** the father.
- Special interaction with siblings: see §5.

### 2.5 Full brother — الأخ الشقيق
- ʿaṣaba.
- **Blocked by:** son, son's son, father.

### 2.6 Paternal half‑brother — الأخ لأب
- ʿaṣaba.
- **Blocked by:** son, son's son, father, full brother.

### 2.7 Maternal half‑brother — الأخ لأم
- **1/6** if single and not blocked.
- **1/3** (shared with other maternal siblings) if two or more, and not
  blocked.
- **Blocked by:** son, son's son, daughter, son's daughter, father,
  grandfather.

### 2.8 Full brother's son — ابن الأخ الشقيق
- ʿaṣaba.
- **Blocked by:** son, son's son, father, grandfather, full brother,
  paternal half‑brother.

### 2.9 Paternal half‑brother's son — ابن الأخ لأب
- ʿaṣaba.
- **Blocked by:** all of §2.8 plus the full brother's son.

### 2.10 Full paternal uncle — العم الشقيق
- ʿaṣaba.
- **Blocked by:** son, son's son, father, grandfather, full brother,
  paternal half‑brother, full brother's son, paternal half‑brother's son.

### 2.11 Paternal half‑uncle — العم لأب
- ʿaṣaba.
- **Blocked by:** all of §2.10 plus the full paternal uncle.

### 2.12 Full paternal cousin — ابن العم الشقيق
- ʿaṣaba.
- **Blocked by:** all of §2.11 plus the paternal half‑uncle.

### 2.13 Paternal half cousin — ابن العم لأب
- ʿaṣaba.
- **Blocked by:** all of §2.12 plus the full paternal cousin.

### 2.14 Husband — الزوج
- **1/2** when the wife has no descendant heir.
- **1/4** when the wife has a descendant heir.

### 2.15 Male emancipator — المعتق
- ʿaṣaba.
- **Blocked by:** every male relative listed in §2.1–§2.13 (son, son's son,
  father, grandfather, full brother, paternal half‑brother, full brother's
  son, paternal half‑brother's son, full uncle, paternal half‑uncle, full
  cousin, paternal half cousin).

---

## 3. Female Heirs (الوارثات من النساء)

### 3.1 Daughter — البنت
- **1/2** if she is the only daughter and there is no muʿaṣṣib (no son).
- **2/3** if two or more daughters and there is no son.
- **ʿaṣaba with the son** — the rule "للذكر مثل حظ الأنثيين"
  (male takes twice the female share).

### 3.2 Son's daughter — بنت الابن
- **1/2** if she is alone, with no son, no daughter, and no muʿaṣṣib
  (son's son).
- **2/3** if two or more, same conditions.
- **1/6** alongside a single daughter — to complete the 2/3 group share
  (تكملة الثلثين).
- **ʿaṣaba with the son's son.**
- **Ḥajb ḥirmān (full exclusion):** by the son, or by the presence of
  multiple daughters (when there is no son's son to pull her into ʿaṣaba).

### 3.3 Full sister — الأخت الشقيقة
- **1/2** if single and there is no descendant heir, no father, no
  grandfather, and no muʿaṣṣib (no full brother).
- **2/3** if two or more, same conditions.
- **ʿaṣaba bi‑l‑ghayr** (residuary *through* another) with the full brother.
- **ʿaṣaba maʿa al‑ghayr** (residuary *alongside* another) with a daughter
  or a son's daughter.
- **Blocked by:** male descendant heir, father.

### 3.4 Paternal half‑sister — الأخت لأب
- **1/2** if single and there is no descendant heir, no father, no
  grandfather, no full brother, no full sister, and no muʿaṣṣib (no
  paternal half‑brother).
- **2/3** if two or more, same conditions.
- **1/6** alongside a single full sister (تكملة الثلثين).
- **ʿaṣaba bi‑l‑ghayr** with the paternal half‑brother.
- **ʿaṣaba maʿa al‑ghayr** with a daughter or a son's daughter.
- **Blocked by:** male descendant heir, father, full brother.

### 3.5 Maternal half‑sister — الأخت لأم
- **1/6** if single and not blocked.
- **1/3** (shared) if two or more and not blocked.
- **Blocked by:** son, son's son no matter how far, father, grandfather,
  daughter, son's daughter.
- *Note:* maternal half‑siblings (brothers and sisters together) share their
  1/3 equally — no "male takes twice" rule applies to maternal siblings.

### 3.6 Mother — الأم
- **1/6** when there is a descendant heir, or with a group of siblings
  (الإخوة والأخوات) — "a group" meaning two or more siblings of any kind.
- **1/3** when there is no descendant heir and no group of siblings.
- **1/3 of the remainder** (ثلث الباقي) in the two ʿUmariyyatān cases:
  - (husband, mother, father)
  - (wife, mother, father)
  In both, the mother takes one third of what remains after the spouse's
  fixed share, not 1/3 of the whole estate.

### 3.7 Grandmother — الجدة
- **1/6** when there is no mother.
- **Blocked by:** the mother.

### 3.8 Wife — الزوجة
- **1/4** when the husband has no descendant heir.
- **1/8** when the husband has a descendant heir.
- Multiple wives share the same 1/4 or 1/8 equally.

### 3.9 Female emancipator — المعتقة
- ʿaṣaba.
- **Blocked by:** son, son's son, father, grandfather, full brother,
  paternal half‑brother, full uncle, paternal half‑uncle, full paternal
  cousin, paternal half cousin.

---

## 4. Deriving the Origin of the Problem (أصل المسألة)

The "origin" is the common denominator the estate is divided into before
distributing shares. Four cases govern how to combine the denominators of
the fixed shares present in a given problem:

### 4.1 Identity — التماثل
When the denominators are the same — e.g. (1/6, 1/6) or (1/2, 1/2) or
(1/3, 2/3) — take one of them as the origin.

### 4.2 Agreement — التوافق
When the denominators share a common factor but neither contains the other
— e.g. (1/6, 1/4) or (1/6, 1/8) — multiply *half* of one by the other and
use the product as the origin.

### 4.3 Inclusion — التداخل
When the larger denominator is a multiple of the smaller — e.g. (1/2, 1/4)
or (1/2, 1/8) or (1/3, 1/6) — take the larger denominator as the origin.

### 4.4 Disjoint — التباين
When the denominators share no common factor — e.g. (1/3, 1/4) or
(2/3, 1/8) or (1/2, 1/3) — multiply the denominators together and use the
product as the origin.

---

## 5. Grandfather with Siblings (الجد مع الإخوة والأخوات الأشقاء أو لأب)

When the paternal grandfather coexists with full or paternal half‑siblings
(brothers and/or sisters), he is given the best of four possibilities:

1. **Full 1/3** (الثلث كاملاً) — given when there is no fixed‑share holder
   (صاحب فرض) in the case.
2. **ʿAṣaba by muqāsama** (المقاسمة) — shared with the siblings as if he
   were one of them.
3. **1/3 of the remainder** (ثلث الباقي) — given when there is a
   fixed‑share holder.
4. **1/6** (السدس) — mandatory for him when the remainder is 1/6 or less,
   or when nothing is left of the estate.
   Example: (wife, two daughters, mother, grandfather, full brother).

### 5.1 Heuristics — No fixed‑share holder present
1. **Full 1/3 is better** for the grandfather if the siblings together
   exceed twice his share.
   Example: (grandfather, 3 brothers).
2. **ʿAṣaba (muqāsama) is better** for him if the siblings are fewer than
   twice his share.
   Example: (grandfather, 1 full brother).

### 5.2 Heuristics — Fixed‑share holder present
1. **1/3 of the remainder is better** when the remainder is more than 1/2
   *and* the siblings exceed twice his share.
   Example: (wife, grandfather, 3 brothers).
2. **1/6 is better** when the remainder is between 1/6 and 1/2 *and* the
   siblings exceed twice his share.
   Example: (wife, mother, grandfather, 3 brothers).

The calculator must compute all applicable options and assign the
grandfather whichever yields the largest share, subject to the mandatory
1/6 floor in case 4.

---

## 6. Notes for Implementation

The following are not separate rules from the source sheet, but
clarifications worth recording before code is written against this spec:

- **ʿAwl** (العول) and **radd** (الرد) are *not* covered in the source
  sheet and must be specified separately before implementation. Flag any
  problem whose fixed shares sum > 1 (ʿawl) or < 1 with no ʿaṣaba (radd).
- **Distance rules** for inheritance (ابن الابن مهما نزل, الجد العالي,
  بنت الابن مهما نزل أبوها) imply recursive descent/ascent. The data model
  must represent depth, not just a flat heir list.
- **Order of blocking matters.** A full ḥajb evaluation should run before
  fixed shares are assigned; otherwise, a blocked heir may incorrectly
  consume a share.
- **Spouses are never blocked** by any other heir.
- **Source authority.** This file is a transcription/translation of the
  attached reference sheet. Where this spec is ambiguous, the source sheet
  prevails; where the source is itself silent (e.g. ʿawl, radd, dhawū
  al‑arḥām), defer to a named fiqh reference before encoding.
