from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from helpers import get_password_hash, verify_password, create_access_token
from models import Mortgage, get_db, Base,User
from pydantic import BaseModel
import jwt
import datetime
import os
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from dotenv import load_dotenv
from credit_rating import calculate_credit_rating
import logging
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 2

# Logger Setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger(__name__)


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = authorization.replace("Bearer ", "")  # Extract token from header
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(User).filter(User.username == payload["username"]).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

class UserCreate(BaseModel):
    username: str
    password_hash: str

class UserLogin(BaseModel):
    username: str
    password_hash: str

class TokenData(BaseModel):
    username: str
    exp: datetime.datetime

class MortgageCreate(BaseModel):
    id: int | None = None
    credit_score: int
    loan_amount: float
    property_value: float
    annual_income: float
    debt_amount: float
    loan_type: str
    property_type: str
    credit_rating: str | None = None

class MortgageUpdate(BaseModel):
    credit_score: Optional[int] = None
    loan_amount: Optional[float] = None
    property_value: Optional[float] = None
    annual_income: Optional[float] = None
    debt_amount: Optional[float] = None
    loan_type: Optional[str] = None
    property_type: Optional[str] = None

# FastAPI App Setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Endpoints
@app.post("/api/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
   try:
    print(1)

    # if db.query(User).filter(User.username == user.username).first():
    #     raise HTTPException(status_code=400, detail="Username already taken")
    print(2)
    hashed_password = get_password_hash(user.password_hash)
    new_user = User(username=user.username, password_hash=hashed_password)

    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}
   except Exception as e:
       print('err',e)

@app.post("/api/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    user_record = db.query(User).filter(User.username == user.username).first()
    if not user_record or not verify_password(user.password_hash, user_record.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"username": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/auth/logout")
def logout():
    return {"message": "Logged out successfully"}

@app.get("/api/auth/validate")
def validate_user(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mortgages = db.query(Mortgage).filter(Mortgage.user_id == user.id).all()
    return {"username": user.username, "mortgages": mortgages}

# Mortgage Routes with Authentication
@app.post("/api/mortgages", response_model=MortgageCreate)
def add_mortgage(mortgage: MortgageCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_mortgage = Mortgage(**mortgage.dict(exclude={"id", "credit_rating"}), user_id=user.id)
    db.add(new_mortgage)
    db.commit()
    db.refresh(new_mortgage)
    new_mortgage.credit_rating = calculate_credit_rating(new_mortgage, db)
    logger.info("New mortgage added: %s", new_mortgage)
    return new_mortgage


@app.get("/api/mortgages", response_model=List[MortgageCreate])
def get_mortgages(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    mortgages = db.query(Mortgage).filter(Mortgage.user_id == user.id).all()
    for mortgage in mortgages:
        mortgage.credit_rating = calculate_credit_rating(mortgage, db)
    return mortgages

@app.put("/api/mortgages/{mortgage_id}", response_model=MortgageUpdate)
def update_mortgage(mortgage_id: int, mortgage_data: MortgageUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id, Mortgage.user_id == user.id).first()
    if not mortgage:
        raise HTTPException(status_code=404, detail="Mortgage not found")
    update_data = mortgage_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(mortgage, key, value)
    db.commit()
    db.refresh(mortgage)
    return mortgage

@app.delete("/api/mortgages/{mortgage_id}", status_code=204)
def delete_mortgage(mortgage_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id, Mortgage.user_id == user.id).first()
    if not mortgage:
        raise HTTPException(status_code=404, detail="Mortgage not found")
    db.delete(mortgage)
    db.commit()
    return {"message": "Mortgage deleted successfully"}
