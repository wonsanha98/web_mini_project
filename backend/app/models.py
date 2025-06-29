# app/models.py

# SQLAlchemy의 주요 클래스들을 불러온다.
# Column: 테이블의 각 열(필드)을 정의할 때 사용한다.
# Integer: 정수형 타입을 의미한다.
# String: 문자열 타입(길이 지정 가능).
# Text: 긴 문자열(길이 제한 없음)을 저장할 때 사용한다.
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime

# 같은 디렉토리(app)내의 database.py 파일에서 Base를 불러온다.
# Base는 SQKAlchemy에서 모델을 만들기 위한 기초 클래스
# 여기서 정의하는 Post 모델은 이 Base를 상속받아야 실제로 테이블로 인식된다.
from .database import Base

from datetime import datetime
from sqlalchemy.orm import relationship

# Post라는 클래스를 정의한다.
# 이 클래스는 게시글 한 개를 표현하는 모델(Model)이다.
# Base를 상속받음으로써, SQLAlchemy가 이 클래스를 DB 테이블로 변환할 수 있게 된다.
class Post(Base):

    # 실제 데이터베이스에서 이 모델을 저장할 테이블 이름을 지정한다.
    # 이 Post 모델은 posts라는 이름의 테이블로 저장된다.
    __tablename__ = "posts"
    
    # id: 게시글의 고유 번호이다.
    # Integer: 정수형 타입
    # primary_key=True: 이 칼럼을 테이블의 기본 키(Primary Key)로 설정한다.
    # index=True: 검색 속도를 높이기 위해 이 칼럼에 인덱스를 생성한다.
    id = Column(Integer, primary_key=True, index=True)
    # title: 게시글의 제목이다.
    # String(200): 최대 200자의 문자열.
    # nullable=False: 이 필드는 비워둘 수 없다(필수 항목).
    title = Column(String(200), nullable=False)
    # content: 게시글 본문이다.
    # Text: 긴 문자열을 저장할 수 있다.
    content = Column(Text, nullable=False)
    # author: 글을 쓴 사람의 이름이다.
    # String(100): 최대 100자의 문자열.
    author = Column(String(100), nullable=False)

    # 추가
    # 하나의 게시글(Post)이 여러 댓글(Comment)을 가질 수 있도록 관계를 설정한다. 게시글 삭제 시 연결된 댓글도 함께 삭제된다.
    comments = relationship("Comment", back_populates="post", cascade="all, delete")

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="posts")
    image_url = Column(String, nullable=True)  # 추가
    image_filename = Column(String) # 추가

# 댓글(Comment)모델 추가
# SQLAlchemy ORM에서 댓글 테이블 생성을 위한 Comment 모델 클래스를 정의한다.
class Comment(Base):
    # 실제 DB에서 사용될 테이블 이름을 Comments로 지정한다.
    __tablename__ = "comments"
    # 각 댓글의 고유 식별자 역할을 하는 id 필드이다. 자동으로 증가혐 인덱스가 설정된다.
    id = Column(Integer, primary_key=True, index=True)
    # 댓글이 속한 게시글의 ID를 저장하는 외래 키(foreign key)이다. post.id를 참조한다.
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    # 댓글의 실제 내용을 저장하는 필드이다. 비어있을 수 없다.
    content = Column(Text, nullable=False)
    # 댓글 작성자의 이름을 저장하는 필드이다. 비어 있을 수 없다.
    author = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Post 모델과 양방향 관계를 맺는 부분이다. 게시글(Post)이 갖는 댓글 리스트와 연결된다.
    post = relationship("Post", back_populates="comments")

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="comments")



# User 모델 생성
# 관계 설정(Post.user, Comment.user)은 이후 확장 가능하며, 현재 동작에는 문제가 없음
# 이 클래스는 데이터베이스에 "users"라는 테이블을 생성한다.
class User(Base):
    __tablename__ = "users"

    # 사용자마다 고유한 ID를 부여하는 기본 키이다.
    id = Column(Integer, primary_key=True, index=True)
    # 사용자 이름이며, 중복되지 않도록 unique 제약을 둔다.
    username = Column(String, unique=True, index=True)
    # 실제 비밀번호가 아닌 해싱된 비밀번호를 저장한다.
    hashed_password = Column(String)

    posts = relationship("Post", back_populates="user")
    comments = relationship("Comment", back_populates="user")


