from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, JsonResponse, Http404
from django.shortcuts import render
from django.urls import reverse
from django.template.defaulttags import register
from django.core.cache import cache


from gameboard.forms import LoginForm, RegisterForm, AddRoundForm, EditForm, EditGroupForm, AddGameForm
from gameboard.helpers.import_helper import ImportScores, ExportScores
from gameboard.helpers.queries import *
from gameboard.models import Player, Round, Game, Group


""" Helper functions """


def get_user_info(request):
    """
    A helper function which uses the user information in the request to get the Player object (which also contains the
    user object).

    :param request: A html request with user data (specifically username)
    :return: None if no user found, otherwise the Player object.
    """
    try:
        user = request.user
        if user.is_anonymous:
            return None
        else:
            return Player.objects.filter(user__username=user.username).first()
    except KeyError:
        return None


def get_user_info_by_username(username):
    """
    A helper function which uses the user information in the request to get the Player object (which also contains the
    user object).

    :param username: A html request with user data (specifically username)
    :return: None if no user found, otherwise the Player object.
    """
    try:
        return Player.objects.filter(user__username=username).first()
    except KeyError:
        return None


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


""" Non login required functions """


def index(request):
    """
    The index page for the game board application. This is a landing page encouraging new users to sign up. If they are
    signed in, redirect them to their dashboard.

    :param request: The user's request.
    :return: A rendering of a web page for the user to interact with. Either a splash page or a redirect.
    """
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(player))
    else:
        return render(request, "index.html")


def import_scores(request):
    """
    Imports a set of scores from a dataset in a standard format. See dataset.csv as an example.

    :param request: The user's request. Not uses in this function.
    :return: A redirect to the index page, once the import is complete.
    """
    ImportScores()

    return HttpResponseRedirect(reverse(index))


def export_scores(request):
    """
    Exports the data to a standard format that can be imported again later.

    :param request: The user's request. Not uses in this function.
    :return: Redirects to the index page, once the export is complete.
    """
    ExportScores()

    return HttpResponseRedirect(reverse(index))


def gb_login(request):
    """
    A page for registering or logging into the website. Requires a form to be filled out with valid data before the user
    is logged in.

    :param request: A html request. Must contain a post function to have the page react to the user's input.
    :return: A render template containing the register/login page. On success, a link to the index page.
    """
    # Don't need to render this page if the user is already logged in.
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(player))

    # Setup dictionary with data to be returned with render
    data = dict()

    # Setup basic forms
    login_form = LoginForm(prefix='login')

    # Only do things if the user has submitted data
    if request.method == "POST":
        # Validate the login form with user info
        login_form = LoginForm(request.POST, prefix='login')
        if login_form.is_valid():
            # Get the relevant cleaned data for creating a user
            username = login_form.cleaned_data['username']
            password = login_form.cleaned_data['password']

            # Authenticate the user, then log them in.
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)

                # Send the user to the index page (their profile page)
                return HttpResponseRedirect(reverse(index))

    # Set the data to whatever was figured out above
    data['login_form'] = login_form

    # Render the page
    return render(request, "login.html", data)


def gb_register(request):
    """
    A page for registering or logging into the website. Requires a form to be filled out with valid data before the user
    is created.

    :param request: A html request. Must contain a post function to have the page react to the user's input.
    :return: A render template containing the register/login page. On success, a link to the index page.
    """
    # Don't need to render this page if the user is already logged in.
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(player))

    # Setup dictionary with data to be returned with render
    data = dict()

    # Setup basic forms
    register_form = RegisterForm(prefix='register')

    # Only do things if the user has submitted data
    if request.method == "POST":
        # Create the form using the request
        register_form = RegisterForm(request.POST, prefix='register')

        # Check if the data is valid
        if register_form.is_valid():
            # Get the relevant cleaned data for creating a user
            first_name = register_form.cleaned_data['first_name']
            last_name = register_form.cleaned_data['last_name']
            username = register_form.cleaned_data['username']
            password = register_form.cleaned_data['password']

            # Create the django user object
            u = User(first_name=first_name, last_name=last_name, username=username, password=password)
            u.save()

            # Set it's password (for some reason providing the password doesnt work, have to set it again)
            u.set_password(password)
            u.save()

            # Tie the user to the player user object
            p = Player(user=u)
            p.save()
            p.user.save()

            # Login the user, and send them to the index page
            login(request, u)
            return HttpResponseRedirect(reverse(index))

    # Set the data to whatever was figured out above
    data['register_form'] = register_form

    # Render the page
    return render(request, "register.html", data)


""" Login required functions """


@login_required
def gb_logout(request):
    """
    A simple logout function.

    :param request: A html request, which contains the user's info.
    :return: A link to the index page.
    """
    logout(request)
    return HttpResponseRedirect(reverse(index))


