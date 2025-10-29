## 📦 Installation

```bash
git clone https://github.com/Sandesh-Thapa/patient-education-RAG.git
cd patient-education-RAG/backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

## ⚙️ Configuration

```bash
cp .env.example .env
```

Update .env file accordingly

---

## 📂 Ingest document

```python
python .\rag\load_to_vector_store.py 
```

---

## Run API

```python
uvicorn api.main:app --reload
```
