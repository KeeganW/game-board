from collections import OrderedDict

from dateutil.relativedelta import relativedelta
from django.db.models import Count

from gameboard.models import Player, Round, Group, Game
from operator import itemgetter
from datetime import datetime, timedelta
from django.core.cache import cache


def find_win_percentage(player):
    """
    Calculate the win percentage for a player.

    :param player: A Player object, which contains the user info
    :return: The player's win percentage across all games played (and all groups)
    """
    percentage = 0
    if player:
        games_played = Round.objects.filter(players__user=player.user)
        wins = Round.objects.filter(winners__user=player.user)
        if len(games_played) > 0:
            percentage = (len(wins)/len(games_played)) * 100
    return percentage


def find_favorite_game(player):
    """
    Find the favorite game for a given player. Uses all game data to find what game they play the most.

    :param player: A Player object, which contains the user info
    :return: The player's favorite game (as an object).
    """
    fav_game = ''
    if player.favorite_game:
        return player.favorite_game
    if player:
        games_played = Round.objects.filter(players__user=player.user)
        game_dict = dict()
        for g in games_played:
            if g.game.name not in game_dict:
                game_dict[g.game.name] = 0
            game_dict[g.game.name] += 1

        max_count = 0 
        for name in game_dict:
            if game_dict[name] > max_count:
                max_count = game_dict[name]
                fav_game = name
    return fav_game


def find_players_in_group(group):
    """
    Find the players who have played a game.

    :param group: A Group object, which contains the group info
    :return: All players who have played a game in a group
    """
    group_id = group.id
    players_ids = Group.objects.filter(id=group_id).values('players')
    players = []
    for item in players_ids:
        players.append(Player.objects.filter(id=item["players"]).first())
    return players


def find_games():
    """
    Get all games
    TODO is this necessary?

    :return: All games as an queryset of objects
    """
    games = Game.objects.all()
    return games


def find_groups(player):
    """
    Finds all groups that a player is a part of

    :param player: A Player object, which contains the user info
    :return: A queryset of group objects the player belongs to
    """
    group = Group.objects.filter(players__user=player.user)

    return group


def find_num_player_in_group(group):
    """
    find the number of players in a group

    :param group: A Group object
    :return: number of players in the group
    """
    players = group.players.all()

    return (len(players))


def is_player_admin(group, player):
    """
    Determines if a player is an admin in a group or not.

    :param group: Thr group object to check
    :param player: The player object to check against
    :return: A boolean value
    """
    admins = group.admins.all()
    for admin in admins:
        if player.user.username == admin.user.username:
            return True
    return False


def clear_cache(group):
    """
    Clears all the cached item for a group, forcing a recalculation on the next use.

    :param group: The group to clear cache data for.
    :return: None
    """
    cache.delete('trophies-{}'.format(group.id))


def get_cache(group, name):
    """
    Gets a cache value for a group.

    :param group: The group to get cache data for
    :param name: The keyword used for the cache data.
    :return: Depends on what was cached, but defaults to None
    """
    if name == 'trophies':
        return cache.get('trophies-{}'.format(group.id))
    else:
        return None


def find_oldest_date():
    return Round.objects.all().order_by('-date').last().date


def search_wins_by_player(player):
    return Round.objects.filter(winners__user=player.user)


def search_wins_by_player_in_time(player, date_start, date_end):
    return search_wins_by_player(player).filter(date__range=(date_start, date_end))


def search_games_by_player(player):
    return Round.objects.filter(players__user=player.user)


def search_games_by_player_in_time(player, date_start, date_end):
    return search_games_by_player(player).filter(date__range=(date_start, date_end))


def search_games_by_group(group):
    return Round.objects.filter(group=group)


def search_games_by_group_in_time(group, date_start, date_end):
    return search_games_by_group(group).filter(date__range=(date_start, date_end))


def search_wins_by_player_in_time_for_heavy(player, date_start, date_end):
    return search_wins_by_player_in_time(player, date_start, date_end).filter(game__name__in=generate_heavy_game_list())


def search_wins_by_player_in_time_that_are_unique(player, date_start, date_end):
    return search_wins_by_player_in_time(player, date_start, date_end).order_by().values_list("game__name").distinct()


def search_wins_by_player_in_time_for_game(player, date_start, date_end, game):
    return search_wins_by_player_in_time(player, date_start, date_end).filter(game__name__exact=game)


