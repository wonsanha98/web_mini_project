# init_db.py
# DB 초기화 
from app.database import Base, engine
from app import models 

print("⚠️ 모든 테이블을 삭제 후 재생성합니다...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ DB 초기화 완료!")