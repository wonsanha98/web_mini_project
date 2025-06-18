# app/schemas.py 

# BaseModel은 FastAPI에서 사용하는 데이터 구조의 기본이 되는 클래스이다.
from pydantic import BaseModel

from typing import Optional # 선택적 필드 허용


# 사용자가 POST로 데이터를 보낼 때 필요한 필드들을 정의한다.
# 모두 문자열이며, 필수 입력값이다.
class PostBase(BaseModel):
    title: str
    content: str
    author: str

class PostCreate(PostBase):
    pass

# DB에서 조회된 결과는 id도 포함되므로 확장된 모델을 정의한다.
# PostBase를 상속해서 중복을 피하고, id만 추가한다.
class PostResponse(PostBase):
    id: int
    user_id: int    # 현재 로그인한 사용자 
    image_url: Optional[str] = None  # 추가


    # SQLAlchemy 모델을 반환할 때, 자동으로 dict처럼 변환해주는 설정이다.
    # 이 설정이 없으면 FastAPI가 응답을 직렬화할 때 오류가 날 수 있다.
    class Config:
        # Pydantic v2부터는 orm_mode가 아닌 from_attributes = True로 변경됨
        from_attributes = True 


# Optional[str]은 수정 시 일부 필드만 보내도 되도록 설정해준다.
# title, content, author 중 하나만 보내도 업데이트 가능하게 만든다.
class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None  #추가

# class CommentBase(BaseModel):
#     content: str
#     author: str

# 댓글 생성 시 필요한 데이터 구조를 정의한다. 댓글 내용과 작성자 이름은 필수이다.
class CommentCreate(BaseModel):
    content: str
    author: str
    user_id: int        # 추가

# DB에서 반환된 댓글을 응답할 때 사용하는 구조이다. 댓글 ID와 게시글 ID도 함께 포함된다.
# from_attributes = True는 SQLAlchemy 모델을 JSON 응답으로 자동 직렬화하기 위한 설정이다.
class CommentResponse(CommentCreate):
    id: int
    post_id: int
    user_id: int

    class Config:
        from_attributes = True 

class CommentUpdate(BaseModel):
    content: str

# 요청 및 응답용 데이터 구조(Pydantic 스키마) 정의
# 회원가입 시 필요한 요청 데이터 형식이다.
class UserCreate(BaseModel):
    username: str
    password: str

# 사용자 등록 후 클라이언트에게 반환할 응답 형식이다.
class UserResponse(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

# 로그인 성공 시 반환할 JWT 액세스 토큰의 구조이다.
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int


