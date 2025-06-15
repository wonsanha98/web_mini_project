# app/routes.py

# 1차 
# # FastAPI에서 라우팅을 쉽게 하기 위해 APIRouter 클래스를 가져온다.
# # 이걸 사용하면 main 애플리케이션과 분리해서 URL을 관리할 수 있어 구조화에 유리하다.
# # API 엔드포인트들을 이 파일(routes.py)에서 따로 분리해서 만들고 나중에 main.py에서 불러올 수 있다.
# from fastapi import APIRouter
# # 타입 힌트에 사용되는 List를 가져온다.
# # 예 :List[str]은 문자열로 구성된 리스트라는 의미이다.
# # 이 코드에서는 직접 사용되지는 않았지만, 나중에 API 반환 타입에 List[Post]와 같이 쓸 수 있다.
# from typing import List

# # 게시글 데이터를 저장하는 임시 리스트이다.
# # 실제로는 데이터 베이스를 사용하지만, 이는 임시로 사용한다.
# # 각 게시글은 딕셔너리(dictionary) 형태로 되어 있다: id, title, content, author 필드를 포함한다.
# posts = [
#     {"id": 1, "title": "첫 번째 게시글", "content": "내용입니다", "author": "홍길동"},
#     {"id": 2, "title": "두 번째 게시글", "content": "두 번째 내용입니다.", "author":"이순신"},   
# ]

# # APIRouter의 인스턴스를 생성한다.
# # 이 인스턴스를 통해 이 파일에서 여러 개의 API 경로를 등록할 수 있게 된다.
# # @router.get(...), @router.post(...) 형태로 경로를 지정할 수 있게 된다.
# router = APIRouter()

# # GET 요청 방식으로 /posts 경로가 호출되었을 때 어떤 함수를 실행할지 지정한다.
# # 사용자가 웹 브라우저 또는 React 프론트엔드에서 http://localhost:8000/posts로 GET 요청을 보내면 이 함수가 실행된다.
# @router.get("/posts")
# # 위의 /posts GET 요청이 들어왔을 때 실행되는 함수이다.
# # 게시글 목록을 가져오는 역할이다.
# def get_posts():
#     # 위에서 정한 임시 posts 리스트 전체를 반환한다. 
#     # FastAPI는 이 데이터를 자동으로 JSON 형식으로 바꿔서 응답한다.
#     return posts

# # POST 요청 방식으로 /posts로 요청이 들어올 경우 실행될 함수를 등록한다.
# # React 등에서 새 글을 보낼 때, 이 경로를 통해 요청을 보낸다.
# @router.post("/posts")
# # POST 요청 시, 클라이언트(React 프론트엔드)에서 보낸 게시글 데이터를 post라는 변수에 받아온다.
# # post는 딕셔너리 형태이다.
# # 나중에 FastAPI의 Pydantic을 이용해 구조화(PostCreateSchema 등)할 수 있다.
# def create_post(post: dict):
#     # 새 글의 ID를 생성한다. 현재 posts 리스트에 몇 개의 글이 있는지를 세어, 그 수 + 1로 새 ID를 할당한다.
#     # 예를 들어, 현재 글이 2개면 새 글은 id = 3이 된다.
#     new_id = len(posts) + 1
#     # 새로 받은 post 딕셔너리에 ID를 추가한다.
#     # 원래는 사용자로부터 받은 데이터에는 id가 없으므로 여기서 직접 설정해준다.
#     post["id"] = new_id
#     # post 딕셔너리를 posts 리스트에 추가한다.
#     # 서버의 메모리 상에 게시글이 저장된다. 
#     posts.append(post)
#     # 추가한 게시글 전체 데이터를 응답으로 반환한다.
#     # 프론트엔드는 이 데이터를 받아서 화면에 반영할 수 있다.
#     return post

# # 요약
# # /posts GET 요청: 모든 게시글 리스트를 응답
# # /posts POST 요청: 새 게시글을 받아 리스트에 추가하고, 그 게시글을 반환


# # 2차
# # APIRouter: 라우팅 기능을 모듈 단위로 분리해서 사용할 수 있도록 해주는 FastAPI의 클래스이다.
# # main.py에서 include_router()를 사용해 전체 앱에 연결한다.
# # Depends: FastAPI의 의존성 주입(Dependency Injection)기능이다.
# # Depends(get_db)는 get_db()의 리턴값을 자동으로 함수 인자로 주입해준다.(여기서는 DB 세션).
# from fastapi import APIRouter , Depends

