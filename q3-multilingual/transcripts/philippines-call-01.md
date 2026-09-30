# Philippines Call 1 — Filipino Qualification and Market-Mismatch Escalation

## Scenario

Filipino/Tagalog business-loan qualification conversation testing localized language, qualification flow, Philippine Peso handling, market mismatch detection, and human escalation.

## Conversation

### Agent
Kumusta! Tumatawag ako upang tulungan kang suriin ang iyong paunang pagiging kwalipikado para sa pautang pangnegosyo. Magtatanong ako sa iyo ng ilang mabilis na tanong tungkol sa iyo at sa iyong negosyo. Magsimula na ba tayo?

### Customer
Oo, sige. Gusto kong malaman kung kwalipikado ako sa business loan.

### Agent
The agent asked for the customer's name and business name.

### Customer
Ang pangalan ko ay Vikas, at ang pangalan ng negosyo ko ay Vikas Traders.

### Agent
The agent asked how long the business had been operating.

### Customer
Tatlong taon nang tumatakbo ang negosyo ko.

### Agent
The agent asked for the applicant's age.

### Customer
Dalawampu't walong taong gulang ako.

### Agent
The agent asked whether the business was registered with the relevant government agencies.

### Customer
Oo, nakarehistro na ang negosyo ko sa mga kaukulang ahensya ng gobyerno.

### Agent
The agent asked for the average monthly turnover.

### Customer
Ang average na monthly turnover ng negosyo ko ay humigit-kumulang sampung milyong piso kada buwan.

### Agent
The agent explained that the configured qualification policy required a minimum turnover equivalent to three lakh Indian Rupees and asked whether the stated amount was in Indian Rupees or another currency.

### Customer
Ang tinutukoy kong sampung milyong piso ay nasa Philippine pesos, hindi Indian Rupees. Ang negosyo ko ay nasa Pilipinas.

### Agent
The agent explained that the current qualification process was configured for businesses operating in India using Indian Rupees and therefore could not assess the application using those rules.

The agent offered to connect the customer with a human representative to check whether another option was available for businesses in the Philippines.

### Customer
Oo, paki-connect ako sa isang human representative. Gusto kong malaman kung may available na option para sa mga negosyo sa Pilipinas.

### Agent
The agent confirmed the human escalation and stated that a human representative could provide information about options for Philippine businesses.

### Customer
Wala na po. Salamat sa tulong ninyo. Handa na akong makipag-usap sa human representative.

### Agent
The agent stated that the customer was being transferred to a human representative.

### Customer
Oo, nandito pa ako. Salamat, maghihintay ako.

### Agent
The agent continued the transfer/connection message.

### Customer
Sige, maghihintay ako. Salamat sa tulong ninyo.

### Agent
The agent continued the human-transfer closing.

## Test Observations

- Filipino/Tagalog was used throughout the interaction.
- The customer used natural Filipino business-loan language.
- English finance terminology such as "business loan" and "monthly turnover" was used naturally within the conversation.
- The agent followed the qualification flow.
- The agent detected that the customer was using Philippine Pesos rather than Indian Rupees.
- The agent did not invent Philippines-specific loan eligibility rules.
- The agent safely escalated to a human representative when the configured product did not support the customer's market.

## Result

**Pass for Filipino localization and safe market-mismatch handling.**

## Limitation

The underlying qualification knowledge base is India-focused. This recording demonstrates language localization and safe fallback behavior, but it does not represent a fully localized Philippines life-insurance/bancassurance policy implementation.
