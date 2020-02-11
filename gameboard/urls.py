from django.urls import path
from gameboard.views import index, import_scores, group, add_round, player, gb_logout, edit_player, edit_group, \
    export_scores, gb_login, gb_register, add_game, remove_round
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    # Main page reference
    path('', index, name="index"),

    # Sets up database
    path('import/', import_scores, name="import"),
    path('export/', export_scores, name="export"),

    # Player specific pages
    path('player/', player, name="player"),
    path('player/<slug:player>/', player, name="player"),
    path('player/<slug:player>/profile/', player, name="player.profile"),
    path('player/<slug:player>/statistics/', player, name="player.statistics"),
    path('player/<slug:player>/trophies/', player, name="player.trophies"),
    path('player/<slug:player>/groups/', player, name="player.groups"),
    path('edit_player/', edit_player, name="edit_player"),

    # Group Pages
    path('group/', group, name="group"),
    path('edit_group/', edit_group, name="edit_group"),
    path('add_round/', add_round, name="add_round"),
    path('remove_round/', remove_round, name="remove_round"),

    # Site functionality
    path('logout/', gb_logout, name="logout"),
    path('login/', gb_login, name="login"),
    path('register/', gb_register, name="register"),

    # Game Pages
    path('add_game/', add_game, name="add_game"),
] + static(settings.STATIC_ROOT, document_root=settings.STATIC_ROOT)