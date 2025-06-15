# app/main.py

# FastAPI는 Python의 웹 프레임워크이다.
# FastAPI 클래스는 웹 애플리케이션 인스턴스를 생성할 때 사용된다.
# 이 객체는 웹 서버에서 라우팅, 요청 처리 등을 담당한다.
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware # CORS 관련 모듈 추가

# engine은 SQLite 데이터베이스에 연결된 객체이다. 여기에 테이블을 생성한다.
from .database import engine


# app/routes.py 파일에 있는 router 객체를 가져온다.
# 이 router는 @router.get(...), @router.post(...) 같은 경로 설정을 모아둔 그룹이다.
# 이렇게 분리하면 코드가 깔끔해지고 유지보수가 쉬워진다.
from . import routes

# 모델 정의 불러오기
from . import models 

from . import comment_routes

# FastAPI 애플리케이션 인스턴스를 생성한다.
# 이 인스턴트 app은 실제 웹 서버의 본체라고 생각하면된다.
# 이후 이 app에 다양한 설정(라우팅, 미들웨어, 오류 처리 등)을 붙여나간다.
app = FastAPI()

# CORS 설정
# 해당 코드가 없으먄 React -> FastAPI 요청 시 CORS 에러 발생
app.add_middleware(
    CORSMiddleware,
    # 실 배포시 해당 주소 대신 실제 배포된 프론트 주소로 변경해야함
    allow_origins=["http://localhost:3000"], # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],                     # 모든 HTTP 메서드 허용
    allow_headers=["*"],                     # 모든 헤더 허용
)


# models.py에 정의한 모든 클래스(Post 등)를 테이블로 변환하여 DB에 실제 생성한다.
# 이미 존재하는 테이블은 건너뛴다. 
# bind=engine은 어떤 DB에 테이블을 만들지 지정한다.(여기서는 posts.db).
models.Base.metadata.create_all(bind=engine)

# 위에서 불러온 router를 FastAPI 앱에 등록한다.
# routes.py에서 정의한 /posts/경로들을 실제 서버에 연결하는 작업이다.
# 이 코드가 없으면 routes.py에서 정의한 API는 동작하지 않는다.
app.include_router(routes.router)


app.include_router(comment_routes.router)

# 요약 
# main.py는 FastAPI 서버의 진입점이다.
# FastAPI() 객체를 만들고, include_router()를 통해 URL 경로를 등록한다.
# 전체 구조는 Django의 urls.py와 views.py를 연결하는 것과 비슷한 흐름이다.