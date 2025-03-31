from sqlalchemy import create_engine, Column, Integer, Float, Enum, TIMESTAMP, func, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:root123@localhost/mortgage_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Authentication Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    mortgages = relationship("Mortgage", backref="user")



class Mortgage(Base):
    __tablename__ = "mortgages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    credit_score = Column(Integer, nullable=False)
    loan_amount = Column(Float, nullable=False)
    property_value = Column(Float, nullable=False)
    annual_income = Column(Float, nullable=False)
    debt_amount = Column(Float, nullable=False)
    loan_type = Column(String(255), nullable=False)
    property_type = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

# Ensure table creation
Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
