# app/routes.py

# 3차
# status.HTTP_204_NO_CONTENT와 같은 HTTP 상태 코드를 사용하기 위해 FastAPI의 status 모듈을 불러온다.
from fastapi import APIRouter , Depends, HTTPException, status, UploadFile, File, Form 
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas, database, security
import shutil
import os
import uuid

UPLOAD_DIR = "static/images"  # 파일 경로
os.makedirs("static/images", exist_ok=True)

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
    image_url = f"/static/images/{post.image_filename}" if post.image_filename else None
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "author": post.author,
        "user_id": post.user_id,
        "image_url": image_url
    }

@router.post("/posts", response_model=schemas.PostResponse)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # 파일 처리
    filename = None
    if file:
        ext = file.filename.split('.')[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        save_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    db_post = models.Post(
        title=title,
        content=content,
        author=current_user.username,
        user_id=current_user.id,
        image_filename=filename  # 여기에 저장
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return {
        "id": db_post.id,
        "title": db_post.title,
        "content": db_post.content,
        "author": db_post.author,
        "user_id": db_post.user_id,
        "image_url": f"/static/{db_post.image_filename}" if db_post.image_filename else None
    }

# @router.post("/upload-image/")
# async def upload_image(file: UploadFile = File(...)):
#     file_ext = file.filename.split(".")[-1]
#     unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
#     save_path = f"static/images/{unique_filename}"

#     with open(save_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
    
#     image_url = f"/static/images/{unique_filenamd}"
#     return {"image_url": image_url}


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


# @router.patch("/posts/{id}", response_model=schemas.PostResponse)
# async def update_post(
#     post_id: int,
#     title: str = Form(...),
#     content: str = Form(...),
#     file: Optional[UploadFile] = File(None),
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(security.get_current_user)
# ):
#     post = db.query(models.Post).filter(models.Post.id == post_id).first()
#     if not post:
#         raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
#     if post.user_id != current_user.id:
#         raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")

#     post.title = title
#     post.content = content

#     if file:
#         ext = file.filename.split('.')[-1]
#         filename = f"{uuid.uuid4().hex}.{ext}"
#         save_path = os.path.join(UPLOAD_DIR, filename)
#         with open(save_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         post.image_filename = filename

#     db.commit()
#     db.refresh(post)
#     return post
    
@router.patch("/posts/{id}", response_model=schemas.PostResponse)
async def update_post(
    id: int,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),  # 이미지 업로드
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_post = db.query(models.Post).filter(models.Post.id == id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")

    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="작성자만 수정할 수 있습니다.")

    # 텍스트 필드 업데이트
    if title is not None:
        db_post.title = title
    if content is not None:
        db_post.content = content
    if author is not None:
        db_post.author = author

    # 이미지 파일 처리
    if file:
        # 기존 이미지 삭제
        if db_post.image_filename:
            old_path = os.path.join(UPLOAD_DIR, db_post.image_filename)
            if os.path.exists(old_path):
                os.remove(old_path)

        # 새 이미지 저장
        filename = f"post_{id}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # 디렉토리 없으면 생성
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        db_post.image_filename = filename

    db.commit()
    db.refresh(db_post)

    return db_post