# # Session: SQLAlchemy의 데이터베이스 세션 클래스이다.
# # DB 연결을 통해 데이터를 읽고 쓰는 작업은 이 세션을 통해 이루어진다.
# from sqlalchemy.orm import Session

# # 타입 힌트에 사용되는 List를 가져온다.
# # 예 :List[str]은 문자열로 구성된 리스트라는 의미이다.
# # 이 코드에서는 직접 사용되지는 않았지만, 나중에 API 반환 타입에 List[Post]와 같이 쓸 수 있다.
# from typing import List

# # 현재 디렉토리(app/)에서 세 개의 모듈을 가져온다.
# # models: SQLAlchemy ORM 모델(예: Post)
# # schemas: Pydantic 스키마(요청 및 응답 데이터 구조)
# # database: DB 연결 및 세션 설정을 포함하는 설정 파일
# from . import models, schemas, database


# # 라우터 객체를 생성한다.
# # 여기에 .get(), .post() 등의 라우팅 데코레이터를 붙여 여러 API 엔드포인트를 정의할 수 있다.
# # main.py에서 이 router를 앱에 연결한다: app.include_router(routes.router)
# router = APIRouter()

# # 이 함수는 DB 세션을 생성하고 반환(yield)하는 제너레이터이다.
# # FastAPI는 이 함수를 Depends()와 함께 사용할 때 자동으로:
# # SessionLocal()로 세션을 생성하고, 요청이 끝나면 자동으로 db.close()를 호출해 자원을 정리해준다.
# # 이는 의존성 주입용 함수로 사용된다.
# def get_db():
#     db = database.SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # /posts 경로로 GET 요청이 들어오면 get_posts() 함수가 실행된다.
# # response_model은 응답 데이터를 검증하고, JSON 형태로 자동 변환한다.
# # List[Post] -> 게시글 응답 객체의 리스트
# # FastAPI는 내부적으로 Pydantic 모델을 통해 응답의 스키마를 검증한다.
# @router.get("/posts", response_model=List[schemas.Post])

# # 이 함수는 get_db()를 통해 DB 세션을 자동으로 받아 사용한다/
# # db: Session -> sqlalchemy.orm.Session 타입의 세션 객체이다.
# def get_posts(db: Session = Depends(get_db)):
#     # DB의 Post 테이블에서 모든 레코드를조회하여 리스트로 반환한다.
#     # 이 리스트의 위의 response_model 설정에 의해 PostResponse 형식으로 자동 변환된다.
#     return db.query(models.Post).all()

# # /posts 경로로 POST 요청이 들어오면 create_post() 함수가 실행된다.
# # 프론트엔드에서 새 게시글 작성 요청을 보낼 때 사용한다.
# # 응답은 생성된 게시글 하나의 정보를 반환하며, Post 형식으로 변환된다.
# @router.post("/posts", response_model=schemas.Post)

# # 요청 본문에 담긴 JSON 데이터를 PostCreate 스키마로 파싱한다.
# # FastAPI는 Pydantic을 통해 자동으로 post 객체를 생성한다.
# # db는 Depends(get_db)로 받아온 DB 세션이다.
# def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
#     # post.dict()는 PostCreate 객체를 딕셔너리로 변환한다.
#     # ** 연산자를 사용해 이 딕셔너리 데이터를 Post ORM 모델 생성자에 전달한다.
#     # 결과적으로 Post(title=..., content=..., author=...) 같은 ORM 객체가 생성된다.
#     db_post = models.Post(**post.dict())
#     # 생성된 Post 객체를 DB에 추가하겠다고 SQLAlchemy 세션에 등록한다.
#     # 아직 실제로 DB에 반영되진 않았고, commit()을 해야 저장된다.
#     db.add(db_post)
#     # 위에서 등록한 객체를 DB에 영구 저장한다.
#     # 실제 SQLite 파일(posts.db)에 반영되는 시점이다.
#     db.commit()
#     # db_post 객체를 새로고침하여 DB에서 자동으로 생성된 필드(예: id)값을 가져온다.
#     # 이 과정을 거치면 응답 시에 ID 값도 포함된다.
#     db.refresh(db_post)
#     # 방금 저장한 게시글 ORM 객체를 반환한다.
#     # FastAPI는 이를 PostResponse 스키마로 직렬화하여 클라이언트에 JSON으로 응답한다.
#     return db_post


