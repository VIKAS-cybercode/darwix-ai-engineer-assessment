# Q3 — Localization Comparison

## Overview

The multilingual tests evaluated English-default behavior against Filipino/Taglish and Indonesian/Bahasa Indonesia. The current agent uses the same underlying India-focused business-loan qualification logic across languages. Therefore, the comparison focuses on language adaptation, code-switching, terminology, safe fallback behavior, and observed gaps.

## Comparison

| Area | English | Philippines — Filipino/Taglish | Indonesia — Bahasa Indonesia |
|---|---|---|---|
| Default language | English | Filipino/Taglish selected by language configuration | Indonesian selected by language configuration |
| Product tested | India-focused business loan | Same India-focused business loan | Same India-focused business loan |
| Localized interaction | Native English flow | Filipino with natural English finance terms | Formal and colloquial Indonesian |
| Code-switching | Limited | Business loan, monthly turnover, human representative | apply, loan, eligible, inventory |
| Currency observed | Indian Rupees | Philippine Pesos | Indonesian Rupiah |
| Market mismatch handling | India rules applied | Philippines detected as unsupported market | Indonesia detected as unsupported market |
| Unsupported-policy behavior | KB fallback / human escalation | Human escalation | Human escalation |
| Product-domain match to Q3 assignment | Partial | Gap: assignment requests life insurance/bancassurance | Gap: assignment requests multifinance/consumer finance |

## Philippines — Three Localization Examples

### Example 1 — Eligibility intent

**Customer**

`Oo, sige. Gusto kong malaman kung kwalipikado ako sa business loan.`

**Observed behavior**

The agent continued the qualification flow in Filipino/Taglish.

**Localization signal**

The Filipino word `kwalipikado` was used naturally alongside the English finance term `business loan`.

### Example 2 — Mixed financial terminology

**Customer**

`Ang average na monthly turnover ng negosyo ko ay humigit-kumulang sampung milyong piso kada buwan.`

**Observed behavior**

The agent understood the turnover information and continued to currency/market clarification.

**Localization signal**

The sentence combines Filipino grammar with the English finance term `monthly turnover`.

### Example 3 — Currency and market clarification

**Customer**

`Ang tinutukoy kong sampung milyong piso ay nasa Philippine pesos, hindi Indian Rupees. Ang negosyo ko ay nasa Pilipinas.`

**Observed behavior**

The agent recognized that the currency and market did not match the India-specific qualification policy and escalated rather than inventing Philippine eligibility rules.

**Localization signal**

The interaction naturally combines Filipino, Philippine financial terminology, and English currency terminology.

## Indonesia — Three Localization Examples

### Example 1 — Colloquial eligibility request

**Customer**

`Iya, boleh. Saya mau cek apakah saya bisa dapat pinjaman untuk usaha saya.`

**Observed behavior**

The agent continued the qualification flow in Indonesian.

**Localization signal**

The phrasing uses casual Indonesian expressions such as `Iya, boleh` and `saya mau cek`.

### Example 2 — Colloquial business-duration phrasing

**Customer**

`Usaha saya sudah jalan sekitar empat tahun.`

**Observed behavior**

The agent interpreted the business operating duration and continued the qualification flow.

**Localization signal**

`sudah jalan` is a more conversational expression than a formal business-duration formulation.

### Example 3 — Indonesian financial terminology

**Customer**

`Omzet saya sekitar sepuluh juta rupiah per bulan.`

**Observed behavior**

The agent recognized the amount as Indonesian Rupiah and asked for market/currency clarification rather than silently applying the India-specific threshold.

**Localization signal**

`omzet` and `rupiah` provide natural Indonesian business/financial terminology.

## Formal vs Colloquial Indonesian

The two Indonesia recordings intentionally covered different registers.

### More formal

`Usaha saya beroperasi di Indonesia, dan omzet saya memang dalam rupiah.`

This is appropriate for a more formal customer-service interaction.

### More colloquial

`Iya, boleh. Saya mau cek apakah saya bisa dapat pinjaman untuk usaha saya.`

This is more conversational and reflects everyday customer speech.

### Additional colloquial expression

`Usaha saya sudah jalan sekitar empat tahun.`

This demonstrates conversational phrasing for business duration.

## Key Findings

1. The agent can switch from English to Filipino/Taglish and Indonesian.
2. Filipino interactions naturally retained English finance terms.
3. Indonesian interactions supported both formal and colloquial registers.
4. Currency and market mismatches were handled conservatively.
5. The agent did not continue using India-specific rules when the customer clearly identified a different market.
6. Human escalation provided a safe fallback when the configured policy did not cover the customer's market.

## Known Gaps

The assignment's Q3 target domains are different from the current tested product:

- Philippines: life insurance / bancassurance
- Indonesia: multifinance / consumer finance

The current recordings therefore demonstrate multilingual voice behavior and safe fallback, but they should not be presented as a complete production localization of those target financial products.

The Indonesia tests also did not validate a regional accent outside standard Jakarta Indonesian.

The Philippines tests did not provide native-speaker validation of pronunciation or accent quality.

The current voice agent remains dependent on the India-focused knowledge base and qualification rules.
