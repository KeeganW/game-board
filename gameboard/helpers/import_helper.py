import csv
import os

from django.contrib.auth.models import User

from gameboardapp.settings import STATIC_ROOT, PROJECT_ROOT, BASE_DIR, APP_ROOT, MEDIA_ROOT
from datetime import datetime
from django.db import IntegrityError
from gameboard.models import Game, Round, Player, Group


class ImportScores:
    """
    Imports scores form a custom formatted csv (stored as a static file).
    """
    # The csv file to get data from
    dataset = os.path.join(STATIC_ROOT, 'dataset.csv')

    # Specific locations of columns within the csv
    date_loc = 0
    game_loc = 1
    coop = 2
    first_player_loc = 3

    # Storing the player information
    players = []

    def __init__(self):
        """
        Wipes all past data (be careful to only use this in a testing environment!) and then adds data. Adding starts
        with players, then games, then individual games by the date they were played. Assumes the dataset contains all
        games played by a single group, which hasn't been created yet.
        """
        # Wipe the db
        self.wipe_db()

        # Add all players from dataset
        group = self.add_players()

        # Add all games from the dataset
        self.add_games()

        # Create the games played for this group
        self.add_game_played(group)

    def wipe_db(self):
        """
        WARNING: This function wipes all data in the database. Be careful with its use!

        :return: None
        """
        Player.objects.all().delete()
        Game.objects.all().delete()
        Round.objects.all().delete()
        Group.objects.all().delete()

    def add_players(self):
        """
        Adds all the players within the csv to the Player database table.

        Gets the first line of the csv. Loops over all the players in that line (marked by location marks). Adds those
        players as users, with a temporary password (password) and usernames/first names corresponding
        to the player name.

        :return: None
        """
        with open(self.dataset, newline='') as f:
            # Get the first line
            reader = csv.reader(f)
            people = next(reader)
            self.players = people[self.first_player_loc:]
            group = Group(name="TAS and Friends")
            group.save()

            # Loop over those players
            for player in self.players:
                # try:
                print(player)
                # Set the user object
                username = player.replace(" ", "")
                u = User(first_name=player, last_name="", username=username)
                u.save()
                u.set_password("password")
                u.save()

                # Set the player object
                p = Player(user=u, date_of_birth=datetime.now(), primary_group=group)
                p.save()

                group.players.add(p)
                group.admins.add(p)
                # except IntegrityError:
                #     print("Player object exists already.")
                #     pass
            return group

    def add_games(self):
        """
        Adds all the games within the csv for later relation with the Round object.

        Loops through all lines in the sheet, looking at a specific column and pulling all the unique names it finds
        in that column.

        :return: None
        """
        with open(self.dataset, newline='') as f:
            # Open the csv
            reader = csv.reader(f)
            for line in reader:
                # Get the game data
                game = line[self.game_loc]
                if len(game) > 0:
                    try:
                        # Add it if it is unique
                        g = Game(name=game)
                        g.save()
                    except IntegrityError:
                        pass

    def add_game_played(self, group):
        """
        Adds all games that were played which were recorded, as long as they are properly formatted.

        :return: None
        """
        with open(self.dataset, newline='') as f:
            # Open the csv, and read through every line (but the header)
            reader = csv.reader(f)
            next(reader)  # skip header line

            for line in reader:
                # Get the game (if it is not there, ignore this line)
                game = line[self.game_loc]
                if len(game) > 0:
                    # Set local variables
                    players = list()
                    winners = list()

                    # Get the date the game was played on
                    date = datetime.strptime(line[self.date_loc], "%m/%d/%y")

                    # Get the players (and their win counts) that played on that day
                    player_stats = line[self.first_player_loc:]

                    # Loop through all the players who played
                    for player_index in range(len(player_stats)):
                        # Get their names, and the wins they had
                        player = self.players[player_index]
                        player_stat = player_stats[player_index]

                        if player_stat != "":
                            # Actually played in this game
                            players.append(player)

                            # Check if they won this game
                            if player_stat == "1":
                                winners.append(player)

                    self.enter_game_played(players, winners, game, date, group)

    def enter_game_played(self, players_names, winners_names, game, date, group):
        """
        Actually adds the game played to the database, linking to Player objects and Game objects.

        :param players_names: The names of the players
        :param winners_names: The names of the winners of the game
        :param game: The game that was played (string)
        :param date: A date object to use for when the game was played
        :return: None
        """
        try:
            game_played = Round()
            game_played.game = Game.objects.get(name__exact=game)
            game_played.date = date
            game_played.group = group
            game_played.save()

            for player in players_names:
                game_played.players.add(Player.objects.get(user__username__exact=player))
            for winner in winners_names:
                game_played.winners.add(Player.objects.get(user__username__exact=winner))
        except:
            print("Error entering game", game)
            pass


class ExportScores:
    """
    This class is used to export the database into a re-importable format
    """
    export_location = os.path.join(STATIC_ROOT, 'backup.csv')
    players = []

    def __init__(self):
        group = Group.objects.all().first()
        # Put the header at the top of the file
        self.add_header(group)

        # Add all thr game data
        self.add_all_rounds(group)

        pass

    def add_header(self, group):
        with open(self.export_location, mode='w') as f:
            f_write = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            line = ['Date', 'Game', 'Coop']
            for player in group.players.all():
                print(player)
                line.append(player.user.username)
                self.players.append(player.user.username)
            f_write.writerow(line)

    def add_all_rounds(self, group):
        with open(self.export_location, mode='a+') as f:
            f_write = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

            for round in Round.objects.filter(group_id=group.id).order_by('-date'):
                # Add first part of line
                line = [round.date.strftime("%m/%d/%y"), round.game.name, '']

                # Add player information
                for player in self.players:
                    line.append("")

                for player in round.players.all():
                    line[self.players.index(player.user.username) + 3] = 0

                for player in round.winners.all():
                    line[self.players.index(player.user.username) + 3] = 1

                f_write.writerow(line)
