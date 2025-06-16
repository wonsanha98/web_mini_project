# app/security.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import models 
from .database import SessionLocal

from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 비밀번호 해싱 알고리즘 설정이다.(bcrypt 사용)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 토큰을 추출하는 OAuth2PasswordBearer 의존성
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# 사용자 비밀번호를 안전하게 해싱한다.
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# 입력한 비밀번호와 DB의 해시된 비밀번호가 일치하는지 검사한다.
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 로그인 성공 시 사용자 정보를 담은 JWT 토큰을 생성한다.
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="자격 증명이 유효하지 않습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    
    except JWTError:
        raise credentials_exception
    # DB 연결해서 사용자 조회
    db: Session = SessionLocal()
    user = db.query(models.User).filter(models.User.username == username).first()
    db.close()

    if user is None:
        raise credentials_exception
    return user


