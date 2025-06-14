# app/database.py

# create_engine 함수는 DB와 실제로 연결할 엔진을 만드는 역할을 한다.
# engine은 DB 연결의 핵심 객체로, SQLAlchemy가 SQL 문장을 실행하거나
# 세션을 통해 데이터를 주고받을 때 이 엔진을 통해 작동한다.
# 쉽게는 데이터베이스 연결선을 만드는 코드이다.
from sqlalchemy import create_engine

# 이 함수는 기반(Base)클래스를 생성해준다.
# 이걸 통해 나중에 만드는 Post 같은 모델 클래스들이 상속받을 기본 클래스가 생성된다.
# Base 클래스를 상속받으면 SQLAlchemy가 테이블을 인식해 테이블로 생성할 수 있다.
from sqlalchemy.ext.declarative import declarative_base

# DB와 통신하기 위한 세션(session)을 만들어주는 "세션 팩토리 함수"이다.
# sessionmaker()를 호출하면 새로운 세션 인스턴스를 만들어주는 클래스가 만들어진다.
# 세션은 DB에 연결해 데이터를 삽입하거나 가져올 때 반드시 필요하다.
from sqlalchemy.orm import sessionmaker

# 사용할 DB의 연결 문자열(주소)이다.
# 여기서는 SQLite를 사용하므로 "sqlite:///"로 시작한다.
# "./posts.db"는 현재 디렉토리의 posts.db 파일을 데이터베이스로 사용한다는 의미이다.
# 정리하면: 현재 경로에 posts.db 파일을 SQLite 데이터베이스로 만든다.
SQLALCHEMY_DATABASE_URL = "sqlite:///./posts.db"

# 위에서 만든 SQLALCHEMY_DATABASE_URL을 사용해 실제 DB 연결 엔진을 만든다.
# connect_args={"check_same_thread": False}는 SQLite에서만 필요한 옵션이다.
# 기본적으로 SQLite는 한 스레드에서만 DB에 접근할 수 있게 되어 있다.
# 하지만 FastAPI는 비동기 + 멀티스레드 환경이므로 이 설정을 끄지 않으면 에러가 발생한다.
# 이 엔진을 통해 SQL 쿼리를 실행하거나 ORM을 통한 조작이 가능해진다.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# sessionmaker를 통해 세션 인스턴스를 생성하는 팩토리 객체를 만든다.
# 나중에 이걸 호출해서 세션을 하나 만들고, 그걸 통해 DB와 통신한다.
# autocommit=False: 명시적으로 .commit()을 호출해야 DB에 반영된다.
# autoflush=False: 기본적으로 DB에 변경 내용을 즉시 반영하지 않고, 명시적으로 플러시한다/
# bind=engine: 이 세션은 위에서 만든 engine을 통해 DB와 연결된다.
# 이 SessionLocal()을 나중에 함수에서 호출해 사용한다.
# 예: db = SessionLocal()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 모든 모델 클래스(Post, User 등)의 부모 클래스가 되는 Base 객체를 생성한다.
# 나중에 모델을 정의할 때 사용한다.
Base = declarative_base()