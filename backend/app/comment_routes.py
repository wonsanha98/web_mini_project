# app/comment_routes.py

# FastAPI의 라우팅, 의존성 주입, 오류 응답 기능을 사용하기 위한 모듈을 불러온다.
from fastapi import APIRouter, Depends, HTTPException
# SQLAlchemy의 세션을 통해 데이터베이스에 접근할 수 있게 해준다.
from sqlalchemy.orm import Session
# 여러 댓글 응답을 리스트 형태로 반환할 때 사용할 타입 힌트를 제공하는 Python 기본 모듈이다.
from typing import List
# 같은 디렉토리 내에 있는 DB 모델 정의(models), 데이터 검증 스키마(schemas),DB 세션 설정(database)파일을 가져온다.
from . import models, schemas, database

# 댓글 관련 API엔드포인트를 따로 묶어 관리하기 위한 FastAPI 라우터 객체이다. main.py에서 이 라우터를 포함시킨다.
router = APIRouter()

# 기존처럼 SQLAlchemy 세션을 생성/종료하여 DB 접근을 담당한다.
# 의존성 주입으로 사용할 DB 세션 제공 함수이다.
def get_db():
    # SQLite와 연결된 세션 객체를 하나 생성한다.
    db = database.SessionLocal()
    # 호출자에게 세션을 넘겨주고 작업이 끝날 때까지 대기한다.
    try:
        yield db
    # 요청 처리 후 세션을 닫아 리소스를 반환한다.
    finally:
        db.close()

# 특정 게시글(post_id)에 달린 댓글들을 조회하는 GET API이다. 응답 형식은 댓글 리스트이다.
@router.get("/posts/{post_id}/comments", response_model=List[schemas.CommentResponse])
# URL 경로에서 post_id를 받고, DB 세션을 의존성으로 주입받는다.
def get_comments(post_id: int, db: Session = Depends(get_db)):
    # 주어진 게시글 ID에 해당하는 댓글들을 모두 조회해 리스트로 반환한다.
    return db.query(models.Comment).filter(models.Comment.post_id == post_id).all()

# 특정 게시글에 새로운 댓글을 추가하는 POST API이다. 응답은 작성된 댓글 하나이다.
@router.post("/posts/{post_id}/comments", response_model=schemas.CommentResponse)
# 요청 경로에서 post_id를 받고, 요청 본문에서 comment 데이터를 받아 사용한다.
def create_comment(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    # 댓글을 달고자 하는 게시글이 DB에 존재하는지 조회한다.
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    # 게시글이 없으면 404 오류를 발생시켜 클라이언트에 알려준다.
    if db_post is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    
    # Pydantic 객체를 딕셔너리로 바꾸고, post_id를 추가로 포함하여 새로운 댓글 ORM 객체를 생성한다.
    db_comment = models.Comment(**comment.dict(), post_id=post_id)
    # 이 객체를 세션에 추가해 저장 요청을 준비한다.
    db.add(db_comment)
    # 세션을 커밋하여 실제 DB에 반영한다.
    db.commit()
    # 방금 저장한 댓글을 새로 고침하여 자동 생성된 ID 값을 포함한 최신 상태로 가져온다.
    db.refresh(db_comment)
    # 저장된 댓글 객체를 반환하면 FastAPI가 JSON으로 자동 직렬화하여 응답한다.
    return db_comment