# 3차
# status.HTTP_204_NO_CONTENT와 같은 HTTP 상태 코드를 사용하기 위해 FastAPI의 status 모듈을 불러온다.
from fastapi import APIRouter , Depends, HTTPException, status 
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database


router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/posts", response_model=List[schemas.Post])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).all()

# 상세 조회 API 추가
# /posts/3 같은 상세 게시글 요청을 처리하는 GET 라우팅 경로
# post_id는 URL 경로에서 자동ㅇ으로 추출되는 게시글의 ID이다.
# response_model=schemas.Post는 응답 데이터가 Post 스키마 형식임을 명시(타이틀, 내용, 작성자, id 포함)
@router.get("/posts/{post_id}", response_model=schemas.Post)
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


@router.post("/posts", response_model=schemas.Post)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):

    db_post = models.Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# 삭제 API 추가
# DELETE /posts/{post_id} 경로에 요청이 오면 아래 함수를 실행한다.
# @router.delete: 해당 경로를 삭제용 HTTP 메서드로 설정한다.
# status_code=204: 성공 시, 본문 없이 성공했다는 의미의 HTTP 상태 코드 204 no Content를 응답한다.
@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
# 이 함수는 post_id와 db 세션을 입력받는다.
# post_id: int: URL 경로의 게시글 ID를 정수형으로 받는다.
# db: Session = Depends(get_db): Depends를 통해 SQLAlchemy 세션을 자동 주입받는다.
def delete_post(post_id: int, db: Session = Depends(get_db)):
    # Post 테이블에서 ID가 post_id인 게시글을 조회한다.
    # 결과가 없으면 None이 반환된다.
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    # 해당 게시글이 존재하지 않을 경우
    # 404 Not Found 오류를 발생시켜 클라이언트에게 게시글이 없다는 사실을 알린다.
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    # SQLAlchemy의 delete() 메서드로 해당 게시글을 삭제 대상에 등록한다.
    # 이 시점에서는 아직 실제 DB에서는 삭제되지 않았다.
    db.delete(post)
    # 등록된 삭제 작업을 식제 데이터베이스에 적용한다.
    # 게시글은 영구적으로 삭제된다.
    db.commit()
    # 204 No Content 상태 코드에 맞게, 아무 본문 없이 응답을 종료한다.
    return

# PATCH HTTP 메서드를 사용하여 특정 게시글(id) 일부를 수정한다.
# response_model은 클라이언트에게 반환할 데이터 형식을 명시한다.
# (PostUpdate 형태로 직렬화됨).
@router.patch("/posts/{id}", response_model=schemas.PostUpdate)

# update_post는 실제 요청이 들어왔을 때 실행되는 함수이다.
# id: URL 경로에서 전달받은 게시글 번호이다.
# post: schemas.PostUpdate: 클라이언트가 보낸 JSON 데이터를 PostUpdate Pydantic 모델로 변환해서 받는다. (Optional[str])
# db: Session = Depends(get_db): 데이터베이스 세션을 의존성 주입 방식으로 받아온다.
def update_post(id: int, post: schemas.PostUpdate, db: Session = Depends(get_db)):
    # 해당 id를 가진 게시글을 데이터베이스에서 조회한다.
    # first()를 통해 일치하는 첫 번째 게시글을 반환한다. 없으면 None.
    db_post = db.query(models.Post).filter(models.Post.id == id).first()
    # 게시글이 존재하지 않는다면 404 에러를 발생시켜 클라이언트에게 알려준다.
    if db_post is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    # 만약 title이 요청에 포함되어 있다면(null이 아니면) -> 제목을 새 값으로 수정한다.
    if post.title is not None:
        db_post.title = post.title
    # content가 전달된 경우에만 수정한다.
    if post.content is not None:
        db_post.content = post.content
    # author가 요청에 포함되어 있으면 해당 필드를 새 값으로 바꾼다.
    if post.author is not None:
        db_post.author = post.author
    
    # 변경 내용을 실제 데이터베이스에 반영한다.
    db.commit()
    # commit() 후 DB로부터 최신 정보를 다시 불러와 db_post 객체를 갱신한다. (자동 수정된 필드 포함)
    db.refresh(db_post)
    # 수정된 게시글 객체를 반환한다. FastAPI는 이를 PostResponse 형식의 JSON으로 자동 직렬화한다.
    return db_post