def find_player_status(player):
    """
    Gets a string representing how active a player is across all groups.

    :param player: The player to check if they are active
    :return: A string(number of games needed), green(5), yellow(1-4), red (0)
    """
    # Get the dates for this search
    date_start, date_end = generate_dates("recent")

    # Search for recent games and count them
    recent_games = search_games_by_player_in_time(player, date_start, date_end).count()

    if recent_games > 4:
        return "green"
    elif recent_games > 0:
        return "yellow"
    else:
        return "red"


def find_player_monthly_log(player):
    # Get the dates for this search
    date_start, date_end = generate_dates("recent_year")

    date_log = ['Month']
    wins_log = ['Win Count']
    rate_log = ['Win Rate']

    total_months = lambda dt: dt.month + 12 * dt.year
    day = int(date_start.strftime("%d"))
    last_month = date_start
    for total_month in range(total_months(date_start), total_months(date_end)):
        year, month = divmod(total_month, 12)
        month_wins = search_wins_by_player_in_time(player, last_month, datetime(year, month + 1, day)).count()
        total_wins = search_wins_by_player_in_time(player, date_start, datetime(year, month + 1, day)).count()
        total_games = search_games_by_player_in_time(player, date_start, datetime(year, month + 1, day)).count()
        last_month = datetime(year, month + 1, 1)

        wins_log.append(month_wins)
        try:
            rate_log.append(round(total_wins/total_games*100, 2))
        except ZeroDivisionError:
            rate_log.append(0)
        date_log.append(last_month.strftime("%Y-%m-%d"))

    return [date_log, wins_log], [date_log, rate_log]


def favorite_games(player):
    # Get the dates for this search
    date_start, date_end = generate_dates("all")

    # Get all the games
    all_games = search_games_by_player_in_time(player, date_start, date_end)
    all_wins = search_wins_by_player_in_time(player, date_start, date_end)

    # Group the games by their game_id, then count how many of each id there are
    sorted_most_played = all_games.values("game_id").annotate(total=Count('game_id')).order_by('-total')
    sorted_most_wins = all_wins.values("game_id").annotate(total=Count('game_id')).order_by('-total')

    total_games = {}
    for game_count in sorted_most_played:
        total_games[game_count['game_id']] = game_count['total']

    favorites = []
    game_log = []
    win_rate = ['Win Rate']
    loop_count = 0
    other_count = 0
    # Reformat wins into simple array
    for game_win in sorted_most_wins:
        game = Game.objects.filter(id=game_win["game_id"]).first()
        if loop_count < 5:
            favorites.append([game.name, game_win["total"]])
            game_log.append(game.name)
            win_rate.append(round(game_win["total"]/total_games[game.id]*100, 2))
        else:
            # Add to "other"
            other_count += game_win["total"]
        loop_count += 1
    favorites.append(['Other Games', other_count])

    return favorites, [game_log, win_rate]


def find_player_activity_log(player):
    """

    :param player:
    :return:
    """
    # Get the dates for this search
    date_start, date_end = generate_dates("recent_year")

    # Search for recent games and count them
    recent_games = search_games_by_player_in_time(player, date_start, date_end)

    activity_log = list()

    # Make sure all dates are filled out
    delta = timedelta(days=1)
    while date_start <= date_end:
        activity_log.append({"date": date_start.strftime("%Y-%m-%d"), "game_count": len(recent_games.filter(date__exact=date_start.strftime("%Y-%m-%d")))})
        date_start += delta

    return activity_log


def generate_dates(date_string="all"):
    """
    Generates a pair of datetime objects, which represent a time range to search the database over. There are a few
    options:
        - A year, eg. "2020"
        - A month in the format "[month short name]-[year]", eg. "jan-2018" or "Jul-2020"
        - Within the last 30 days, "recent"
        - All time ranges, "all"
    The default option is "all".

    :param date_string: The string to parse that holds the intended time range.
    :return: A pair of datetime objects bracketing the range of interest.
    """
    # Attempt to convert this to an int
    try:
        date_int = int(date_string)
    except ValueError:
        date_int = None

    if date_int:
        # This is a year, so return the range of the year
        return datetime.strptime("{}-1-1".format(date_string), '%Y-%m-%d'), datetime.strptime("{}-12-31".format(date_string), '%Y-%m-%d')
    elif "-" in date_string:
        # This is a month in a year
        return datetime.strptime(date_string, '%b-%Y'), datetime.strptime(date_string, '%b-%Y') + relativedelta(months=1)
    elif date_string == "recent":
        # Just the last 30 days
        return datetime.now() - timedelta(days=30), datetime.now()
    elif date_string == "recent_year":
        # Just the last 30 days
        return datetime.now() - timedelta(days=366), datetime.now()
    else: # date_string == "all":
        # Get time since start of the epoch
        return datetime.strptime("1970-1-1", '%Y-%m-%d'), datetime.now()


