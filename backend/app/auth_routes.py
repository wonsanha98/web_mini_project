# app/auth_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database, security
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 회원가입 요청을 처리하는 API이다.
@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 이미 등록된 사용자인지 확인한다.
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자입니다.")
    
    # 사용자 비밀번호를 해싱하여 저장한다.
    hashed_pw = security.hash_password(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 로그인 요청을 처리하는 API이다.
@router.post("/login", response_model=schemas.Token)
# 클라이언트에서 보낸 username과 password를 받아오는 FastAPI 기본 제공 의존성이다.
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="아이디 또는 비밀 번호가 틀렸습니다.")
    # 로그인 성공 시 JWT 토큰을 생성해 응답한다.
    access_token = security.create_access_token(data={"sub":user.username})
    return {"access_token": access_token, "token_type": "bearer"}