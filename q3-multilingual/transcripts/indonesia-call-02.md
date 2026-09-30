# Indonesia Call 2 — Colloquial Language and Market-Mismatch Escalation

## Scenario

Colloquial Indonesian conversation testing casual language, business-loan intent, currency clarification, market mismatch handling, and human escalation.

## Conversation

### Agent
The agent opened the conversation in Indonesian and asked whether the customer wanted to check eligibility for a business loan.

### Customer
Iya, boleh. Saya mau cek apakah saya bisa dapat pinjaman untuk usaha saya.

### Agent
The agent asked for the customer's name.

### Customer
Nama saya Vikas.

### Agent
The agent asked for the business name.

### Customer
Nama usaha saya Vikas Traders.

### Agent
The agent asked how long the business had been operating.

### Customer
Usaha saya sudah jalan sekitar empat tahun.

### Agent
The agent asked for the customer's age.

### Customer
Umur saya dua puluh delapan tahun.

### Agent
The agent asked whether the business was officially registered.

### Customer
Iya, usaha saya sudah terdaftar secara resmi.

### Agent
The agent asked for average monthly turnover.

### Customer
Omzet saya sekitar sepuluh juta rupiah per bulan.

### Agent
The agent explained that the configured qualification policy required a minimum monthly turnover of three lakh Indian Rupees and asked whether the customer's turnover was actually in Indian Rupees or whether the business operated in India.

### Customer
Usaha saya beroperasi di Indonesia, dan omzet saya memang dalam rupiah. Saya ingin melanjutkan dengan informasi tersebut.

### Agent
The agent explained that the current loan program was specifically configured for businesses operating in India and using Indian Rupees. It could not continue the qualification using the India-specific rules.

The agent offered human assistance to check whether another option might be available for businesses in Indonesia.

### Customer
Ya, saya ingin berbicara dengan perwakilan manusia untuk menanyakan apakah ada opsi pinjaman yang tersedia untuk usaha saya di Indonesia.

### Agent
The agent confirmed that a human representative would assist with options for the customer's Indonesian business.

### Customer
Baik, terima kasih atas bantuannya. Saya akan menunggu perwakilan manusia.

### Agent
The agent continued the human-transfer process and asked the customer to remain on the line.

### Customer
Sige, saya akan menunggu.

### Agent
The agent continued the transfer/connection message.

## Test Observations

- The customer used more casual Indonesian expressions such as "Iya, boleh", "saya mau cek", and "sudah jalan".
- The agent handled the conversation in Indonesian.
- The agent recognized that the customer's currency and operating market did not match the configured India-focused product.
- The agent did not fabricate Indonesian product rules or eligibility requirements.
- The agent used human escalation as the fallback.

## Result

**Pass for colloquial Indonesian interaction and safe market-mismatch escalation.**

## Limitation

The test exposed that the underlying product rules are India-specific. This recording therefore demonstrates localization, language adaptation, and safe fallback behavior rather than a fully localized Indonesian multifinance policy.
