# Q3 — Multilingual Terminology

## Purpose

This document records terminology and language patterns observed during the multilingual voice tests. The current voice agent is configured for an India-focused business-loan product, while the assignment asks for Philippines life insurance/bancassurance and Indonesia multifinance/consumer finance. The examples below therefore document localization behavior and terminology handling rather than claiming full product-domain localization.

## Philippines — Filipino / Taglish

| English concept | Filipino / Taglish example | Usage |
|---|---|---|
| Business loan | business loan / pautang pangnegosyo | English finance term can be used naturally within Filipino |
| Eligible | kwalipikado / eligible | Both Filipino and English forms were observed |
| Business | negosyo | Common Filipino term |
| Monthly turnover | monthly turnover | English finance terminology used naturally |
| Registered business | nakarehistro na ang negosyo | Natural Filipino phrasing |
| Human representative | human representative | English phrase used naturally in a Taglish context |
| Philippine Peso | Philippine pesos / piso | Currency clarification during market-mismatch test |
| Financial information | financial information | English finance phrase retained in localized speech |

### Observed Filipino examples

1. `Oo, sige. Gusto kong malaman kung kwalipikado ako sa business loan.`
2. `Ang average na monthly turnover ng negosyo ko ay humigit-kumulang sampung milyong piso kada buwan.`
3. `Ang tinutukoy kong sampung milyong piso ay nasa Philippine pesos, hindi Indian Rupees.`

## Indonesia — Bahasa Indonesia

| English concept | Indonesian example | Usage |
|---|---|---|
| Business loan | pinjaman usaha | Indonesian business-loan term |
| Eligible | memenuhi syarat / eligible | Indonesian and English forms can be mixed |
| Apply | apply | Common English loanword in informal finance conversations |
| Loan | loan / pinjaman | English loanword may appear in colloquial speech |
| Business | usaha / bisnis | Both are used depending on phrasing |
| Monthly turnover | omzet per bulan | Natural Indonesian business terminology |
| Registered business | usaha sudah terdaftar secara resmi | Formal registration phrasing |
| Human representative | perwakilan manusia | Used for escalation |
| Indonesian Rupiah | rupiah | Currency used in Indonesia |
| Inventory | stok barang | Natural Indonesian business terminology |

### Observed Indonesian examples

1. `Iya, boleh. Saya mau cek apakah saya bisa dapat pinjaman untuk usaha saya.`
2. `Usaha saya sudah jalan sekitar empat tahun.`
3. `Omzet saya sekitar sepuluh juta rupiah per bulan.`

## Localization Notes

### Philippines

The agent supported Filipino/Taglish interaction and retained English financial terminology where it appeared naturally. The test also demonstrated that the agent could recognize Philippine Pesos as different from Indian Rupees and avoid applying the India-specific threshold.

### Indonesia

The agent supported both more formal Indonesian and colloquial expressions. Examples included `Iya, boleh`, `saya mau cek`, and `sudah jalan`. The agent also recognized Indonesian Rupiah and avoided inventing Indonesian eligibility rules when the configured India-specific product did not apply.

## Product-Domain Gap

The terminology observed above relates primarily to the tested business-loan agent. The assignment's requested Q3 domains are:

- Philippines: life insurance / bancassurance
- Indonesia: multifinance / consumer finance

A production implementation would require additional domain-specific terminology, policies, disclosures, and localized qualification rules for those products.
