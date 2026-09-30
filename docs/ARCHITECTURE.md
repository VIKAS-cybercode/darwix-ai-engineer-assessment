# Initial Architecture

```text
Synthetic documents -> parse/clean -> chunk -> embeddings + metadata
                                      -> PostgreSQL + pgvector
                                      -> retrieval -> Q1 voice agent
                                                     -> qualification state
                                                     -> human escalation
                                                     -> Q4 live signals/nudges
Q3 reuses the grounding pattern with localized scripts and terminology.
```