def generate_heavy_game_list():
    """
    Simply returns a list of pre-defined "heavy" games which take more to win, or last longer than normal games.
    TODO make this a parameter to a group? Or a flag on a game?

    :return:
    """
    return ['Scythe', 'Twilight Imperium', 'Eclipse', 'Court of the Dead', 'Twilight Struggle']


def generate_trophies(sorted_tuples):
    """
    A system for assigning trophies (gold, silver, bronze) to a sorted list of tuples, where the highest values come
    first in the array.

    :param sorted_tuples: A list of tuples, where the first item in the tuple is a name, and the second is a value
    :return: A dictionary, containing gold silver and bronze lists that may or may not be empty
    """
    trophies = {"gold": [], "silver": [], "bronze": []}
    total_trophies_given = 0
    for leader_id in range(len(sorted_tuples)):
        leader = sorted_tuples[leader_id]
        if total_trophies_given == 0:
            # This is the first trophy, it must be gold.
            trophies['gold'].append(leader)
        else:
            if trophies['gold'][0][1] == leader[1]:
                # This person is just as good as the gold player, so add them to gold.
                trophies['gold'].append(leader)
            elif len(trophies['silver']) == 0 or trophies['silver'][0][1] == leader[1]:
                # This person is the first silver trophy (but not gold), or is just as good as the current silver trophy
                trophies['silver'].append(leader)
            elif len(trophies['bronze']) == 0 or trophies['bronze'][0][1] == leader[1]:
                trophies['bronze'].append(leader)
        total_trophies_given += 1
        if total_trophies_given >= 3:
            # Check if it is safe to do a lookahead
            if leader_id + 1 >= len(sorted_tuples):
                break  # End of the list, so return
            else:
                # Check if the current value is equal to the next. If so, we want to add the next value too
                if sorted_tuples[leader_id + 1][1] != leader[1]:
                    break  # Next value is worse, so return

    return trophies


def find_statistic(group, type, date_string="all"):
    """
    Search a group over a time range for a type of statistic. Here are the statistics you can search, which is set by
    setting the type to the following strings:
        - "wins": The number of wins per player
        - "percentage": The win percentage of a player over the time period
        - "heavy": Only heavy games (as set by the game's heavy flag)
        - "unique": Number of unique game wins

    :param group: The group object of interest
    :param type: A string to query for, see above for possibilities
    :param date_string: A string to represent a time range of interest (see generate_dates())
    :return: A sorted list of tuples, where the first value is the username, and the second is the result of the type
    """
    return_list = []

    # Get the dates for this search
    date_start, date_end = generate_dates(date_string)

    # Loop through all the players
    players = group.players.all()
    for player in players:
        query_result = 0
        if type == "wins":
            query_result = search_wins_by_player_in_time(player, date_start, date_end).count()
        elif type == "percentage":
            try:
                query_result = search_wins_by_player_in_time(player, date_start, date_end).count() / \
                               search_games_by_player_in_time(player, date_start, date_end).count() * 100
                query_result = '{0:.2f}'.format(query_result)
            except ZeroDivisionError:
                # This player hasn't played any games
                query_result = 0
        elif type == "heavy":
            query_result = search_wins_by_player_in_time_for_heavy(player, date_start, date_end).count()
        elif type == "unique":
            query_result = search_wins_by_player_in_time_that_are_unique(player, date_start, date_end).count()
        else:
            # This might be a game, lets try to find this
            if Game.objects.filter(name__exact=type):
                query_result = search_wins_by_player_in_time_for_game(player, date_start, date_end, type).count()
                # if query_result < 5:
                #     query_result = 0

        if float(query_result) > 0:
            return_list.append((player.user.username, query_result))

    return generate_trophies(sorted(return_list, key=itemgetter(1), reverse=True))
