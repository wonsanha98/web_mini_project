# app/models.py

# SQLAlchemy의 주요 클래스들을 불러온다.
# Column: 테이블의 각 열(필드)을 정의할 때 사용한다.
# Integer: 정수형 타입을 의미한다.
# String: 문자열 타입(길이 지정 가능).
# Text: 긴 문자열(길이 제한 없음)을 저장할 때 사용한다.
from sqlalchemy import Column, Integer, String, Text

# 같은 디렉토리(app)내의 database.py 파일에서 Base를 불러온다.
# Base는 SQKAlchemy에서 모델을 만들기 위한 기초 클래스
# 여기서 정의하는 Post 모델은 이 Base를 상속받아야 실제로 테이블로 인식된다.
from .database import Base


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