import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from uuid import uuid4
from vector_db import get_vector_db_index

data_dir = os.path.join(os.path.dirname(__file__), "data")
print(f"\nLoading PDFs from: {data_dir}")

loader = PyPDFDirectoryLoader(data_dir)
docs = loader.load()
print(f"Loaded {len(docs)} document(s).")

if not docs:
    print("⚠️ No PDF files found in the data directory. Exiting.")
    exit()

print("\nSplitting documents into text chunks...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200, add_start_index=True
)

all_splits = text_splitter.split_documents(docs)
print(f"Created {len(all_splits)} text chunks in total.")

if not all_splits:
    print("⚠️ No text chunks were created. Check your PDFs or splitter settings.")
    exit()

print("\nConnecting to Pinecone index...")
index = get_vector_db_index()
print("Pinecone index ready.")

print("\nClearing existing vectors in namespace 'ns1'...")
try:
    index.delete(namespace="ns1", delete_all=True)
    print("Cleared all vectors from namespace 'ns1'.")
except Exception as e:
    print(f"⚠️ Could not clear namespace 'ns1': {e}")

print("\nUploading new text chunks to Pinecone...")
successful, failed = 0, 0

for i, doc in enumerate(all_splits, start=1):
    vector_id = str(uuid4())
    record = {
        "_id": vector_id,
        "chunk_text": doc.page_content
    }

    try:
        index.upsert_records("ns1", [record])
        successful += 1
        print(f"[{i}] Inserted record with ID: {vector_id}")
    except Exception as e:
        failed += 1
        print(f"[{i}] Failed to insert record: {e}")

print("\n📊 Summary:")
print(f"   ✅ Successful inserts: {successful}")
print(f"   ❌ Failed inserts: {failed}")
print(f"\n🎯 Done. Uploaded {successful} text chunks to Pinecone.\n")
