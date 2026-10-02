import sqlite3
import json
from datetime import datetime

DB_NAME = "viyora.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Transactions
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount INTEGER,
        date TEXT,
        customer TEXT,
        recipient TEXT,
        status TEXT,
        gateway TEXT,
        risk TEXT,
        type TEXT
    )
    ''')
    
    # Incidents
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        transaction_id TEXT,
        status TEXT,
        type TEXT,
        risk TEXT,
        resolution TEXT
    )
    ''')
    
    # Events
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS incident_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT,
        timestamp TEXT,
        message TEXT,
        type TEXT,
        data TEXT
    )
    ''')
    
    # Seed Data
    cursor.execute('SELECT COUNT(*) FROM transactions')
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)
        
    conn.commit()
    conn.close()

def seed_data(cursor):
    now = datetime.now().isoformat()
    txs = [
        ("TXN-VYR-1001", 500, now, "Rahul", "Swiggy", "SUCCESS", "SUCCESS", "LOW", "PAYMENT"),
        ("TXN-VYR-1002", 1200, now, "Rahul", "Amazon", "SUCCESS", "SUCCESS", "LOW", "PAYMENT"),
        ("TXN-VYR-1003", 250, now, "Rahul", "Uber", "SUCCESS", "SUCCESS", "LOW", "PAYMENT"),
        ("TXN-VYR-1004", 850, now, "Rahul", "Zomato", "PENDING", "PENDING", "LOW", "PAYMENT"),
        ("TXN-VYR-1005", 2000, now, "Rahul", "Flipkart", "SUCCESS", "SUCCESS", "LOW", "PAYMENT"),
        ("TXN-VYR-5001", 5000, now, "Rahul", "ABC Electronics", "TIMEOUT", "TIMEOUT", "HIGH", "PAYMENT"),
    ]
    cursor.executemany('''
    INSERT INTO transactions (id, amount, date, customer, recipient, status, gateway, risk, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', txs)
    
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn
