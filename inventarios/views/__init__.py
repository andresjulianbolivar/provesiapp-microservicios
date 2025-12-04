from fastapi import APIRouter

from views import inventarios_view

API_PREFIX = "/api"
router = APIRouter()

router.include_router(inventarios_view.router, prefix=inventarios_view.ENDPOINT_NAME)