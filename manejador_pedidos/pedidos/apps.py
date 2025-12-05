from django.apps import AppConfig


class PedidosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "pedidos"

    def ready(self):
        # Aquí podrías hacer cosas tipo "startup" si necesitas
        # from . import db
        # db.set_inventarios_db_sync()
        pass