@login_required
def player(request, player=None, message=None):
    """
    The player's main page, to be shown upon login. Also used to show sub tabs under the player including their
    statistics, trophies, and groups.

    :param request: A html request.
    :param player: A player's username (for looking at other players, not yourself)
    :param message: A message to display on the page in the case of an error.
    :return: A rendering of a web page for the user to interact with.
    """
    # Get game board user
    gb_user = get_user_info(request)

    # Setup dictionary with data to be returned with render
    data = dict()

    # Check if we are looking at another user, or ourselves
    if not player:
        player = gb_user
    else:
        player = get_user_info_by_username(player)
        if player is None:
            # Player provided isn't a real player, so 404
            raise Http404()

    # Create the objects in the data
    data["player"] = player
    data["groups"] = find_groups(gb_user)
    data["message"] = message

    # Add additional data based on the request.
    end_path = request.path_info.split('/')
    if len(end_path) > 1 and end_path[-2] == 'statistics':
        win_log, rate_log = find_player_monthly_log(player)
        data["win_time"] = win_log
        data["rate_time"] = rate_log
        favorites, game_rate_log = favorite_games(player)
        data["favorite"] = favorites
        data["win_game"] = game_rate_log
        data["activity"] = find_player_activity_log(player)
        return render(request, "player/statistics.html", data)
    elif len(end_path) > 1 and end_path[-2] == 'trophies':
        # Check the cache for the trophies for this group, so we don't have to run a long calculation.
        trophies = get_cache(player.primary_group, 'trophies')
        if trophies:
            # Cached, so return it
            data["trophies"] = trophies
        else:
            # Not cached, get the recent games first
            trophies = dict()
            trophies["recent"] = dict()
            trophies["recent"]["Most Unique Games"] = find_statistic(player.primary_group, "unique", "recent")
            trophies["recent"]["Most Wins"] = find_statistic(player.primary_group, "wins", "recent")
            trophies["recent"]["Most Heavy Wins"] = find_statistic(player.primary_group, "heavy", "recent")
            trophies["recent"]["Highest Win Percentage"] = find_statistic(player.primary_group, "percentage", "recent")
            for game in Game.objects.all():
                trophies["recent"]["Most {} Wins".format(game.name)] = find_statistic(player.primary_group, game.name, "recent")

            # Now get the data from past years
            year = datetime.now().date().year
            oldest = find_oldest_date().year
            while year >= oldest:
                year_str = str(year)
                trophies[year_str] = {}
                trophies[year_str]["Most Unique Games"] = find_statistic(player.primary_group, "unique", year_str)
                trophies[year_str]["Most Wins"] = find_statistic(player.primary_group, "wins", year_str)
                trophies[year_str]["Most Heavy Wins"] = find_statistic(player.primary_group, "heavy", year_str)
                trophies[year_str]["Highest Win Percentage"] = find_statistic(player.primary_group, "percentage", year_str)
                for game in Game.objects.all():
                    trophies[year_str]["Most {} Wins".format(game.name)] = find_statistic(player.primary_group, game.name, year_str)
                year -= 1

            # Store this info in a cache
            cache.set('trophies-{}'.format(player.primary_group.id), trophies, 86400)
            data["trophies"] = trophies
        return render(request, "player/trophies.html", data)
    elif len(end_path) > 1 and end_path[-2] == 'groups':
        # Get all the groups for this user
        data["groups"] = find_groups(player)

        # Get the status of all the players in each group
        status = {}
        for group in data["groups"]:
            for p in group.players.all():
                status[p.user.username] = find_player_status(p)
        data["status"] = status

        return render(request, "player/groups.html", data)
    else:
        # Get the various data points to fill out the profile page
        # primary_group = passed on via player object
        data['favorite_game'] = find_favorite_game(player)
        data['win_rate'] = find_win_percentage(player)
        # playing_since = passed on via player object

        return render(request, "player/profile.html", data)


@login_required
def group(request):
    """
    The group page, which contains statistics, graphs, and players within a group.

    :param request: A html request.
    :param message: A message to display on the page in the case of an error.
    :return:
    """
    gb_user = get_user_info(request)

    # Setup dictionary with data to be returned with render
    data = dict()

    # Get data for this group
    data["recent_games"] = search_games_by_group(gb_user.primary_group).order_by('-date')[0:10]  # Limit to the last 10.
    data['player'] = gb_user
    return render(request, "group.html", data)


@login_required
def edit_group(request):
    """
    Edit group information like what players and admins there are, as well as name.

    :param request:
    :return:
    """
    gb_user = get_user_info(request)

    data = dict()

    data['player'] = gb_user
    return render(request, "edit_group.html", data)


