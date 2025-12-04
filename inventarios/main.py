import uvicorn
from fastapi import FastAPI
import views
from models import db


def create_app():
    app = FastAPI(
        docs_url="/inventarios/docs",
        openapi_url="/inventarios/openapi.json",
        redoc_url=None,
    )

    @app.on_event("startup")
    async def on_startup():
        await db.set_inventarios_db()

    app.include_router(views.router)

    return app


if __name__ == "__main__":
    app = create_app()
    # avoid redirects
    uvicorn.run(app, host="0.0.0.0", port=8080)
