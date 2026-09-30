CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS kb_documents (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(100) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kb_chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES kb_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    heading TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS kb_chunks_document_id_idx
ON kb_chunks(document_id);

CREATE INDEX IF NOT EXISTS kb_chunks_category_idx
ON kb_chunks USING GIN(metadata);

CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx
ON kb_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 10);