@login_required
def add_round(request):
    """
    A data entry page, which allows the user to enter a new game played, also known as a round.

    :param request: The user's request.
    :return: A rendering of a web page for the user to interact with.
    """
    # Get user
    gb_user = get_user_info(request)

    # Get ready with the data to send to the front end
    data = dict()

    add_round_form = AddRoundForm()
    # Only do things if the user has submitted data
    if request.method == "POST":
        # Create the form using the request
        add_round_form = AddRoundForm(request.POST)

        # Check if the data is valid
        if add_round_form.is_valid():
            group = find_groups(gb_user).first()
            game = add_round_form.cleaned_data.get('game')
            date = add_round_form.cleaned_data.get('date')
            players = add_round_form.cleaned_data.get('players').split(",")
            winners = add_round_form.cleaned_data.get('winners').split(",")

            # Valid, so add the new game played object
            game_played = Round()
            game_played.game = Game.objects.get(name__exact=game)
            game_played.date = date
            game_played.group = group
            game_played.save()

            for player in players:
                game_played.players.add(Player.objects.get(user__username__exact=player))
            for winner in winners:
                game_played.winners.add(Player.objects.get(user__username__exact=winner))

            clear_cache(gb_user.primary_group)

            response = JsonResponse({})
            response.status_code = 200
            return response
        else:
            # Non valid form, render it on the page
            response = JsonResponse({"error": add_round_form.errors})
            response.status_code = 400
            return response

    # Store the data and send to the view.
    data['add_round_form'] = add_round_form
    data['all_games'] = find_games()
    data['all_players'] = find_players_in_group(find_groups(gb_user).first())
    data['player'] = gb_user
    return render(request, "add_round.html", data)


@login_required
def add_game(request):
    """
    A data entry page, which allows the user to enter a new game played.

    :param request: The user's request.
    :return: A rendering of a web page for the user to interact with.
    """
    # Get user
    gb_user = get_user_info(request)

    # Get ready with the data to send to the front end
    data = dict()

    add_game_form = AddGameForm()
    # Only do things if the user has submitted data
    if request.method == "POST":
        # Create the form using the request
        add_game_form = AddGameForm(request.POST)

        # Check if the data is valid
        if add_game_form.is_valid():
            name = add_game_form.cleaned_data.get('name')
            description = add_game_form.cleaned_data.get('description')

            # Valid, so add the new game played object
            g = Game(name=name, description=description)
            g.save()

            return HttpResponseRedirect(reverse(add_round))

    # Store the data and send to the view.
    data['add_game_form'] = add_game_form
    data['all_games'] = find_games()
    data['player'] = gb_user
    return render(request, "add_game.html", data)


@login_required
def edit_player(request):
    """
    Edit player information, like username, name, password, and upload profile images.

    :param request: A html request, that needs a post request to submit data.
    :return: A rendering of the edit player page.
    """
    # Get user
    gb_user = get_user_info(request)

    # Get ready with the data to send to the front end
    data = dict()

    edit_form = EditForm(gb_user.user.username)
    # Only do things if the user has submitted data
    if request.method == "POST":
        # Create the form using the request
        edit_form = EditForm(gb_user.user.username, request.POST)

        profile_image = None
        if "photo" in request.FILES:
            profile_image = request.FILES['photo']
        # profile_image = request.FILES['profile_image']
        # Check if the data is valid
        if edit_form.is_valid():
            # Get the relevant cleaned data for creating a user
            username = edit_form.cleaned_data['username']
            first_name = edit_form.cleaned_data['first_name']
            last_name = edit_form.cleaned_data['last_name']
            favorite_game = edit_form.cleaned_data['favorite_game']
            password = edit_form.cleaned_data['password']

            # print("profile image is ",username, profile_image)

            if username:
                gb_user.user.username = username
            if first_name:
                gb_user.user.first_name = first_name
            if last_name:
                gb_user.user.last_name = last_name
            if favorite_game:
                gb_user.favorite_game = Game.objects.filter(name=favorite_game).first()
                gb_user.save()
            if password:
                gb_user.user.set_password(password)
            if profile_image:
                gb_user.profile_image = profile_image
                gb_user.save()
            gb_user.user.save()

            login(request, gb_user.user)
            return HttpResponseRedirect(reverse(index))

    data['edit_player_form'] = edit_form
    data['player'] = gb_user
    return render(request, "edit_player.html", data)


""" API Calls """

@login_required
def remove_round(request):
    print(request.POST)
    response = JsonResponse({})
    if request.POST.get('roundId'):
        Round.objects.filter(id=request.POST.get('roundId')).delete()
        response.status_code = 200
    else:
        response.status_code = 500
    return response
