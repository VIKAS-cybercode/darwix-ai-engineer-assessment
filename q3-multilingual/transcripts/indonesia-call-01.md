# Indonesia Call 1 — Full Qualification Call

## Scenario

Indonesian business-loan qualification conversation demonstrating formal Bahasa Indonesia, English finance terminology, qualification flow, preliminary eligibility, and human follow-up.

## Conversation

### Agent
Hai! Saya menelepon untuk membantu Anda memeriksa kelayakan awal Anda untuk pinjaman usaha. Saya akan mengajukan beberapa pertanyaan singkat tentang Anda dan usaha Anda. Apakah kita bisa mulai?

### Customer
Ya, tentu. Saya ingin mengetahui apakah saya memenuhi syarat untuk pinjaman usaha.

### Agent
Baik, terima kasih. Untuk memulai proses pemeriksaan kelayakan awal, bolehkah saya mengetahui nama lengkap Anda terlebih dahulu?

### Customer
Nama saya Vikas.

### Agent
Terima kasih, Vikas. Selanjutnya, bolehkah saya mengetahui nama usaha Anda?

### Customer
Nama usaha saya adalah Vikas Traders.

### Agent
[Agent asks about business operating age.]

### Customer
Usaha saya sudah berjalan selama tiga tahun.

### Agent
[Agent asks about applicant age.]

### Customer
Umur saya dua puluh delapan tahun.

### Agent
[Agent asks about business registration.]

### Customer
Ya, usaha saya sudah terdaftar.

### Agent
[Agent asks about monthly turnover.]

### Customer
Omzet saya sekitar sepuluh juta rupiah per bulan.

### Agent
The agent identified that the configured qualification rule uses a minimum turnover of three lakh Indian Rupees and asked for clarification because the customer had provided the amount in Indonesian Rupiah.

### Customer
Usaha saya beroperasi di Indonesia, dan omzet saya memang dalam rupiah. Saya ingin melanjutkan dengan informasi tersebut.

### Agent
The agent explained that the configured loan program was for businesses operating in India using Indian Rupees and therefore could not continue qualification under those rules.

The agent offered to connect the customer with a human representative to check whether another option might be available for Indonesia.

### Customer
Ya, saya ingin berbicara dengan perwakilan manusia untuk menanyakan apakah ada opsi pinjaman yang tersedia untuk usaha saya di Indonesia.

### Agent
The agent confirmed the human escalation and stated that a representative would assist with options for the customer's business.

### Customer
Baik, terima kasih atas bantuannya. Saya akan menunggu perwakilan manusia.

### Agent
The agent continued with the human-transfer closing.

### Customer
Ya, saya masih di sini. Terima kasih atas bantuannya. Sampai jumpa.

### Agent
Final closing message was delivered by the agent.

## Test Observations

- Indonesian language was used throughout the call.
- Customer responses included natural Indonesian business and finance terminology.
- The conversation followed the qualification flow.
- The agent detected the currency/market mismatch instead of silently treating Indonesian Rupiah as Indian Rupees.
- The agent did not invent Indonesia-specific loan eligibility rules.
- The agent offered human escalation when the configured product could not support the customer's market.

## Result

**Pass for Indonesian localization and safe market-mismatch handling.**

## Limitation

The underlying qualification knowledge base is India-focused. Therefore, this recording demonstrates multilingual/localization behavior and safe fallback rather than a production-ready Indonesia-specific multifinance policy implementation.
