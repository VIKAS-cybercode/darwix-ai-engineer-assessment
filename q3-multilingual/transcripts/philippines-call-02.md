# Philippines Call 2 — Partial Recording

## Scenario

Taglish business-loan qualification conversation.

The test was intended to evaluate natural Taglish interaction and financial-information objection handling.

## Status

**PARTIAL — ElevenLabs quota exhausted before the objection-handling stage.**

## Conversation

### Agent
Kumusta! Tumatawag ako upang tulungan kang suriin ang iyong paunang pagiging kwalipikado para sa pautang pangnegosyo. Magtatanong ako sa iyo ng ilang mabilis na tanong tungkol sa iyo at sa iyong negosyo. Magsimula na ba tayo?

### Customer
Yes, sure. Gusto ko sanang malaman kung eligible ako for a business loan.

### Agent
Magandang balita! Upang masuri kung ikaw ay paunang kwalipikado, kailangan naming sundin ang ilang pamantayan. Kabilang dito ang iyong edad na dapat ay hindi bababa sa dalawampu't isang taon, ang iyong negosyo ay dapat nakarehistro at tumatakbo na ng hindi bababa sa dalawang taon, at mayroong average na monthly turnover na hindi bababa sa tatlong lakhang rupees. Ang halaga ng hinihinging loan ay dapat nasa pagitan ng dalawang lakhang rupees hanggang dalawampu't limang lakhang rupees.

Magsisimula tayo sa pagkuha ng iyong pangalan at pangalan ng iyong negosyo. Ano ang iyong buong pangalan?

## Test Observations

- Filipino/Tagalog opening was produced successfully.
- Customer used natural Taglish: "Gusto ko sanang malaman kung eligible ako for a business loan."
- Agent continued in Filipino/Tagalog while retaining English/financial terminology.
- Qualification criteria were communicated before collecting applicant information.
- The recording could not continue to the planned financial-information objection because ElevenLabs reported insufficient credits.

## Expected Next Test

The intended objection was:

> Actually, medyo uncomfortable ako mag-share ng financial information. Kailangan ba talaga iyon?

This stage was **not recorded** and must not be represented as a completed live test.

## Limitation

ElevenLabs reported that the request required 84 credits while only 41 credits remained. No additional credits were purchased for this assessment.

## Result

**Partial pass for Taglish interaction; objection-handling test not completed in the recording.**
