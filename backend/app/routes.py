# app/routes.py

# 3차
# status.HTTP_204_NO_CONTENT와 같은 HTTP 상태 코드를 사용하기 위해 FastAPI의 status 모듈을 불러온다.
from fastapi import APIRouter , Depends, HTTPException, status 
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, security


router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/posts", response_model=List[schemas.PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).all()

# 상세 조회 API 추가
# /posts/3 같은 상세 게시글 요청을 처리하는 GET 라우팅 경로
# post_id는 URL 경로에서 자동ㅇ으로 추출되는 게시글의 ID이다.
# response_model=schemas.Post는 응답 데이터가 Post 스키마 형식임을 명시(타이틀, 내용, 작성자, id 포함)
@router.get("/posts/{post_id}", response_model=schemas.PostResponse)
# post_id: URL 경로에서 받은 게시글 ID를 int로 추론
# db: Session = Depend(get_db): FastAPI가 get_db()를 실행해서 DB 세션을 이 함수에 주입
def get_post(post_id: int, db: Session = Depends(get_db)):
    # SQLAlchemy ORM을 통해 Post 테이블에서 id가 post_id인 게시글을 조회
    # 결과가 없으면 None이 반환됨
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    # 해당 게시글이 없을 경우 404 에러 발생
    # FastAPI는 자동으로 JOSN 에러 응답을 생성: {"detail":"Post not found"}
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    # 죄회된 게시글 객체를 그대로 반환
    # FastAPI는 schemas.Post 기준으로 JSON 직렬화해 클라이언트에 응답
    return post


@router.post("/posts", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user) # 인증 사용자
    ):

    db_post = models.Post(
        title=post.title,
        content=post.content,
        author=current_user.username,   # 작성자 이름 자동 저장
        user_id=current_user.id         # 로그인한 사용자의 ID 저장
        # **post.dict()
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
    ):

    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    # 작성자 권한 확인
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="작성자만 삭제할 수 있습니다.")
    db.delete(post)
    db.commit()
    return


@router.patch("/posts/{id}", response_model=schemas.PostUpdate)
def update_post(
    id: int,
    post: schemas.PostUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
    ):
    db_post = db.query(models.Post).filter(models.Post.id == id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    # 작성자 권한 확인
    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="작성자만 수정할 수 있습니다.")
    
    if post.title is not None:
        db_post.title = post.title
    if post.content is not None:
        db_post.content = post.content
    if post.author is not None:
        db_post.author = post.author

    db.commit()
    db.refresh(db_post)
    return db_post

