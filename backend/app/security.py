# app/security.py

from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 비밀번호 해싱 알고리즘 설정이다.(bcrypt 사용)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
